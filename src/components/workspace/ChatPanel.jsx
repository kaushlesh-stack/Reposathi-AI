import React, { useEffect, useRef, useState } from "react";
import { Bot, CornerDownRight, Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Explain this project structure.",
  "Where does the application start?",
  "Explain this function in simple words.",
  "Which files are relevant to this feature?",
];

export default function ChatPanel({ repo, messages, asking, activeFile, onAsk, onOpenFile, onOpenTests }) {
  const [value, setValue] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, asking]);

  const submit = (question) => {
    const text = String(question ?? value).trim();
    if (!text || asking) return;
    setValue("");
    onAsk(text, "question");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-secondary/20">
      <header className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-[12.5px] font-medium text-foreground">AI assistant</p>
          <p className="truncate font-mono text-[10px] text-muted-foreground">{repo.full_name}</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll px-3 py-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              Ask anything about this repository. Answers reference real files from the project{activeFile?.path ? " and the file you have open" : ""}.
            </p>
            <div className="space-y-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-left text-[12.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {suggestion}
                </button>
              ))}
              <button
                type="button"
                onClick={onOpenTests}
                className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-left text-[12.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                Why is this test failing?
              </button>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {messages.map((message) => (
            <Message key={message.id} message={message} onOpenFile={onOpenFile} />
          ))}
        </div>

        {asking ? (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Reading the repository…
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="shrink-0 border-t border-border/70 p-3">
        {activeFile?.path && activeFile?.content ? (
          <button
            type="button"
            onClick={() => onAsk(`Explain ${activeFile.path} in simple words.`, "question")}
            disabled={asking}
            className="mb-2 flex w-full items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-3 py-1.5 text-left font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <CornerDownRight className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate">Explain {activeFile.path}</span>
          </button>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={2}
            placeholder="Ask about this repository…"
            aria-label="Ask the AI assistant"
            className="min-h-[52px] flex-1 resize-none rounded-xl border border-border/80 bg-secondary/70 px-3 py-2 text-[12.5px] leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl" disabled={asking || !value.trim()}>
            {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Message({ message, onOpenFile }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[86%] rounded-xl rounded-br-sm bg-primary/20 px-3 py-2 text-[12.5px] leading-relaxed text-foreground ring-1 ring-primary/25">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl rounded-bl-sm border border-border/70 bg-card/70 px-3 py-2.5">
      {message.file_path ? (
        <p className="mb-1.5 font-mono text-[10px] text-muted-foreground">{message.file_path}</p>
      ) : null}
      <p
        className={`whitespace-pre-wrap text-[12.5px] leading-relaxed ${
          message.failed ? "text-destructive" : "text-foreground/90"
        }`}
      >
        {message.content}
      </p>
      {message.references?.length ? (
        <div className="mt-2.5 space-y-1 border-t border-border/60 pt-2">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">Referenced files</p>
          {message.references.map((reference, index) => (
            <button
              key={`${reference.path}-${index}`}
              type="button"
              onClick={() => onOpenFile(reference.path)}
              className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left font-mono text-[10.5px] text-brand-cyan transition-colors hover:bg-secondary/70"
            >
              <CornerDownRight className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {reference.path}
                {reference.lines ? `:${reference.lines}` : ""}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}