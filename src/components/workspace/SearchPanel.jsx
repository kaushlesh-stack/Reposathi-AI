import React, { useState } from "react";
import { CornerDownRight, FileSearch, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLES = [
  "Where is routing handled?",
  "Which files handle authentication?",
  "Where are API requests made?",
  "Where is the database connection set up?",
];

export default function SearchPanel({ searches, asking, onAsk, onOpenFile }) {
  const [query, setQuery] = useState("");

  const submit = (value) => {
    const text = String(value ?? query).trim();
    if (!text || asking) return;
    setQuery("");
    onAsk(text, "find_files");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/70 p-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex items-center gap-2"
        >
          <label className="relative flex-1">
            <FileSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Describe what you are looking for"
              aria-label="Describe what you are looking for"
              className="h-10 w-full rounded-lg border border-border/80 bg-secondary/70 pl-9 pr-3 text-[12.5px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <Button type="submit" size="sm" className="h-10 rounded-lg" disabled={asking || !query.trim()}>
            {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </form>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Natural-language search reads the file listing and suggests the files most relevant to your question.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll p-3">
        {searches.length === 0 ? (
          <div className="pt-2">
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              Ask where something lives in this repository. Try one of these:
            </p>
            <div className="mt-3 space-y-1.5">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => submit(example)}
                  className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-card/50 px-3 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((item) =>
              item.role === "user" ? (
                <div key={item.id} className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-[12px] text-foreground">
                  {item.content}
                </div>
              ) : (
                <div key={item.id} className="rounded-lg border border-border/70 bg-card/60 px-3 py-2.5">
                  <p
                    className={`whitespace-pre-wrap text-[12.5px] leading-relaxed ${
                      item.failed ? "text-destructive" : "text-foreground/90"
                    }`}
                  >
                    {item.content}
                  </p>
                  {item.references?.length ? (
                    <div className="mt-2.5 space-y-1 border-t border-border/60 pt-2">
                      {item.references.map((reference, index) => (
                        <button
                          key={`${reference.path}-${index}`}
                          type="button"
                          onClick={() => onOpenFile(reference.path)}
                          className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left font-mono text-[10.5px] text-brand-cyan transition-colors hover:bg-secondary/70"
                        >
                          <CornerDownRight className="h-3 w-3 shrink-0" />
                          <span className="truncate">{reference.path}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            )}
            {asking ? (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Searching the file listing…
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}