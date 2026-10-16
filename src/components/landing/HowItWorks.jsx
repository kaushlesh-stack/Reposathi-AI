import React from "react";

const STEPS = [
  {
    title: "Connect",
    body: "Enter a supported GitHub repository URL.",
  },
  {
    title: "Analyze",
    body: "Inspect the available files and project structure.",
  },
  {
    title: "Ask",
    body: "Ask questions about the repository in natural language.",
  },
  {
    title: "Understand",
    body: "Review explanations, file references, and testing guidance.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 border-t border-border/60 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            From repository link to understanding, in four steps
          </h2>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <ol className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative lg:pr-4">
                <div className="flex items-center gap-4 lg:block">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/35 bg-background font-mono text-[13px] font-medium text-primary lg:h-11 lg:w-11">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-base font-semibold tracking-tight text-foreground lg:mt-5">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 pl-14 text-[13.5px] leading-relaxed text-muted-foreground lg:pl-0">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}