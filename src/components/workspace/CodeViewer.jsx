import React, { useState } from "react";
import { Check, Copy, Lightbulb, Loader2, SquareArrowOutUpRight, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CodeBlock from "@/components/CodeBlock";
import { formatBytes } from "@/lib/repoFiles";

export default function CodeViewer({ repo, file, status, error, onExplain, asking }) {
  const [copied, setCopied] = useState(false);
  const path = file?.path || "";
  const ready = status === "ready" && file?.content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2.5 sm:px-4">
        <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-foreground">
          {path || <span className="text-muted-foreground">No file selected</span>}
        </span>
        {file?.language ? (
          <span className="hidden shrink-0 rounded-full border border-border/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            {file.language}
          </span>
        ) : null}
        {file?.size ? (
          <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground md:block">
            {formatBytes(file.size)}
          </span>
        ) : null}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg text-muted-foreground hover:text-foreground"
            disabled={!ready || asking}
            onClick={onExplain}
          >
            {asking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Lightbulb className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5 hidden sm:inline">Explain</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg text-muted-foreground hover:text-foreground"
            disabled={!ready}
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5 hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
          {path && repo ? (
            <a
              href={`https://github.com/${repo.full_name}/blob/${repo.default_branch}/${path}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Open on GitHub"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto thin-scroll">
        {status === "loading" ? (
          <div className="space-y-2.5 p-5">
            {Array.from({ length: 14 }).map((_, index) => (
              <Skeleton key={index} className={`h-3.5 ${index % 4 === 0 ? "w-1/2" : index % 3 === 0 ? "w-3/4" : "w-full"}`} />
            ))}
          </div>
        ) : status === "error" ? (
          <div className="flex h-full items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <TriangleAlert className="mx-auto h-6 w-6 text-destructive" />
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : ready ? (
          <CodeBlock code={file.content} language={file.language} lineNumbers />
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <p className="font-heading text-sm font-medium text-foreground">Select a file to read it</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                Choose any text file from the explorer. RepoSathi AI shows the real file contents from GitHub, with line
                numbers and a language label.
              </p>
            </div>
          </div>
        )}
      </div>

      {file?.truncated ? (
        <footer className="shrink-0 border-t border-border/70 bg-secondary/40 px-4 py-2 font-mono text-[10.5px] text-muted-foreground">
          This file was cut off for display. Open it on GitHub for the full contents.
        </footer>
      ) : null}
    </div>
  );
}