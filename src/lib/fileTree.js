// Builds a folder tree from a flat list of repository file paths.

const OPEN_BY_DEFAULT = new Set(["", "src", "app", "lib", "pages", "components", "test", "tests"]);

export function buildTree(paths) {
  const root = new Map();
  for (const rawPath of paths || []) {
    const parts = String(rawPath).split("/").filter(Boolean);
    let level = root;
    parts.forEach((name, index) => {
      const isFile = index === parts.length - 1;
      if (!level.has(name)) {
        level.set(name, {
          name,
          path: parts.slice(0, index + 1).join("/"),
          type: isFile ? "file" : "dir",
          children: new Map(),
        });
      }
      level = level.get(name).children;
    });
  }
  return flatten(root);
}

function flatten(level) {
  return Array.from(level.values())
    .map((node) => ({ ...node, children: flatten(node.children) }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function countFiles(nodes) {
  let total = 0;
  for (const node of nodes || []) {
    total += node.type === "file" ? 1 : countFiles(node.children);
  }
  return total;
}

export function defaultOpenFolders(nodes, depth = 0) {
  const open = [];
  for (const node of nodes || []) {
    if (node.type !== "dir") continue;
    if (depth === 0 || OPEN_BY_DEFAULT.has(node.name.toLowerCase())) open.push(node.path);
    if (depth < 1) open.push(...defaultOpenFolders(node.children, depth + 1));
  }
  return open;
}

export function topLevelSummary(paths) {
  const dirs = new Map();
  const rootFiles = [];
  for (const rawPath of paths || []) {
    const value = String(rawPath);
    const slash = value.indexOf("/");
    if (slash === -1) {
      rootFiles.push(value);
      continue;
    }
    const dir = value.slice(0, slash);
    dirs.set(dir, (dirs.get(dir) || 0) + 1);
  }
  return {
    dirs: Array.from(dirs.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    rootFiles: rootFiles.sort((a, b) => a.localeCompare(b)),
  };
}