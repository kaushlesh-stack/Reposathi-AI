import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FileTree, { useOpenFolders } from "@/components/workspace/FileTree";
import { buildTree } from "@/lib/fileTree";

export default function FileExplorer({ repo, activePath, onSelect }) {
  const [query, setQuery] = useState("");
  const files = repo.files || [];
  const paths = useMemo(() => files.map((file) => file.path), [files]);
  const nodes = useMemo(() => buildTree(paths), [paths]);
  const { openFolders, toggle } = useOpenFolders(nodes);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return paths.filter((path) => path.toLowerCase().includes(needle)).slice(0, 120);
  }, [paths, query]);

  const searching = Boolean(query.trim());

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/70 p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter files by name or path"
            aria-label="Filter files"
            spellCheck={false}
            className="h-9 w-full rounded-lg border border-border/80 bg-secondary/70 pl-9 pr-3 font-mono text-[11.5px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          {files.length} of {repo.total_files || files.length} files
          {repo.tree_truncated ? " · listing truncated by GitHub" : ""}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll p-2">
        {files.length === 0 ? (
          <p className="p-3 text-[12.5px] leading-relaxed text-muted-foreground">
            No file listing is available for this repository.
          </p>
        ) : searching ? (
          matches.length ? (
            <ul className="space-y-0.5">
              {matches.map((path) => (
                <li key={path}>
                  <button
                    type="button"
                    onClick={() => onSelect(path)}
                    className={`block w-full truncate rounded-md px-2 py-1.5 text-left font-mono text-[11.5px] transition-colors ${
                      path === activePath
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    {path}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-[12.5px] text-muted-foreground">No files match “{query.trim()}”.</p>
          )
        ) : (
          <FileTree
            nodes={nodes}
            activePath={activePath}
            onSelect={onSelect}
            openFolders={openFolders}
            onToggle={toggle}
          />
        )}
      </div>
    </div>
  );
}