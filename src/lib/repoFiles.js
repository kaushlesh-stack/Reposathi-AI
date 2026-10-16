// Frontend file helpers: language detection, text detection, repository URL validation.

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

const TEXT_BASENAMES = [
  "dockerfile", "makefile", "procfile", "license", "readme", "gemfile", "rakefile",
  "pipfile", "brewfile", "codeowners", "justfile",
];

const TEXT_EXT = new Set([
  ...Object.keys(LANG_BY_EXT),
  "env", "cfg", "ini", "lock", "conf", "properties", "rst", "csv", "tsv",
  "editorconfig", "gitignore", "gitattributes", "dockerignore", "npmrc",
  "babelrc", "eslintrc", "prettierrc", "nvmrc", "python-version", "example",
  "patch", "diff", "mk", "tex",
]);

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "ico", "bmp", "avif"]);

export function basename(path) {
  const parts = String(path || "").split("/");
  return parts[parts.length - 1] || "";
}

export function extensionOf(path) {
  const base = basename(path).toLowerCase();
  const dot = base.lastIndexOf(".");
  return dot === -1 ? "" : base.slice(dot + 1);
}

export function isTextPath(path) {
  const base = basename(path).toLowerCase();
  if (!base) return false;
  const plain = base.replace(/^\./, "");
  if (TEXT_BASENAMES.some((name) => plain === name || plain.startsWith(`${name}.`) || plain.startsWith(`${name}-`))) return true;
  const ext = extensionOf(path);
  if (!ext) return false;
  return TEXT_EXT.has(ext);
}

export function langForPath(path) {
  const base = basename(path).toLowerCase();
  if (base === "dockerfile" || base.startsWith("dockerfile.")) return "Dockerfile";
  if (base === "makefile" || base === "gnumakefile") return "Makefile";
  if (base === "procfile") return "Procfile";
  const ext = extensionOf(path);
  if (!ext) return "Text";
  if (LANG_BY_EXT[ext]) return LANG_BY_EXT[ext];
  return base.startsWith(".") ? "Config" : ext.toUpperCase();
}

export function fileKind(path) {
  const ext = extensionOf(path);
  if (IMAGE_EXT.has(ext)) return "image";
  if (ext === "md" || ext === "mdx" || ext === "rst" || ext === "txt") return "text";
  if (ext === "json" || ext === "yml" || ext === "yaml" || ext === "toml" || ext === "ini" || ext === "xml") return "data";
  if (ext === "css" || ext === "scss" || ext === "sass" || ext === "less") return "style";
  if (["js", "jsx", "ts", "tsx", "py", "rb", "go", "java", "rs", "php", "cs", "c", "cpp", "h", "kt", "swift", "dart", "lua", "sh", "sql", "vue", "svelte", "html"].includes(ext)) return "code";
  if (basename(path).toLowerCase().startsWith(".")) return "config";
  return "other";
}

export function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(value < 10240 ? 1 : 0)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function relativeTime(value) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(1, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(then).toLocaleDateString();
}

export function validateRepoUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return { ok: false, error: "Enter a GitHub repository URL." };
  let rest = raw.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const host = rest.match(/^([^/]+)\//);
  if (host) {
    if (!/^github\.com$/i.test(host[1])) {
      return { ok: false, error: "Only public github.com repositories are supported right now." };
    }
    rest = rest.slice(host[0].length);
  }
  const parts = rest.split(/[?#]/)[0].split("/").filter(Boolean);
  if (parts.length < 2) {
    return { ok: false, error: "Use the full URL, like https://github.com/owner/repository." };
  }
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo) || owner.startsWith(".") || repo.startsWith(".")) {
    return { ok: false, error: "That does not look like a valid repository URL." };
  }
  return { ok: true, owner, repo, url: `https://github.com/${owner}/${repo}` };
}

export function truncatePath(path, max = 46) {
  const value = String(path || "");
  if (value.length <= max) return value;
  const parts = value.split("/");
  const name = parts[parts.length - 1];
  if (name.length >= max - 3) return `…${name.slice(name.length - (max - 1))}`;
  return `…/${value.slice(value.length - (max - 2))}`;
}