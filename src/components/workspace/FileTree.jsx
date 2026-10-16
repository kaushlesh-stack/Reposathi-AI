import React, { useState } from "react";
import { Braces, ChevronDown, ChevronRight, File, FileCode2, FileText, Hash } from "lucide-react";
import { fileKind } from "@/lib/repoFiles";
import { defaultOpenFolders } from "@/lib/fileTree";

function FileGlyph({ path }) {
  const kind = fileKind(path);
  if (kind === "code") return <FileCode2 className="h-3.5 w-3.5 text-brand-cyan" />;
  if (kind === "data" || kind === "config") return <Braces className="h-3.5 w-3.5 text-primary" />;
  if (kind === "style") return <Hash className="h-3.5 w-3.5 text-[#F0ABFC]" />;
  if (kind === "text") return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
  return <File className="h-3.5 w-3.5 text-muted-foreground" />;
}

export default function FileTree({ nodes, activePath, onSelect, depth = 0, openFolders, onToggle }) {
  return (
    <ul className={depth === 0 ? "space-y-0.5" : "space-y-0.5"}>
      {nodes.map((node) => {
        const isOpen = openFolders.has(node.path);
        const active = node.type === "file" && node.path === activePath;
        return (
          <li key={node.path}>
            <button
              type="button"
              onClick={() => (node.type === "dir" ? onToggle(node.path) : onSelect(node.path))}
              className={`flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left font-mono text-[11.5px] transition-colors ${
                active ? "bg-primary/15 text-foreground ring-1 ring-primary/25" : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              }`}
              style={{ paddingLeft: `${6 + depth * 12}px` }}
            >
              {node.type === "dir" ? (
                isOpen ? (
                  <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                )
              ) : (
                <FileGlyph path={node.path} />
              )}
              <span className="truncate">{node.name}</span>
            </button>
            {node.type === "dir" && isOpen && node.children.length ? (
              <FileTree
                nodes={node.children}
                activePath={activePath}
                onSelect={onSelect}
                depth={depth + 1}
                openFolders={openFolders}
                onToggle={onToggle}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function useOpenFolders(nodes) {
  const [openFolders, setOpenFolders] = useState(() => new Set(defaultOpenFolders(nodes)));
  const toggle = (path) => {
    setOpenFolders((previous) => {
      const next = new Set(previous);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };
  return { openFolders, toggle };
}