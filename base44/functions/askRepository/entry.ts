import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";

const MAX_QUESTION = 1500;
const MAX_FILE_CHARS = 18000;
const MAX_TREE_PATHS = 250;

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string" },
    references: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          lines: { type: "string" },
          note: { type: "string" },
        },
        required: ["path"],
      },
    },
  },
  required: ["answer"],
};

const TASKS = {
  explain_file:
    "Task: explain the file below to a beginner. Cover what the file is for, how it is organised, the important functions or classes, and how it fits into the rest of the project. Finish with one short line telling the reader which file to look at next.",
  find_files:
    "Task: from the file list, identify the files most relevant to what the user describes. Explain briefly why each one matters. Only reference files that appear in the list.",
  question: "Task: answer the user's question about this repository.",
};

function buildContext(body) {
  const repository = body.repository || {};
  const tree = Array.isArray(body.file_tree) ? body.file_tree.slice(0, MAX_TREE_PATHS) : [];
  const lines = [];

  lines.push("Repository context");
  lines.push(`Name: ${repository.full_name || "unknown"}`);
  if (repository.description) lines.push(`Description: ${repository.description}`);
  if (repository.primary_language) lines.push(`Primary language: ${repository.primary_language}`);
  if (repository.default_branch) lines.push(`Default branch: ${repository.default_branch}`);
  if (Array.isArray(repository.entry_points) && repository.entry_points.length) {
    lines.push(`Entry-point files identified: ${repository.entry_points.join(", ")}`);
  }
  if (Array.isArray(repository.dependency_files) && repository.dependency_files.length) {
    lines.push(`Dependency files: ${repository.dependency_files.join(", ")}`);
  }

  lines.push("");
  lines.push(`File list (${tree.length} of ${body.total_files || tree.length} files):`);
  lines.push(tree.length ? tree.join("\n") : "(no file list available)");

  const filePath = String(body.file_path || "").trim();
  const fileContent = String(body.file_content || "").slice(0, MAX_FILE_CHARS);
  if (filePath && fileContent) {
    lines.push("");
    lines.push(`Open file: ${filePath}${body.language ? ` (${body.language})` : ""}`);
    lines.push("```");
    lines.push(fileContent);
    lines.push("```");
  }

  if (Array.isArray(body.history) && body.history.length) {
    lines.push("");
    lines.push("Recent conversation (oldest first):");
    lines.push(body.history.join("\n"));
  }

  return lines.join("\n");
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const question = String(body.question || "").trim().slice(0, MAX_QUESTION);
    if (!question) {
      return Response.json({ ok: false, error: "Ask a question about the repository first." }, { status: 400 });
    }

    const mode = TASKS[body.mode] ? body.mode : "question";
    const prompt = [
      "You are RepoSathi AI, a repository assistant that helps students and beginner developers understand an unfamiliar codebase.",
      "",
      "Rules:",
      "- Use only the repository context below. Never invent files, functions, line numbers or behaviour.",
      "- If the context is not enough to answer, say plainly which file the user should open next.",
      "- Write for a beginner: plain language, short paragraphs or a short list, no marketing language.",
      "- Reference real paths that appear in the context. Only add a line range (for example src/app.js:12-30) when you were given the file content. Otherwise leave lines empty.",
      "- Never claim that you ran, executed or tested any code.",
      "",
      buildContext(body),
      "",
      TASKS[mode],
      "",
      `User: ${question}`,
      mode === "explain_file"
        ? "Begin your answer by naming the file you are explaining."
        : "Answer the user directly.",
    ].join("\n");

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: ANSWER_SCHEMA,
    });

    const data = response && typeof response === "object" ? response : {};
    const answer = typeof data.answer === "string" ? data.answer.trim() : "";
    if (!answer) {
      return Response.json({ ok: false, error: "The assistant did not return an answer. Please try again." }, { status: 502 });
    }

    const references = Array.isArray(data.references)
      ? data.references
          .filter((item) => item && item.path)
          .slice(0, 6)
          .map((item) => ({
            path: String(item.path),
            lines: item.lines ? String(item.lines) : "",
            note: item.note ? String(item.note) : "",
          }))
      : [];

    return Response.json({ ok: true, answer, references, mode });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message || "The assistant is unavailable right now." },
      { status: 500 }
    );
  }
}