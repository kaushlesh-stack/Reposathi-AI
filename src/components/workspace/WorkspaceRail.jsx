import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WORKSPACE_PANELS } from "@/lib/workspacePanels";

export default function WorkspaceRail({ view, onChange, counts = {} }) {
  return (
    <TooltipProvider delayDuration={150}>
      <nav
        aria-label="Workspace panels"
        className="flex h-full w-14 shrink-0 flex-col items-center gap-1 border-r border-border/70 bg-secondary/40 py-3"
      >
        {WORKSPACE_PANELS.map((item) => {
          const active = view === item.id;
          const count = counts[item.id];
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(item.id)}
                  aria-label={item.label}
                  aria-current={active ? "true" : undefined}
                  className={`relative grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                    active
                      ? "bg-primary/20 text-primary ring-1 ring-primary/35"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {count ? (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-primary px-1 font-mono text-[9px] text-primary-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  ) : null}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-border/80 bg-card text-xs text-foreground">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}