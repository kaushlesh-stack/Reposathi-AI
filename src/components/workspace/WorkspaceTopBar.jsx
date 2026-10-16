import React from "react";
import { Link } from "react-router-dom";
import { CircleAlert, GitBranch, Loader2, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS = {
  analyzed: { label: "Analysis complete", className: "border-success/30 bg-success/10 text-success", icon: Check },
  partial: { label: "Partial analysis", className: "border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan", icon: CircleAlert },
};

export default function WorkspaceTopBar({ repo, status, onReanalyze, onNew }) {
  const flag = STATUS[repo.analysis_status] || STATUS.analyzed;
  const StatusIcon = flag.icon;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-background/90 px-3 backdrop-blur sm:px-4">
      <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="RepoSathi AI home">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <GitBranch className="h-4 w-4 text-primary" />
        </span>
        <span className="hidden font-heading text-[13.5px] font-semibold tracking-tight sm:block">
          RepoSathi<span className="text-primary"> AI</span>
        </span>
      </Link>

      <span className="h-5 w-px bg-border" />

      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate font-mono text-[12.5px] text-foreground">{repo.full_name}</span>
        <span className="hidden shrink-0 items-center gap-1 rounded-full border border-border/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          <GitBranch className="h-2.5 w-2.5" />
          {repo.default_branch}
        </span>
        <span
          className={`hidden shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium lg:flex ${flag.className}`}
        >
          <StatusIcon className="h-2.5 w-2.5" />
          {flag.label}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-lg text-muted-foreground hover:text-foreground"
          onClick={onReanalyze}
          disabled={status === "analyzing"}
        >
          {status === "analyzing" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          <span className="ml-1.5 hidden sm:inline">Re-analyze</span>
        </Button>
        <Button variant="outline" size="sm" className="rounded-lg border-border/80" onClick={onNew}>
          New analysis
        </Button>
      </div>
    </header>
  );
}