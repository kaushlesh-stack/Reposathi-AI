// Lightweight syntax tokenizer for read-only code display.

const FAMILY_BY_LANGUAGE = {
  JavaScript: "js", TypeScript: "js", JSON: "js", JSX: "js", "Jupyter Notebook": "js",
  Python: "py",
  Ruby: "hash", Shell: "hash", YAML: "hash", TOML: "hash", Dockerfile: "hash",
  Makefile: "hash", Config: "hash", Text: "hash", "Protocol Buffers": "hash",
  GraphQL: "hash", CMake: "hash",
  HTML: "html", XML: "html", SVG: "html", Vue: "html", Svelte: "html",
  CSS: "css", SCSS: "css", Sass: "css", Less: "css",
  SQL: "sql",
  Markdown: "md",
};

const JS_KEYWORDS =
  "const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|super|import|from|export|default|await|async|try|catch|finally|throw|typeof|instanceof|delete|in|of|this|true|false|null|undefined|void|yield|static|get|set";

const PY_KEYWORDS =
  "def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|class|with|try|except|finally|raise|lambda|yield|global|nonlocal|pass|break|continue|assert|async|await|self|del";

const SQL_KEYWORDS =
  "SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|AS|AND|OR|NOT|NULL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|PRIMARY|KEY|FOREIGN|REFERENCES|INDEX|UNIQUE|DEFAULT|CASE|WHEN|THEN|END|UNION|ALL";

const HASH_KEYWORDS = "true|false|null|yes|no|on|off|if|then|fi|for|in|do|done|while|echo|export|return|function|local|set|end";

const PATTERNS = {
  js: new RegExp(
    [
      "(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
      "(?<string>\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`(?:\\\\.|[^`\\\\])*`)",
      "(?<number>\\b\\d[\\w.]*\\b)",
      `(?<keyword>\\b(?:${JS_KEYWORDS})\\b)`,
      "(?<fn>\\b[A-Za-z_$][\\w$]*(?=\\s*\\())",
      "(?<punct>[{}()\\[\\];,.<>=+\\-*/%!&|?:~^]+)",
    ].join("|"),
    "g"
  ),
  py: new RegExp(
    [
      "(?<comment>#[^\\n]*)",
      "(?<string>\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')",
      "(?<number>\\b\\d[\\w.]*\\b)",
      `(?<keyword>\\b(?:${PY_KEYWORDS})\\b)`,
      "(?<fn>\\b[A-Za-z_][\\w]*(?=\\s*\\())",
      "(?<punct>[{}()\\[\\];,.<>=+\\-*/%!&|?:@]+)",
    ].join("|"),
    "g"
  ),
  hash: new RegExp(
    [
      "(?<comment>#[^\\n]*)",
      "(?<key>^[\\s-]*[\\w.-]+(?=\\s*[:=]))",
      "(?<string>\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')",
      "(?<number>\\b\\d[\\w.]*\\b)",
      `(?<keyword>\\b(?:${HASH_KEYWORDS})\\b)`,
      "(?<punct>[:{}\\[\\],=<>|&$]+)",
    ].join("|"),
    "g"
  ),
  html: new RegExp(
    [
      "(?<comment><!--[\\s\\S]*?-->)",
      "(?<tag><\\/?[A-Za-z][\\w:-]*)",
      "(?<attr>\\b[A-Za-z-][\\w:-]*(?=\\s*=))",
      "(?<string>\"[^\"]*\"|'[^']*')",
      "(?<punct>[<>/=]+)",
    ].join("|"),
    "g"
  ),
  css: new RegExp(
    [
      "(?<comment>\\/\\*[\\s\\S]*?\\*\\/)",
      "(?<key>[@.]?[A-Za-z-][\\w-]*(?=\\s*[:{]))",
      "(?<string>\"[^\"]*\"|'[^']*')",
      "(?<number>#[0-9a-fA-F]{3,8}\\b|\\b\\d[\\w.%]*\\b)",
      "(?<punct>[{}();:,>+~*]+)",
    ].join("|"),
    "g"
  ),
  sql: new RegExp(
    [
      "(?<comment>--[^\\n]*)",
      "(?<string>'(?:[^']|'')*')",
      "(?<number>\\b\\d+\\b)",
      `(?<keyword>\\b(?:${SQL_KEYWORDS})\\b)`,
      "(?<punct>[(),.;*=<>]+)",
    ].join("|"),
    "g"
  ),
  md: new RegExp(
    [
      "(?<keyword>^#{1,6}\\s+.*$)",
      "(?<string>`[^`]*`)",
      "(?<fn>\\*\\*[^*]+\\*\\*|__[^_]+__)",
      "(?<key>^>\\s+.*$|^[-*+]\\s+)",
      "(?<punct>[\\[\\]()|]+)",
    ].join("|"),
    "g"
  ),
};

export const TOKEN_CLASS = {
  comment: "text-slate-500 italic",
  string: "text-[#7DD3FC]",
  number: "text-[#F0ABFC]",
  keyword: "text-[#C4B5FD]",
  fn: "text-[#67E8F9]",
  key: "text-[#A5B4FC]",
  tag: "text-[#C4B5FD]",
  attr: "text-[#7DD3FC]",
  punct: "text-slate-400",
  plain: "text-slate-200",
};

const GROUP_ORDER = ["comment", "string", "number", "keyword", "key", "tag", "attr", "fn", "punct"];

export function familyFor(language) {
  return FAMILY_BY_LANGUAGE[language] || "plain";
}

export function tokenizeLine(line, family) {
  const text = typeof line === "string" ? line : "";
  const pattern = PATTERNS[family];
  if (!pattern || !text) return [{ text, type: "plain" }];

  pattern.lastIndex = 0;
  const tokens = [];
  let cursor = 0;
  let match = pattern.exec(text);

  while (match !== null) {
    if (match.index > cursor) tokens.push({ text: text.slice(cursor, match.index), type: "plain" });
    const groups = match.groups || {};
    let type = "plain";
    for (const name of GROUP_ORDER) {
      if (groups[name] !== undefined) {
        type = name;
        break;
      }
    }
    tokens.push({ text: match[0], type });
    cursor = match.index + match[0].length;
    if (match[0].length === 0) pattern.lastIndex += 1;
    match = pattern.exec(text);
  }

  if (cursor < text.length) tokens.push({ text: text.slice(cursor), type: "plain" });
  return tokens.length ? tokens : [{ text, type: "plain" }];
}