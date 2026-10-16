import React, { useState } from "react";
import { GitBranch, Loader2, RefreshCw, Settings, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { relativeTime } from "@/lib/repoFiles";

export default function SettingsPanel({
  repo,
  includeTree,
  setIncludeTree,
  onReanalyze,
  onClearChat,
  onClearTests,
  onRemove,
  busy,
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="min-h-0 h-full overflow-y-auto thin-scroll">
      <section className="border-b border-border/60 p-4">
        <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold tracking-tight text-foreground">
          <GitBranch className="h-4 w-4 text-primary" />
          This analysis
        </h3>
        <dl className="mt-3 space-y-2 font-mono text-[11.5px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Repository</dt>
            <dd className="truncate text-foreground">{repo.full_name}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Branch</dt>
            <dd className="text-foreground">{repo.default_branch}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Analysed</dt>
            <dd className="text-foreground">{relativeTime(repo.created_date)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="text-foreground">{repo.analysis_status}</dd>
          </div>
        </dl>
        <Button
          variant="outline"
          className="mt-4 w-full rounded-lg border-border/80"
          onClick={onReanalyze}
          disabled={busy}
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Re-analyze from GitHub
        </Button>
      </section>

      <section className="border-b border-border/60 p-4">
        <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold tracking-tight text-foreground">
          <Settings className="h-4 w-4 text-primary" />
          Assistant settings
        </h3>
        <label className="mt-3 flex items-start gap-3">
          <Switch checked={includeTree} onCheckedChange={setIncludeTree} className="mt-0.5" />
          <span>
            <span className="block text-[12.5px] text-foreground">Send the file list in every question</span>
            <span className="mt-1 block text-[11.5px] leading-relaxed text-muted-foreground">
              The assistant uses the repository&apos;s file listing to point at real files. Turning this off keeps answers
              limited to the file you have open.
            </span>
          </span>
        </label>
      </section>

      <section className="p-4">
        <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold tracking-tight text-foreground">
          <Wand2 className="h-4 w-4 text-primary" />
          Stored data
        </h3>
        <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
          Analysis results, chat history and test explanations are saved for this repository.
        </p>
        <div className="mt-3 space-y-2">
          <Button variant="outline" className="w-full rounded-lg border-border/80" onClick={onClearChat}>
            Clear chat and explanations
          </Button>
          <Button variant="outline" className="w-full rounded-lg border-border/80" onClick={onClearTests}>
            Clear test explanations
          </Button>
          {confirming ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                This removes the saved analysis, chat history and test explanations for this repository.
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="destructive" className="rounded-lg" onClick={onRemove}>
                  Delete analysis
                </Button>
                <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete this analysis
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}