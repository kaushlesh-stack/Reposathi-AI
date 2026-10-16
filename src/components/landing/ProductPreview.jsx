import React from "react";
import { Bot, Check, File, Folder, GitBranch, Sparkles } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

const SAMPLE_CODE = `export function createSlug(input, options = {}) {
  const { replacement = "-", lowercase = true } = options;

  if (typeof input !== "string") {
    throw new TypeError("Expected a string");
  }

  const slug = decamelize(input).trim();

  return lowercase ? slug.toLowerCase() : slug;
}`;

const FILES = [
  { name: ".github", dir: true },
  { name: "index.d.ts" },
  { name: "index.js", active: true },
  { name: "overridable-replacements.js" },
  { name: "package.json" },
  { name: "readme.md" },
];

export default function ProductPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-x-8 -top-6 bottom-6 rounded-[2.5rem] bg-primary/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/60 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <GitBranch className="h-3 w-3" />
            workspace
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success sm:flex">
            <Check className="h-3 w-3" />
            Analysis complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_200px]">
          <div className="hidden border-r border-border/70 bg-secondary/30 p-3 md:block">
            <p className="px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Explorer
            </p>
            <ul className="space-y-0.5">
              {FILES.map((file) => (
                <li
                  key={file.name}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] ${
                    file.active ? "bg-primary/15 text-foreground ring-1 ring-primary/25" : "text-muted-foreground"
                  }`}
                >
                  {file.dir ? (
                    <Folder className="h-3 w-3 text-brand-cyan" />
                  ) : (
                    <File className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="truncate">{file.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 border-border/70 md:border-r">
            <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2">
              <span className="font-mono text-[11px] text-muted-foreground">index.js</span>
              <span className="rounded-full border border-border/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                JavaScript
              </span>
            </div>
            <div className="max-h-[260px] overflow-hidden">
              <CodeBlock code={SAMPLE_CODE} language="JavaScript" lineNumbers />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 p-3 lg:border-t-0">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Bot className="h-3 w-3" />
              AI assistant
            </p>
            <div className="ml-auto max-w-full rounded-xl rounded-br-sm bg-primary/15 px-3 py-2 text-[11.5px] leading-relaxed text-foreground ring-1 ring-primary/25">
              Where does the application start?
            </div>
            <div className="rounded-xl rounded-bl-sm border border-border/70 bg-secondary/50 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
              This package starts in <span className="text-foreground">index.js</span>, which exports the
              <span className="text-foreground"> createSlug </span> function used by every entry point.
              <span className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-brand-cyan">
                <Sparkles className="h-3 w-3" />
                index.js:1-12
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-secondary/40 px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span>Primary language · JavaScript</span>
          <span className="hidden sm:inline">Entry point · index.js</span>
          <span>13 files indexed</span>
        </div>
      </div>
    </div>
  );
}