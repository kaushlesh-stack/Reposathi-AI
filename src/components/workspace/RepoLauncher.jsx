import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CircleAlert, GitBranch, Loader2, Star } from "lucide-react";
import RepoInput from "@/components/landing/RepoInput";
import { relativeTime } from "@/lib/repoFiles";

export default function RepoLauncher({ recent, onAnalyze, onResume, status, error }) {
  const analyzing = status === "analyzing";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 surface-grid opacity-25 fade-mask-b" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[780px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <GitBranch className="h-[18px] w-[18px] text-primary" />
            </span>
            <span className="font-heading text-[15px] font-semibold tracking-tight">
              RepoSathi<span className="text-primary"> AI</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>

        <div className="mt-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Workspace</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Analyse a public repository
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Paste a GitHub repository URL to read its structure, files, languages and README, then ask the AI assistant
            anything about the code.
          </p>

          <div className="mt-8">
            <RepoInput onSubmit={onAnalyze} loading={analyzing} autoFocus />
          </div>

          {analyzing ? (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <p className="text-[12.5px] text-muted-foreground">
                Reading the repository structure, languages and README from GitHub…
              </p>
            </div>
          ) : null}

          {status === "error" && error ? (
            <div className="mt-6 flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">{error}</p>
            </div>
          ) : null}
        </div>

        {recent.length ? (
          <div className="mt-14">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Recent analyses
            </h2>
            <ul className="mt-3 space-y-2">
              {recent.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onResume(item)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-card"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[12px] text-foreground">{item.full_name}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                        {item.primary_language || "Unknown language"} · {item.total_files || 0} files ·{" "}
                        {relativeTime(item.created_date)}
                      </span>
                    </span>
                    {item.stars ? (
                      <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <Star className="h-3 w-3 text-[#FACC15]" />
                        {item.stars}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}