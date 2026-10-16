import React from "react";
import {
  BookOpen,
  CircleAlert,
  CircleDot,
  GitFork,
  Info,
  KeyRound,
  Layers,
  ListTree,
  SquareArrowOutUpRight,
  Star,
} from "lucide-react";
import { topLevelSummary } from "@/lib/fileTree";

function Section({ icon: Icon, title, hint, children }) {
  return (
    <section className="border-t border-border/60 px-4 py-4 first:border-t-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <h3 className="font-heading text-[12.5px] font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      {hint ? <p className="mt-1 pl-[22px] text-[11px] text-muted-foreground">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FileButtons({ paths, onOpenFile, emptyText }) {
  if (!paths?.length) return <p className="text-[12px] text-muted-foreground">{emptyText}</p>;
  return (
    <ul className="space-y-1">
      {paths.map((path) => (
        <li key={path}>
          <button
            type="button"
            onClick={() => onOpenFile(path)}
            className="block w-full truncate rounded-md border border-border/60 bg-card/50 px-2.5 py-1.5 text-left font-mono text-[11px] text-brand-cyan transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {path}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function AnalysisOverview({ repo, onOpenFile }) {
  const structure = topLevelSummary((repo.files || []).map((file) => file.path));
  const languages = repo.languages || [];

  return (
    <div className="pb-6">
      <Section icon={Info} title="About this repository">
        <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-muted-foreground">
          {repo.description || "This repository has no description on GitHub."}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="h-3 w-3 text-[#FACC15]" />
            {repo.stars ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="h-3 w-3 text-brand-cyan" />
            {repo.forks ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <CircleDot className="h-3 w-3 text-destructive" />
            {repo.open_issues ?? 0} issues
          </span>
          {repo.license ? (
            <span className="flex items-center gap-1.5">
              <KeyRound className="h-3 w-3" />
              {repo.license}
            </span>
          ) : null}
        </div>
        {repo.topics?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        ) : null}
        <a
          href={repo.repo_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-cyan hover:text-foreground"
        >
          <SquareArrowOutUpRight className="h-3 w-3" />
          Open on GitHub
        </a>
      </Section>

      <Section icon={Layers} title="Languages" hint="Reported by the GitHub languages API.">
        {languages.length ? (
          <div className="space-y-2.5">
            {languages.map((language) => (
              <div key={language.name}>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-foreground/90">{language.name}</span>
                  <span className="text-muted-foreground">{language.percent}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-brand-cyan"
                    style={{ width: `${Math.max(language.percent, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-muted-foreground">No language breakdown was available.</p>
        )}
      </Section>

      <Section
        icon={ListTree}
        title="Entry points"
        hint="Files that look like the place the project starts, identified from the file listing."
      >
        <FileButtons
          paths={repo.entry_points}
          onOpenFile={onOpenFile}
          emptyText="No conventional entry-point file was identified in this repository."
        />
      </Section>

      <Section icon={BookOpen} title="README summary" hint="Extracted from the repository README.">
        {repo.readme_excerpt ? (
          <p className="max-h-64 overflow-y-auto thin-scroll whitespace-pre-wrap rounded-lg border border-border/60 bg-card/50 p-3 text-[12px] leading-relaxed text-muted-foreground">
            {repo.readme_excerpt}
          </p>
        ) : (
          <p className="text-[12px] text-muted-foreground">No README was found at the repository root.</p>
        )}
      </Section>

      <Section icon={KeyRound} title="Dependencies & configuration">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Dependency files</p>
        <div className="mt-2">
          <FileButtons
            paths={repo.dependency_files}
            onOpenFile={onOpenFile}
            emptyText="No dependency manifest was found."
          />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Configuration & CI files
        </p>
        <div className="mt-2">
          <FileButtons
            paths={repo.config_files}
            onOpenFile={onOpenFile}
            emptyText="No configuration files were identified."
          />
        </div>
      </Section>

      <Section icon={ListTree} title="Structure" hint={`${repo.total_files || 0} files in this branch.`}>
        {structure.dirs.length ? (
          <ul className="space-y-1.5">
            {structure.dirs.slice(0, 12).map((dir) => (
              <li key={dir.name} className="flex items-center justify-between font-mono text-[11.5px]">
                <span className="truncate text-foreground/90">{dir.name}/</span>
                <span className="text-muted-foreground">{dir.count} files</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-muted-foreground">All files sit at the repository root.</p>
        )}
        {structure.rootFiles.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {structure.rootFiles.map((file) => (
              <button
                key={file}
                type="button"
                onClick={() => onOpenFile(file)}
                className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {file}
              </button>
            ))}
          </div>
        ) : null}
      </Section>

      {repo.notes?.length ? (
        <Section icon={CircleAlert} title="Analysis notes">
          <ul className="space-y-2">
            {repo.notes.map((note) => (
              <li key={note} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground">
                <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan" />
                {note}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}