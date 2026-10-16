import React from "react";
import { BookOpen, CornerDownRight, Loader2 } from "lucide-react";
import { relativeTime } from "@/lib/repoFiles";

export default function ExplanationsPanel({ explanations, asking, onOpenFile }) {
  const ordered = [...explanations].reverse();

  return (
    <div className="min-h-0 h-full overflow-y-auto thin-scroll">
      {asking ? (
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3 text-[12px] text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Writing an explanation…
        </div>
      ) : null}

      {ordered.length === 0 && !asking ? (
        <div className="p-5">
          <BookOpen className="h-5 w-5 text-primary" />
          <p className="mt-3 font-heading text-[13px] font-medium text-foreground">No explanations yet</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Open any file and press <span className="font-mono text-[11.5px] text-foreground">Explain</span> in the code
            viewer. Every explanation you generate is saved here with the file it belongs to.
          </p>
        </div>
      ) : null}

      <div className="divide-y divide-border/60">
        {ordered.map((item) => (
          <article key={item.id} className="px-4 py-4">
            <button
              type="button"
              onClick={() => item.file_path && onOpenFile(item.file_path)}
              className="flex w-full items-center gap-1.5 text-left font-mono text-[11px] text-brand-cyan transition-colors hover:text-foreground"
            >
              <CornerDownRight className="h-3 w-3 shrink-0" />
              <span className="truncate">{item.file_path || "Repository"}</span>
            </button>
            <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground/90">{item.content}</p>
            {item.references?.length ? (
              <div className="mt-2.5 space-y-1">
                {item.references.map((reference, index) => (
                  <button
                    key={`${reference.path}-${index}`}
                    type="button"
                    onClick={() => onOpenFile(reference.path)}
                    className="block w-full truncate rounded-md border border-border/60 px-2 py-1 text-left font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {reference.path}
                    {reference.lines ? `:${reference.lines}` : ""}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">{relativeTime(item.created_date)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}