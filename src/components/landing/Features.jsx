import React from "react";
import { FolderTree, FlaskConical, MessageSquareCode, Search } from "lucide-react";

const FEATURES = [
  {
    icon: FolderTree,
    title: "Repository Overview",
    body: "Understand the project structure, entry points, dependencies, and important files.",
  },
  {
    icon: MessageSquareCode,
    title: "AI Code Explanation",
    body: "Get clear explanations of functions, classes, and code logic in beginner-friendly language.",
  },
  {
    icon: Search,
    title: "Smart Code Search",
    body: "Find relevant files and code sections using keywords and natural-language queries where supported.",
  },
  {
    icon: FlaskConical,
    title: "Test & Error Assistant",
    body: "View test results, understand error messages, and receive possible debugging suggestions.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 border-t border-border/60 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Features</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Everything you need to read unfamiliar code
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Four focused tools that work on real repository data — no guesswork, no invented results.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-border/70 bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:glow-soft"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 ring-1 ring-primary/25 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}