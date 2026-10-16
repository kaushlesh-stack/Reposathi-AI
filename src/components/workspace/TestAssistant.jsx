import React, { useRef, useState } from "react";
import { CircleAlert, CircleCheck, CircleDot, FlaskConical, Info, Lightbulb, Loader2, Play, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock";
import { relativeTime } from "@/lib/repoFiles";

export default function TestAssistant({ testRuns, analysing, onAnalyse, onOpenFile }) {
  const [output, setOutput] = useState("");
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(false);
  const [openRaw, setOpenRaw] = useState("");
  const textareaRef = useRef(null);

  const submit = async () => {
    if (!output.trim()) {
      setError("Paste the test output you want explained.");
      return;
    }
    setError("");
    const result = await onAnalyse(output, command);
    if (result && result.ok === false) {
      setError(result.error || "That output could not be explained.");
      return;
    }
    setOutput("");
  };

  return (
    <div className="min-h-0 h-full overflow-y-auto thin-scroll">
      <div className="border-b border-border/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-[13px] font-semibold tracking-tight text-foreground">Test assistant</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg border-border/80"
            onClick={() => {
              setNotice(true);
              window.setTimeout(() => textareaRef.current?.focus(), 60);
            }}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Run tests
          </Button>
        </div>

        {notice ? (
          <div className="mt-3 flex gap-2 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-cyan" />
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              This hosted workspace never executes repository code, so no test runner is available here. Test results are
              only shown when a runner has actually produced them — paste the output from your own terminal below and
              RepoSathi AI will explain it.
            </p>
          </div>
        ) : null}

        <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
          Tests are never executed in this workspace. Paste the output of a real test runner below and it will be
          explained — pass and fail counts appear only when your output states them.
        </p>

        <div className="mt-3 space-y-2">
          <input
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="Command you ran (optional), e.g. npm test"
            aria-label="Test command"
            spellCheck={false}
            className="h-9 w-full rounded-lg border border-border/80 bg-secondary/70 px-3 font-mono text-[11.5px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
          <textarea
            ref={textareaRef}
            value={output}
            onChange={(event) => {
              setOutput(event.target.value);
              if (error) setError("");
            }}
            rows={5}
            placeholder="Paste the failing test output here…"
            aria-label="Test output"
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-border/80 bg-secondary/70 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
          {error ? (
            <p role="alert" className="text-[12px] text-destructive">
              {error}
            </p>
          ) : null}
          <Button className="w-full rounded-lg" onClick={submit} disabled={analysing}>
            {analysing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reading the output…
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Explain this output
              </>
            )}
          </Button>
        </div>
      </div>

      {testRuns.length === 0 ? (
        <div className="p-5">
          <p className="font-heading text-[13px] font-medium text-foreground">No test results yet</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Nothing is reported here until you paste real test output. RepoSathi AI never invents passing or failing
            tests.
          </p>
        </div>
      ) : null}

      <div className="divide-y divide-border/60">
        {testRuns.map((run) => (
          <article key={run.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                <CircleDot className="h-2.5 w-2.5" />
                From output you pasted
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{relativeTime(run.created_date)}</span>
            </div>

            {run.counts_detected ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Stat label="Total" value={run.total} className="text-foreground" />
                <Stat label="Passed" value={run.passed} className="text-success" icon={CircleCheck} />
                <Stat label="Failed" value={run.failed} className="text-destructive" icon={TriangleAlert} />
              </div>
            ) : (
              <p className="mt-3 text-[11.5px] text-muted-foreground">
                The pasted output did not state pass/fail totals, so none are shown.
              </p>
            )}

            {run.summary ? (
              <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-foreground">{run.summary}</p>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap text-[12.5px] leading-relaxed text-muted-foreground">
              {run.explanation}
            </p>

            {run.suggested_fixes?.length ? (
              <div className="mt-3 rounded-lg border border-border/70 bg-card/50 p-3">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <CircleAlert className="h-3 w-3 text-brand-cyan" />
                  Suggested fixes · not verified
                </p>
                <ul className="mt-2.5 space-y-3">
                  {run.suggested_fixes.map((fix, index) => (
                    <li key={`${run.id}-${index}`}>
                      <p className="text-[12.5px] font-medium text-foreground">{fix.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{fix.detail}</p>
                      {fix.files?.length ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {fix.files.map((file) => (
                            <button
                              key={file}
                              type="button"
                              onClick={() => onOpenFile(file)}
                              className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10px] text-brand-cyan transition-colors hover:border-primary/40 hover:text-foreground"
                            >
                              {file}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {run.referenced_files?.length ? (
              <div className="mt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Files named in the output
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {run.referenced_files.map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => onOpenFile(file)}
                      className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setOpenRaw((current) => (current === run.id ? "" : run.id))}
              className="mt-3 font-mono text-[10.5px] text-muted-foreground underline decoration-dotted transition-colors hover:text-foreground"
            >
              {openRaw === run.id ? "Hide the output you pasted" : "Show the output you pasted"}
            </button>
            {openRaw === run.id ? (
              <div className="mt-2 overflow-hidden rounded-lg border border-border/70 bg-background/60">
                <CodeBlock code={run.raw_output} language="Text" />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, className = "", icon: Icon }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/50 px-2.5 py-2">
      <p className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
        {Icon ? <Icon className="h-2.5 w-2.5" /> : null}
        {label}
      </p>
      <p className={`mt-1 font-mono text-lg leading-none ${className}`}>{value}</p>
    </div>
  );
}