import { useCallback, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { validateRepoUrl } from "@/lib/repoFiles";

const pageItems = (page) => (Array.isArray(page) ? page : page?.items || []);

export function useWorkspace() {
  const [repo, setRepo] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);
  const [messages, setMessages] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [searches, setSearches] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileStatus, setFileStatus] = useState("idle");
  const [fileError, setFileError] = useState("");
  const [asking, setAsking] = useState(false);
  const [testAnalysing, setTestAnalysing] = useState(false);
  const [includeTree, setIncludeTree] = useState(true);
  const bootstrapped = useRef(false);

  const loadRecent = useCallback(async () => {
    const page = await base44.entities.Repository.list("-created_date", 8);
    setRecent(pageItems(page));
  }, []);

  const loadRecords = useCallback(async (repositoryId) => {
    const [messagePage, runPage] = await Promise.all([
      base44.entities.ChatMessage.filter({ repository_id: repositoryId }, { sort: "created_date", limit: 200 }),
      base44.entities.TestRun.filter({ repository_id: repositoryId }, { sort: "-created_date", limit: 20 }),
    ]);
    const all = pageItems(messagePage);
    setMessages(all.filter((item) => (item.kind || "chat") === "chat"));
    setExplanations(all.filter((item) => item.kind === "explanation"));
    setSearches(all.filter((item) => item.kind === "search"));
    setTestRuns(pageItems(runPage));
  }, []);

  const analyze = useCallback(
    async (rawUrl) => {
      const check = validateRepoUrl(rawUrl);
      if (!check.ok) {
        setStatus("error");
        setError(check.error);
        return;
      }
      setStatus("analyzing");
      setError("");
      setActiveFile(null);
      setFileStatus("idle");
      setFileError("");

      try {
        const response = await base44.functions.invoke("analyzeRepository", { repo_url: check.url });
        const data = response?.data || {};
        if (!data.ok) throw new Error(data.error || "That repository could not be analysed.");

        const record = await base44.entities.Repository.create({
          ...data.repository,
          languages: data.languages || [],
          primary_language: data.primary_language || "",
          total_files: data.total_files || 0,
          files: data.files || [],
          entry_points: data.entry_points || [],
          config_files: data.config_files || [],
          dependency_files: data.dependency_files || [],
          readme_excerpt: data.readme_excerpt || "",
          analysis_status: data.analysis_status || "analyzed",
          tree_truncated: Boolean(data.tree_truncated),
          notes: data.notes || [],
        });

        setRepo(record);
        setMessages([]);
        setExplanations([]);
        setSearches([]);
        setTestRuns([]);
        setStatus("ready");
        loadRecent();
      } catch (err) {
        setStatus("error");
        setError(err?.message || "Something went wrong while analysing that repository.");
      }
    },
    [loadRecent]
  );

  const reset = useCallback(() => {
    setRepo(null);
    setStatus("idle");
    setError("");
    setMessages([]);
    setExplanations([]);
    setSearches([]);
    setTestRuns([]);
    setActiveFile(null);
    setFileStatus("idle");
    setFileError("");
    if (window.location.search) window.history.replaceState({}, "", "/workspace");
    loadRecent();
  }, [loadRecent]);

  const resume = useCallback(
    async (record) => {
      setRepo(record);
      setStatus("ready");
      setError("");
      setActiveFile(null);
      setFileStatus("idle");
      await loadRecords(record.id);
    },
    [loadRecords]
  );

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const requested = new URLSearchParams(window.location.search).get("repo");
    loadRecent();
    if (requested) {
      analyze(requested);
      return;
    }
    (async () => {
      const page = await base44.entities.Repository.list("-created_date", 1);
      const [latest] = pageItems(page);
      if (latest) resume(latest);
    })();
  }, [analyze, loadRecent, resume]);

  const openFile = useCallback(
    async (path) => {
      if (!repo || !path) return;
      setActiveFile({ path });
      setFileStatus("loading");
      setFileError("");
      try {
        const response = await base44.functions.invoke("fetchRepositoryFile", {
          owner: repo.owner,
          repo: repo.repo,
          ref: repo.default_branch,
          path,
        });
        const data = response?.data || {};
        if (!data.ok) {
          setFileStatus("error");
          setFileError(data.error || "That file could not be opened.");
          return;
        }
        setActiveFile(data);
        setFileStatus("ready");
      } catch (err) {
        setFileStatus("error");
        setFileError(err?.message || "That file could not be opened.");
      }
    },
    [repo]
  );

  const pushMessage = useCallback((record) => {
    const kind = record.kind || "chat";
    if (kind === "explanation") setExplanations((prev) => [...prev, record]);
    else if (kind === "search") setSearches((prev) => [...prev, record]);
    else setMessages((prev) => [...prev, record]);
  }, []);

  const ask = useCallback(
    async (question, mode = "question") => {
      const text = String(question || "").trim();
      if (!repo || !text || asking) return;
      const kind = mode === "explanation" ? "explanation" : mode === "find_files" ? "search" : "chat";
      const filePath = activeFile?.path || activeFile?.error ? activeFile?.path || "" : "";
      setAsking(true);

      try {
        const userRecord = await base44.entities.ChatMessage.create({
          repository_id: repo.id,
          role: "user",
          kind,
          content: text,
          file_path: filePath,
        });
        if (kind === "chat") pushMessage(userRecord);

        const history = messages
          .slice(-6)
          .map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${String(item.content || "").slice(0, 400)}`);

        const response = await base44.functions.invoke("askRepository", {
          question: text,
          mode,
          repository: {
            full_name: repo.full_name,
            description: repo.description,
            primary_language: repo.primary_language,
            default_branch: repo.default_branch,
            entry_points: repo.entry_points,
            dependency_files: repo.dependency_files,
          },
          total_files: repo.total_files,
          file_tree: includeTree ? (repo.files || []).map((file) => file.path) : [],
          file_path: filePath,
          file_content: activeFile?.content || "",
          language: activeFile?.language || "",
          history,
        });

        const data = response?.data || {};
        if (!data.ok) throw new Error(data.error || "The assistant could not answer that question.");

        const assistantRecord = await base44.entities.ChatMessage.create({
          repository_id: repo.id,
          role: "assistant",
          kind,
          content: data.answer,
          references: data.references || [],
          file_path: filePath,
        });
        pushMessage(assistantRecord);
        return assistantRecord;
      } catch (err) {
        const failed = await base44.entities.ChatMessage.create({
          repository_id: repo.id,
          role: "assistant",
          kind,
          content: `I could not answer that. ${err?.message || "Please try again."}`,
          failed: true,
        }).catch(() => null);
        pushMessage(
          failed || {
            id: `local-${Date.now()}`,
            role: "assistant",
            kind,
            content: `I could not answer that. ${err?.message || "Please try again."}`,
            failed: true,
          }
        );
      } finally {
        setAsking(false);
      }
    },
    [repo, asking, activeFile, messages, includeTree, pushMessage]
  );

  const analyseTestOutput = useCallback(
    async (rawOutput, testCommand) => {
      if (!repo || !String(rawOutput || "").trim()) return { ok: false, error: "Paste test output first." };
      setTestAnalysing(true);
      try {
        const response = await base44.functions.invoke("explainTestError", {
          raw_output: rawOutput,
          test_command: testCommand,
          repository: { full_name: repo.full_name, primary_language: repo.primary_language },
        });
        const data = response?.data || {};
        if (!data.ok) throw new Error(data.error || "That output could not be explained.");

        const record = await base44.entities.TestRun.create({
          repository_id: repo.id,
          raw_output: rawOutput,
          summary: data.summary || "",
          total: data.counts?.total || 0,
          passed: data.counts?.passed || 0,
          failed: data.counts?.failed || 0,
          counts_detected: Boolean(data.counts?.detected),
          explanation: data.explanation,
          suggested_fixes: data.suggested_fixes || [],
          referenced_files: data.referenced_files || [],
        });
        setTestRuns((prev) => [record, ...prev]);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err?.message || "That output could not be explained." };
      } finally {
        setTestAnalysing(false);
      }
    },
    [repo]
  );

  const clearChat = useCallback(async () => {
    if (!repo) return;
    await base44.entities.ChatMessage.deleteMany({ repository_id: repo.id });
    setMessages([]);
    setExplanations([]);
    setSearches([]);
  }, [repo]);

  const clearTests = useCallback(async () => {
    if (!repo) return;
    await base44.entities.TestRun.deleteMany({ repository_id: repo.id });
    setTestRuns([]);
  }, [repo]);

  const removeAnalysis = useCallback(async () => {
    if (!repo) return;
    await base44.entities.ChatMessage.deleteMany({ repository_id: repo.id });
    await base44.entities.TestRun.deleteMany({ repository_id: repo.id });
    await base44.entities.Repository.delete(repo.id);
    setRepo(null);
    setMessages([]);
    setExplanations([]);
    setSearches([]);
    setTestRuns([]);
    setActiveFile(null);
    setFileStatus("idle");
    setStatus("idle");
    setError("");
    if (window.location.search) window.history.replaceState({}, "", "/workspace");
    loadRecent();
  }, [repo, loadRecent]);

  return {
    repo,
    status,
    error,
    recent,
    messages,
    explanations,
    searches,
    testRuns,
    activeFile,
    fileStatus,
    fileError,
    asking,
    testAnalysing,
    includeTree,
    setIncludeTree,
    analyze,
    resume,
    reset,
    openFile,
    ask,
    analyseTestOutput,
    clearChat,
    clearTests,
    removeAnalysis,
  };
}