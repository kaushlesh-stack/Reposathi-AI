import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 text-[13px] text-muted-foreground">Last updated {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Using RepoSathi AI</h2>
            <p className="mt-2">
              You may analyse public repositories and use the AI workspace for learning, review and development work. Do
              not use the service to attempt to access private repositories, to overload the GitHub API, or to process
              material you do not have the right to share.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Accuracy of AI output</h2>
            <p className="mt-2">
              Explanations, answers and suggested fixes are generated automatically and can be incomplete or wrong. They
              are guidance, not verified results. Test output is only reported when it was produced by a real test runner;
              suggested fixes are never presented as verified. Always review changes in your own environment before
              relying on them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Repository content and licences</h2>
            <p className="mt-2">
              Repository contents belong to their authors and are governed by their own licences. RepoSathi AI reads and
              displays that content; it does not grant you any rights to it and does not modify it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Availability</h2>
            <p className="mt-2">
              The service depends on third-party APIs, including the public GitHub API and language model providers.
              Availability, rate limits and results can be affected by those services. The service is provided as is,
              without warranties.
            </p>
          </section>

          <p className="rounded-xl border border-border/70 bg-card/50 p-4 text-[12.5px]">
            These terms are a plain-language starting point. Review them with your own legal requirements before
            publishing your app.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}