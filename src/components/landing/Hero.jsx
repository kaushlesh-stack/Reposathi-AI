import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import RepoInput from "@/components/landing/RepoInput";
import ProductPreview from "@/components/landing/ProductPreview";

export default function Hero() {
  const navigate = useNavigate();

  const handleSubmit = (url) => {
    navigate(`/workspace?repo=${encodeURIComponent(url)}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 surface-grid opacity-30 fade-mask-b" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-44 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28 lg:pt-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3 w-3" />
            AI-powered repository assistant
          </span>

          <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.35rem]">
            Understand Any Codebase.{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-brand-cyan bg-clip-text text-transparent">
              Start Contributing with Confidence.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Explore repositories, understand complex functions, find relevant files, and troubleshoot errors with your AI
            coding companion.
          </p>

          <div className="mt-8 max-w-xl">
            <RepoInput onSubmit={handleSubmit} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Explore Features
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-1 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              See how it works
            </a>
          </div>
        </div>

        <div className="animate-fade-up">
          <ProductPreview />
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Product preview. Analyse a repository to see your own project here.
          </p>
        </div>
      </div>
    </section>
  );
}