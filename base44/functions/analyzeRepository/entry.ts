import {
  parseRepoUrl,
  ghJson,
  ghFetch,
  ghMessage,
  classifyPaths,
  isTextPath,
  isNoisePath,
  langForPath,
  readmeSummary,
} from "../../shared/github.ts";

const MAX_FILES = 400;

function reasonFor(reason) {
  if (!reason) return "unknown error";
  return reason.message || String(reason);
}

export default async function (req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const parsed = parseRepoUrl(body.repo_url);
    if (!parsed) {
      return Response.json(
        { ok: false, error: "Enter a public GitHub repository URL, for example https://github.com/owner/repository." },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;
    const notes = [];

    let meta;
    try {
      meta = await ghJson(`/repos/${owner}/${repo}`);
    } catch (error) {
      return Response.json(
        { ok: false, error: error.message || "Could not reach GitHub." },
        { status: error.status && error.status < 500 ? 400 : 502 }
      );
    }

    const branch = parsed.branch || meta.default_branch || "main";

    const [languagesResult, treeResult, readmeResult] = await Promise.allSettled([
      ghJson(`/repos/${owner}/${repo}/languages`),
      ghJson(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`),
      ghFetch(`/repos/${owner}/${repo}/readme`, "application/vnd.github.raw"),
    ]);

    let languages = [];
    if (languagesResult.status === "fulfilled" && languagesResult.value) {
      const totals = languagesResult.value;
      const sum = Object.values(totals).reduce((acc, value) => acc + value, 0) || 1;
      languages = Object.entries(totals)
        .map(([name, bytes]) => ({ name, percent: Math.round((bytes / sum) * 1000) / 10 }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 8);
    } else {
      notes.push("GitHub did not return a language breakdown for this repository.");
    }

    let allPaths = [];
    let treeTruncated = false;
    if (treeResult.status === "fulfilled" && treeResult.value) {
      treeTruncated = Boolean(treeResult.value.truncated);
      allPaths = (treeResult.value.tree || [])
        .filter((node) => node && node.type === "blob" && node.path && !isNoisePath(node.path))
        .map((node) => ({ path: node.path, size: node.size || 0 }));
      if (treeTruncated) {
        notes.push("GitHub truncated the file listing because this repository is very large, so the structure shown is partial.");
      }
    } else {
      notes.push(`The file listing could not be read from GitHub (${reasonFor(treeResult.reason)}). Repository details are still shown below.`);
    }

    const totalFiles = allPaths.length;
    const files = allPaths.slice(0, MAX_FILES).map((file) => ({
      path: file.path,
      size: file.size,
      lang: langForPath(file.path),
      text: isTextPath(file.path),
    }));

    if (totalFiles > MAX_FILES) {
      notes.push(`Showing the first ${MAX_FILES} of ${totalFiles} files. Generated folders and installed dependencies are excluded.`);
    }
    if (files.some((file) => !file.text)) {
      notes.push("Binary and other non-text files are listed for completeness but cannot be opened in the code viewer.");
    }

    let readmeExcerpt = "";
    if (readmeResult.status === "fulfilled" && readmeResult.value && readmeResult.value.ok) {
      readmeExcerpt = readmeSummary(await readmeResult.value.text(), 900);
    } else if (readmeResult.status === "fulfilled") {
      notes.push(`No README could be read at the root of this repository (GitHub status ${readmeResult.value.status}).`);
    } else {
      notes.push(`No README could be read at the root of this repository (${reasonFor(readmeResult.reason)}).`);
    }

    const classified = classifyPaths(allPaths.map((file) => file.path));

    return Response.json({
      ok: true,
      repository: {
        repo_url: `https://github.com/${owner}/${repo}`,
        owner,
        repo,
        full_name: meta.full_name || `${owner}/${repo}`,
        description: meta.description || "",
        default_branch: branch,
        stars: meta.stargazers_count || 0,
        forks: meta.forks_count || 0,
        open_issues: meta.open_issues_count || 0,
        license: (meta.license && (meta.license.spdx_id || meta.license.name)) || "",
        homepage: meta.homepage || "",
        topics: Array.isArray(meta.topics) ? meta.topics.slice(0, 8) : [],
        pushed_at: meta.pushed_at || "",
        archived: Boolean(meta.archived),
      },
      languages,
      primary_language: languages.length ? languages[0].name : meta.language || "",
      total_files: totalFiles,
      files,
      tree_truncated: treeTruncated,
      readme_excerpt: readmeExcerpt,
      entry_points: classified.entry_points,
      config_files: classified.config_files,
      dependency_files: classified.dependency_files,
      analysis_status: treeResult.status === "fulfilled" ? (treeTruncated ? "partial" : "analyzed") : "partial",
      notes,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message || "Unexpected error while analysing the repository." },
      { status: 500 }
    );
  }
}