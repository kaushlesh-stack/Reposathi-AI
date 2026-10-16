import React from "react";
import { CircleDot, GitFork, Star } from "lucide-react";

export default function RepoSummary({ repo }) {
  return (
    <div className="shrink-0 border-b border-border/70 px-4 py-3">
      <p className="truncate font-heading text-[13.5px] font-semibold tracking-tight text-foreground">
        {repo.full_name}
      </p>
      {repo.description ? (
        <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted-foreground">{repo.description}</p>
      ) : null}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10.5px] text-muted-foreground">
        {repo.primary_language ? <span className="text-brand-cyan">{repo.primary_language}</span> : null}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 text-[#FACC15]" />
          {repo.stars ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forks ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <CircleDot className="h-3 w-3 text-destructive" />
          {repo.open_issues ?? 0}
        </span>
      </div>
    </div>
  );
}