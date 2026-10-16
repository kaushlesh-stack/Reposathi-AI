import React from "react";
import { Link } from "react-router-dom";
import { GitBranch } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Workspace", to: "/workspace" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "GitHub repository", href: "https://github.com", external: true },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                <GitBranch className="h-[18px] w-[18px] text-primary" />
              </span>
              <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
                RepoSathi<span className="text-primary"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Your AI companion for reading unfamiliar repositories, understanding code, and getting unstuck.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="text-[13px] text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-[13px] text-foreground/80 transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} RepoSathi AI. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground">
            Repository data comes from the GitHub API. Nothing is executed on your behalf.
          </p>
        </div>
      </div>
    </footer>
  );
}