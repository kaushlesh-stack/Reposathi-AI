import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SignInDialog({ className = "", label = "Sign In", variant = "ghost" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/80 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">No account needed yet</DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
            RepoSathi AI is open to everyone while accounts are being built. You can analyse public repositories and use
            the AI workspace straight away.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className="rounded-xl">
              Stay on this page
            </Button>
          </DialogClose>
          <Button asChild className="rounded-xl">
            <Link to="/workspace">Open the workspace</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}