import React from "react";
import RepoSummary from "@/components/workspace/RepoSummary";
import AnalysisOverview from "@/components/workspace/AnalysisOverview";
import FileExplorer from "@/components/workspace/FileExplorer";
import SearchPanel from "@/components/workspace/SearchPanel";
import ExplanationsPanel from "@/components/workspace/ExplanationsPanel";
import TestAssistant from "@/components/workspace/TestAssistant";
import ChatHistoryPanel from "@/components/workspace/ChatHistoryPanel";
import SettingsPanel from "@/components/workspace/SettingsPanel";
import { WORKSPACE_PANELS } from "@/lib/workspacePanels";

export default function WorkspacePanels({ view, onChangeView, ws, onOpenFile }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <RepoSummary repo={ws.repo} />

      <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border/70 px-2 py-2 thin-scroll lg:hidden">
        {WORKSPACE_PANELS.map((panel) => (
          <button
            key={panel.id}
            type="button"
            onClick={() => onChangeView(panel.id)}
            aria-current={view === panel.id ? "true" : undefined}
            className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11.5px] transition-colors ${
              view === panel.id
                ? "border-primary/40 bg-primary/15 text-foreground"
                : "border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            {panel.short}
          </button>
        ))}
      </div>

      <div className="hidden shrink-0 items-center border-b border-border/70 px-4 py-2.5 lg:flex">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {WORKSPACE_PANELS.find((panel) => panel.id === view)?.label || "Overview"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {view === "files" ? (
          <FileExplorer repo={ws.repo} activePath={ws.activeFile?.path} onSelect={onOpenFile} />
        ) : view === "search" ? (
          <SearchPanel searches={ws.searches} asking={ws.asking} onAsk={ws.ask} onOpenFile={onOpenFile} />
        ) : view === "explanations" ? (
          <ExplanationsPanel
            explanations={ws.explanations}
            asking={ws.asking}
            onOpenFile={onOpenFile}
          />
        ) : view === "tests" ? (
          <TestAssistant
            testRuns={ws.testRuns}
            analysing={ws.testAnalysing}
            onAnalyse={ws.analyseTestOutput}
            onOpenFile={onOpenFile}
          />
        ) : view === "history" ? (
          <ChatHistoryPanel messages={ws.messages} />
        ) : view === "settings" ? (
          <SettingsPanel
            repo={ws.repo}
            includeTree={ws.includeTree}
            setIncludeTree={ws.setIncludeTree}
            onReanalyze={() => ws.analyze(ws.repo.repo_url)}
            onClearChat={ws.clearChat}
            onClearTests={ws.clearTests}
            onRemove={ws.removeAnalysis}
            busy={ws.status === "analyzing"}
          />
        ) : (
          <div className="h-full overflow-y-auto thin-scroll">
            <AnalysisOverview repo={ws.repo} onOpenFile={onOpenFile} />
          </div>
        )}
      </div>
    </div>
  );
}