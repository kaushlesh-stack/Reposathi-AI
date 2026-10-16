import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GitBranch, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignInDialog from "@/components/landing/SignInDialog";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Documentation", to: "/docs" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <GitBranch className="h-[18px] w-[18px] text-primary" />
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
            RepoSathi<span className="text-primary"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <SignInDialog />
          <Button asChild className="rounded-xl px-4">
            <Link to="/workspace">
              Start Building
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background/95 px-5 pb-5 pt-4 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm text-muted-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-sm text-muted-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-sm text-muted-foreground"
            >
              GitHub
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <SignInDialog className="w-full rounded-xl" label="Sign In" />
            <Button asChild className="w-full rounded-xl">
              <Link to="/workspace" onClick={() => setOpen(false)}>
                Start Building
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}