// Shared GitHub helpers used by the repository backend functions.

const API = "https://api.github.com";

const NOISE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage", "vendor",
  "target", "__pycache__", ".venv", "venv", ".idea", ".vscode", ".cache", "pods",
  ".gradle", ".dart_tool", "site-packages", "bower_components", ".terraform",
  ".mypy_cache", ".pytest_cache", ".tox", "tmp", ".svelte-kit",
]);

const LANG_BY_EXT = {
  js: "JavaScript", mjs: "JavaScript", cjs: "JavaScript", jsx: "JavaScript",
  ts: "TypeScript", tsx: "TypeScript", mts: "TypeScript", cts: "TypeScript",
  py: "Python", rb: "Ruby", go: "Go", java: "Java", rs: "Rust", php: "PHP",
  cs: "C#", c: "C", h: "C", cpp: "C++", cc: "C++", hpp: "C++", kt: "Kotlin",
  kts: "Kotlin", swift: "Swift", dart: "Dart", lua: "Lua", sh: "Shell",
  bash: "Shell", zsh: "Shell", sql: "SQL", html: "HTML", css: "CSS",
  scss: "SCSS", sass: "Sass", less: "Less", vue: "Vue", svelte: "Svelte",
  json: "JSON", json5: "JSON", yml: "YAML", yaml: "YAML", toml: "TOML",
  md: "Markdown", mdx: "Markdown", xml: "XML", svg: "SVG", ipynb: "Jupyter Notebook",
  ps1: "PowerShell", ex: "Elixir", exs: "Elixir", zig: "Zig", scala: "Scala",
  r: "R", jl: "Julia", gradle: "Gradle", cmake: "CMake", proto: "Protocol Buffers",
  graphql: "GraphQL", gql: "GraphQL", sol: "Solidity", asm: "Assembly", txt: "Text",
};

const EXTRA_TEXT = [
  "txt", "env", "cfg", "ini", "lock", "conf", "properties", "rst", "csv", "tsv",
  "editorconfig", "gitignore", "dockerignore", "npmrc", "babelrc", "eslintrc",
  "prettierrc", "nvmrc", "python-version", "example", "patch", "diff", "mk", "tex",
];

const TEXT_EXT = new Set([...Object.keys(LANG_BY_EXT), ...EXTRA_TEXT]);

const TEXT_BASENAMES = [
  "dockerfile", "makefile", "procfile", "license", "readme", "gemfile", "rakefile",
  "pipfile", "brewfile", "codeowners", "justfile",
];

const DEP_BASENAMES = new Set([
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
  "requirements.txt", "pyproject.toml", "poetry.lock", "pipfile", "pipfile.lock",
  "setup.py", "setup.cfg", "cargo.toml", "cargo.lock", "go.mod", "go.sum",
  "gemfile", "gemfile.lock", "pom.xml", "build.gradle", "build.gradle.kts",
  "composer.json", "composer.lock", "pubspec.yaml", "mix.exs", "deno.json",
  "environment.yml", "packages.config",
]);

const CONFIG_BASENAMES = new Set([
  "package.json", "tsconfig.json", "jsconfig.json", "angular.json", "composer.json",
  "jest.config.js", "jest.config.ts", "vitest.config.ts", "playwright.config.ts",
  "cypress.config.js", "babel.config.js", ".babelrc", "eslint.config.js",
  ".eslintrc", ".eslintrc.js", ".eslintrc.json", ".prettierrc", ".editorconfig",
  "dockerfile", "docker-compose.yml", "docker-compose.yaml", "makefile",
  ".env.example", ".env.sample", "vercel.json", "netlify.toml", "procfile",
  "railway.json", "pytest.ini", "tox.ini", "ruff.toml", "mypy.ini", "setup.cfg",
  "pyproject.toml", "requirements.txt", "go.mod", "cargo.toml", "pubspec.yaml",
  "gradle.properties", "settings.gradle", "index.html", "manifest.json",
  "tailwind.config.js", "tailwind.config.ts", "postcss.config.js", "nuxt.config.ts",
  "next.config.js", "next.config.mjs", "next.config.ts", "svelte.config.js",
  "astro.config.mjs", "webpack.config.js", "rollup.config.js", "vite.config.js",
  "vite.config.ts", "eslint.config.mjs",
]);

const ENTRY_RES = [
  /^(src\/)?(index|main|app|server|client|cli|run|start|manage|wsgi|asgi)\.(js|jsx|ts|tsx|mjs|cjs|py|rb|go|rs|php|java|cs|kt|swift|dart)$/i,
  /^(src\/)?app\.(jsx|tsx|js|ts)$/i,
  /^(cmd\/[^/]+\/main\.go|main\.go|main\.rs|src\/main\.rs|lib\/main\.dart|program\.cs|app\.py|manage\.py|wsgi\.py|asgi\.py|__main__\.py)$/i,
  /^(public\/)?index\.html$/i,
  /^bin\/[^/]+$/i,
  /^(src\/)?pages\/(index|_app)\.(js|jsx|ts|tsx)$/i,
];

export function basenameOf(path) {
  const parts = String(path || "").split("/");
  return parts[parts.length - 1] || "";
}

export function isNoisePath(path) {
  const parts = String(path || "").split("/");
  return parts.some((segment) => NOISE_DIRS.has(segment.toLowerCase()));
}

export function parseRepoUrl(raw) {
  if (typeof raw !== "string") return null;
  let value = raw.trim();
  if (!value) return null;
  value = value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const hostMatch = value.match(/^([^/]+)\//);
  if (hostMatch) {
    if (!/^github\.com$/i.test(hostMatch[1])) return null;
    value = value.slice(hostMatch[0].length);
  }
  const parts = value.split(/[?#]/)[0].split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
  if (owner.startsWith(".") || repo.startsWith(".")) return null;
  let branch = null;
  let path = null;
  const kind = (parts[2] || "").toLowerCase();
  if ((kind === "tree" || kind === "blob") && parts[3]) {
    branch = parts[3];
    if (kind === "blob") path = parts.slice(4).join("/") || null;
  }
  return { owner, repo, branch, path };
}

export function isTextPath(path) {
  const base = basenameOf(path).toLowerCase();
  if (!base) return false;
  const plain = base.replace(/^\./, "");
  if (TEXT_BASENAMES.some((name) => plain === name || plain.startsWith(`${name}.`) || plain.startsWith(`${name}-`))) return true;
  const dot = base.lastIndexOf(".");
  if (dot === -1) return false;
  return TEXT_EXT.has(base.slice(dot + 1));
}

export function langForPath(path) {
  const base = basenameOf(path).toLowerCase();
  if (base === "dockerfile" || base.startsWith("dockerfile.")) return "Dockerfile";
  if (base === "makefile" || base === "gnumakefile") return "Makefile";
  if (base === "procfile") return "Procfile";
  const dot = base.lastIndexOf(".");
  if (dot === -1) return "Text";
  const ext = base.slice(dot + 1);
  if (LANG_BY_EXT[ext]) return LANG_BY_EXT[ext];
  return dot === 0 ? "Config" : ext.toUpperCase();
}

export function isConfigFile(path) {
  const base = basenameOf(path).toLowerCase();
  if (CONFIG_BASENAMES.has(base)) return true;
  if (path.toLowerCase().startsWith(".github/workflows/")) return true;
  if (/^(vite|next|nuxt|tailwind|postcss|rollup|webpack|svelte|astro)\.config\.[a-z]+$/.test(base)) return true;
  if (/^docker-compose\./.test(base)) return true;
  return false;
}

export function classifyPaths(paths) {
  const entryPoints = [];
  const configFiles = [];
  const dependencyFiles = [];
  for (const path of paths) {
    if (DEP_BASENAMES.has(basenameOf(path).toLowerCase())) dependencyFiles.push(path);
    if (isConfigFile(path)) configFiles.push(path);
    if (ENTRY_RES.some((re) => re.test(path))) entryPoints.push(path);
  }
  return {
    entry_points: entryPoints.slice(0, 8),
    config_files: configFiles.slice(0, 14),
    dependency_files: dependencyFiles.slice(0, 10),
  };
}

export function readmeSummary(markdown, max = 900) {
  if (!markdown) return "";
  let text = String(markdown);
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/<!--[\s\S]*?-->/g, " ");
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/<[^>]+>/g, " ");
  const kept = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) {
      if (kept.length) kept.push("");
      continue;
    }
    if (/^[=\-*_~]{3,}$/.test(line)) continue;
    if (!/[a-z]/i.test(line)) continue;
    kept.push(line);
  }
  let out = kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (out.length > max) {
    out = out.slice(0, max);
    const cut = Math.max(out.lastIndexOf(". "), out.lastIndexOf("\n"));
    if (cut > max * 0.5) out = out.slice(0, cut + 1);
    out = `${out.trim()}…`;
  }
  return out;
}

export async function ghMessage(res) {
  if (res.status === 404) return "GitHub could not find that repository or file. Check the URL and that the repository is public.";
  if (res.status === 403 || res.status === 429) return "GitHub's public request limit was reached. Please try again in a few minutes.";
  if (res.status === 451) return "GitHub reports this repository is unavailable for legal reasons.";
  try {
    const data = await res.json();
    return data && data.message ? `GitHub: ${data.message}` : `GitHub returned status ${res.status}.`;
  } catch {
    return `GitHub returned status ${res.status}.`;
  }
}

export async function ghFetch(path, accept, timeoutMs = 12000) {
  return await fetch(`${API}${path}`, {
    headers: {
      Accept: accept || "application/vnd.github+json",
      "User-Agent": "RepoSathi-AI",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
}

export async function ghJson(path, timeoutMs = 12000) {
  const res = await ghFetch(path, null, timeoutMs);
  if (!res.ok) {
    const error = new Error(await ghMessage(res));
    error.status = res.status;
    throw error;
  }
  return await res.json();
}