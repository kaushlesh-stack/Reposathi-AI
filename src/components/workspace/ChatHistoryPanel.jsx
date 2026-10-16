import React from "react";
import { Bot, History, User } from "lucide-react";
import { relativeTime } from "@/lib/repoFiles";

export default function ChatHistoryPanel({ messages }) {
  return (
    <div className="min-h-0 h-full overflow-y-auto thin-scroll">
      {messages.length === 0 ? (
        <div className="p-5">
          <History className="h-5 w-5 text-primary" />
          <p className="mt-3 font-heading text-[13px] font-medium text-foreground">No conversation yet</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Questions you ask the AI assistant are saved with this analysis so you can come back to them later.
          </p>
        </div>
      ) : null}

      <ul className="divide-y divide-border/60">
        {messages.map((message) => (
          <li key={message.id} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`grid h-5 w-5 place-items-center rounded-md ${
                  message.role === "user" ? "bg-secondary text-muted-foreground" : "bg-primary/15 text-primary"
                }`}
              >
                {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {message.role === "user" ? "You" : "Assistant"}
              </span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {relativeTime(message.created_date)}
              </span>
            </div>
            <p
              className={`mt-2 line-clamp-4 whitespace-pre-wrap text-[12px] leading-relaxed ${
                message.failed ? "text-destructive" : "text-foreground/85"
              }`}
            >
              {message.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}