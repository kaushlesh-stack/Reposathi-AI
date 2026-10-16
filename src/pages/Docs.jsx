import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, FlaskConical, Github, KeyRound, Layers, Search, ShieldCheck } from "lucide-react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "getting-started", title: "Getting started" },
  { id: "supported-repositories", title: "Supported repositories" },
  { id: "workspace", title: "The workspace" },
  { id: "assistant", title: "AI assistant" },
  { id: "search", title: "Smart code search" },
  { id: "tests", title: "Test & error assistant" },
  { id: "privacy", title: "Data and privacy" },
  { id: "limits", title: "Limits and troubleshooting" },
];

function Doc({ icon: Icon, title, children }) {
  return (
    <section className="border-t border-border/60 py-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold tracking-tight text-foreground">
        <Icon className="h-[18px] w-[18px] text-primary" />
        {title}
      </h2>
      <div className="mt-4 space-y-3.5 text-[14px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[210px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Documentation</p>
            <nav className="mt-4 space-y-1.5">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              RepoSathi AI documentation
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Everything here describes what the product actually does today, including the things it deliberately does
              not do.
            </p>

            <div className="mt-12">
              <div id="getting-started" className="scroll-mt-24">
                <Doc icon={ArrowRight} title="Getting started">
                  <p>
                    Paste a public GitHub repository URL into the input on the home page or in the workspace, then press{" "}
                    <span className="font-mono text-[13px] text-foreground">Analyze Repository</span>. RepoSathi AI reads
                    the repository from the GitHub API and opens the workspace with the results.
                  </p>
                  <p>
                    Analysis takes a few seconds on most projects. Very large repositories may return a partial file
                    listing; when that happens the workspace says so in the analysis notes.
                  </p>
                  <Button asChild className="mt-2 rounded-xl">
                    <Link to="/workspace">
                      Open the workspace
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Doc>
              </div>

              <div id="supported-repositories" className="scroll-mt-24">
                <Doc icon={Github} title="Supported repositories">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Public repositories on github.com. Private repositories are not readable without access.</li>
                    <li>Any branch you can address with a URL; the default branch is used otherwise.</li>
                    <li>
                      Text and code files can be opened in the viewer. Binary files are listed but cannot be displayed.
                      Files above roughly 200&nbsp;KB are skipped to keep the viewer fast.
                    </li>
                    <li>
                      Generated folders such as <span className="font-mono text-[13px] text-foreground">node_modules</span>{" "}
                      and build output are excluded from the file listing.
                    </li>
                  </ul>
                </Doc>
              </div>

              <div id="workspace" className="scroll-mt-24">
                <Doc icon={Layers} title="The workspace">
                  <p>The workspace has three areas:</p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      <span className="text-foreground">The panel column</span> holds the project overview, the file
                      explorer, search, code explanations, test results, chat history and settings.
                    </li>
                    <li>
                      <span className="text-foreground">The code viewer</span> shows the real contents of the file you
                      select, with line numbers, a language label and a copy action.
                    </li>
                    <li>
                      <span className="text-foreground">The AI assistant</span> answers questions about the repository and
                      lists the files it used.
                    </li>
                  </ul>
                  <p>On smaller screens the three areas become tabs at the bottom of the screen.</p>
                </Doc>
              </div>

              <div id="assistant" className="scroll-mt-24">
                <Doc icon={Bot} title="AI assistant">
                  <p>
                    Every answer is generated from the repository context: the file listing, the project details, and the
                    file you currently have open. Answers include referenced file paths, and line ranges when the assistant
                    was given the file contents.
                  </p>
                  <p>
                    The assistant never claims to have run your code. If it cannot answer from the context it is given, it
                    tells you which file to open next.
                  </p>
                </Doc>
              </div>

              <div id="search" className="scroll-mt-24">
                <Doc icon={Search} title="Smart code search">
                  <p>
                    The file explorer filters by name and path. The search panel handles natural-language questions such as
                    “where are API requests made?” and returns the files that most likely answer it.
                  </p>
                </Doc>
              </div>

              <div id="tests" className="scroll-mt-24">
                <Doc icon={FlaskConical} title="Test & error assistant">
                  <p>
                    RepoSathi AI does not execute repository code — that keeps the workspace safe and predictable. Test
                    counts are only shown when a real test runner produced them, so you paste the output from your own
                    terminal and the assistant explains it.
                  </p>
                  <p>
                    Pass/fail totals appear only if your pasted output states them. Explanations and possible fixes are
                    labelled as suggestions: they are never presented as verified fixes.
                  </p>
                </Doc>
              </div>

              <div id="privacy" className="scroll-mt-24">
                <Doc icon={ShieldCheck} title="Data and privacy">
                  <p>
                    Analysis results, chat history and test explanations are stored so you can return to them. Repository
                    contents come from the public GitHub API and are never executed.
                  </p>
                  <p>
                    You can clear chat history and test explanations, or delete a whole analysis, from the settings panel
                    in the workspace.
                  </p>
                </Doc>
              </div>

              <div id="limits" className="scroll-mt-24">
                <Doc icon={KeyRound} title="Limits and troubleshooting">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      GitHub rate limits public API requests. If the limit is reached, analysis returns a clear message and
                      you can retry in a few minutes.
                    </li>
                    <li>Very large repositories are analysed partially, and the workspace says which part is partial.</li>
                    <li>Repositories that do not exist or are private return a not-found message.</li>
                    <li>The code viewer is read-only. RepoSathi AI never edits your repository.</li>
                  </ul>
                </Doc>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}