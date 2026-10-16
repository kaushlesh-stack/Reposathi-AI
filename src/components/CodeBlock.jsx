import React from "react";
import { familyFor, tokenizeLine, TOKEN_CLASS } from "@/lib/syntax";

export default function CodeBlock({
  code,
  language = "Text",
  lineNumbers = false,
  maxLines = 900,
  className = "",
}) {
  const family = familyFor(language);
  const allLines = String(code ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .split("\n");
  const lines = allLines.slice(0, maxLines);
  const clipped = allLines.length > lines.length;

  return (
    <div className={`overflow-x-auto font-mono text-[12.5px] leading-[1.7] thin-scroll ${className}`}>
      <div className="flex min-w-full">
        {lineNumbers ? (
          <div className="select-none border-r border-border/60 py-3 pl-3 pr-3 text-right tabular-nums text-slate-600">
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        ) : null}
        <div className="flex-1 py-3 pl-4 pr-5">
          {lines.map((line, index) => (
            <div key={index} className="whitespace-pre">
              {tokenizeLine(line, family).map((token, tokenIndex) => (
                <span key={tokenIndex} className={TOKEN_CLASS[token.type] || TOKEN_CLASS.plain}>
                  {token.text}
                </span>
              ))}
            </div>
          ))}
          {clipped ? (
            <div className="pt-2 text-[11px] italic text-muted-foreground">
              Showing the first {lines.length} lines.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}