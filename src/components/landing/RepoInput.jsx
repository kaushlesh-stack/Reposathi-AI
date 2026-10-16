import React, { useState } from "react";
import { ArrowRight, GitBranch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateRepoUrl } from "@/lib/repoFiles";

export default function RepoInput({
  onSubmit,
  loading = false,
  size = "lg",
  cta = "Analyze Repository",
  autoFocus = false,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const tall = size === "lg";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;
    const check = validateRepoUrl(value);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setError("");
    onSubmit(check.url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <GitBranch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError("");
            }}
            autoFocus={autoFocus}
            spellCheck={false}
            autoComplete="off"
            placeholder="https://github.com/owner/repository"
            aria-label="GitHub repository URL"
            aria-invalid={Boolean(error)}
            className={`w-full rounded-xl border bg-secondary/70 pl-10 pr-3 font-mono text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/15 ${
              tall ? "h-12" : "h-10"
            } ${error ? "border-destructive/70" : "border-border/80"}`}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className={`${tall ? "h-12" : "h-10"} shrink-0 rounded-xl px-5 glow-soft`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              {cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">Start with a supported public GitHub repository.</p>
      )}
    </form>
  );
}