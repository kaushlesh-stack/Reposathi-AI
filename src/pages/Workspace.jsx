import React, { useState } from "react";
import { Bot, FolderTree, Layers } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import WorkspaceTopBar from "@/components/workspace/WorkspaceTopBar";
import WorkspaceRail from "@/components/workspace/WorkspaceRail";
import WorkspacePanels from "@/components/workspace/WorkspacePanels";
import CodeViewer from "@/components/workspace/CodeViewer";
import ChatPanel from "@/components/workspace/ChatPanel";
import RepoLauncher from "@/components/workspace/RepoLauncher";

const MOBILE_TABS = [
  { id: "panels", label: "Panels", icon: Layers },
  { id: "code", label: "Code", icon: FolderTree },
  { id: "chat", label: "Ask", icon: Bot },
];

export default function Workspace() {
  const ws = useWorkspace();
  const [view, setView] = useState("overview");
  const [mobileTab, setMobileTab] = useState("panels");

  const openFile = (path) => {
    ws.openFile(path);
    setMobileTab("code");
  };

  const explainOpenFile = () => {
    if (!ws.activeFile?.path) return;
    ws.ask(
      `Explain ${ws.activeFile.path}: what it does, the main functions, and how it fits into this project.`,
      "explanation"
    );
    setView("explanations");
  };

  const counts = {
    explanations: ws.explanations.length,
    tests: ws.testRuns.length,
    history: ws.messages.length,
  };

  if (!ws.repo) {
    return (
      <RepoLauncher
        recent={ws.recent}
        onAnalyze={ws.analyze}
        onResume={ws.resume}
        status={ws.status}
        error={ws.error}
      />
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <WorkspaceTopBar
        repo={ws.repo}
        status={ws.status}
        onReanalyze={() => ws.analyze(ws.repo.repo_url)}
        onNew={ws.reset}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden lg:block">
          <WorkspaceRail view={view} onChange={setView} counts={counts} />
        </div>

        <aside
          className={`${
            mobileTab === "panels" ? "flex" : "hidden"
          } min-h-0 w-full flex-col border-border/70 bg-secondary/25 lg:flex lg:w-[320px] lg:shrink-0 lg:border-r`}
        >
          <WorkspacePanels view={view} onChangeView={setView} ws={ws} onOpenFile={openFile} />
        </aside>

        <section
          className={`${
            mobileTab === "code" ? "flex" : "hidden"
          } min-h-0 min-w-0 flex-1 flex-col border-border/70 lg:flex xl:border-r`}
        >
          <CodeViewer
            repo={ws.repo}
            file={ws.activeFile}
            status={ws.fileStatus}
            error={ws.fileError}
            onExplain={explainOpenFile}
            asking={ws.asking}
          />
        </section>

        <aside
          className={`${
            mobileTab === "chat" ? "flex" : "hidden"
          } min-h-0 w-full flex-col border-border/70 xl:flex xl:w-[360px] xl:shrink-0`}
        >
          <ChatPanel
            repo={ws.repo}
            messages={ws.messages}
            asking={ws.asking}
            activeFile={ws.activeFile}
            onAsk={ws.ask}
            onOpenFile={openFile}
            onOpenTests={() => {
              setView("tests");
              setMobileTab("panels");
            }}
          />
        </aside>
      </div>

      <nav className="flex shrink-0 border-t border-border/70 bg-background xl:hidden">
        {MOBILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            aria-current={mobileTab === tab.id ? "true" : undefined}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-[12px] transition-colors ${
              mobileTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}