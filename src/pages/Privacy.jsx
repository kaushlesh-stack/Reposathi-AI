import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-[13px] text-muted-foreground">Last updated {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">What we store</h2>
            <p className="mt-2">
              When you analyse a repository, we store the results of that analysis (repository name, description,
              language breakdown, file listing, README extract and analysis notes). Questions you ask the AI assistant,
              the answers, and any test output you paste in are stored with that analysis so you can return to them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Where repository data comes from</h2>
            <p className="mt-2">
              Repository data is read from the public GitHub API. Only public repositories can be analysed. RepoSathi AI
              never clones, builds or executes repository code.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">AI processing</h2>
            <p className="mt-2">
              To answer a question, the relevant repository context (the file listing, and the contents of the file you
              have open) is sent to a language model provider. Do not open files containing secrets, credentials or
              personal data that you do not want processed in this way.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Deleting your data</h2>
            <p className="mt-2">
              You can clear chat history and test explanations, or delete an entire analysis, from the settings panel in
              the workspace. Deleting an analysis removes the stored analysis, its chat history and its test
              explanations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be sent through the contact details published in the product.
            </p>
          </section>

          <p className="rounded-xl border border-border/70 bg-card/50 p-4 text-[12.5px]">
            This page summarises how the workspace handles data in plain language. Review it against your own legal and
            regulatory requirements before publishing your app.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}