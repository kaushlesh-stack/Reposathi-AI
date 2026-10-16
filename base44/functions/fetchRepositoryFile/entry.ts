import { ghFetch, ghMessage, isTextPath, langForPath } from "../../shared/github.ts";

const MAX_BYTES = 200000;
const MAX_CHARS = 120000;

function decodeBase64Utf8(value) {
  const clean = String(value || "").replace(/\s/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export default async function (req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const owner = String(body.owner || "").trim();
    const repo = String(body.repo || "").trim();
    const ref = body.ref ? String(body.ref).trim() : "";
    const path = String(body.path || "").trim().replace(/^\/+/, "");

    if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) {
      return Response.json({ ok: false, error: "Missing repository owner or name." }, { status: 400 });
    }
    if (!path || path.length > 400 || path.includes("..")) {
      return Response.json({ ok: false, error: "That file path is not valid." }, { status: 400 });
    }
    if (!isTextPath(path)) {
      return Response.json(
        { ok: false, error: "This file type cannot be shown as code here.", language: langForPath(path) },
        { status: 400 }
      );
    }

    const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    const res = await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURI(path)}${query}`);
    if (!res.ok) {
      return Response.json({ ok: false, error: await ghMessage(res) }, { status: 400 });
    }

    const info = await res.json();
    if (!info || info.type !== "file") {
      return Response.json({ ok: false, error: "That path is a folder, not a file." }, { status: 400 });
    }
    if (info.size > MAX_BYTES) {
      return Response.json(
        {
          ok: false,
          error: `This file is ${Math.round(info.size / 1024)} KB, which is too large to display here.`,
          size: info.size,
        },
        { status: 400 }
      );
    }
    if (info.encoding !== "base64" || typeof info.content !== "string") {
      return Response.json(
        { ok: false, error: "GitHub did not return readable text for this file.", language: langForPath(path) },
        { status: 400 }
      );
    }

    let content = decodeBase64Utf8(info.content);
    let truncated = false;
    if (content.length > MAX_CHARS) {
      content = content.slice(0, MAX_CHARS);
      truncated = true;
    }

    return Response.json({
      ok: true,
      path,
      language: langForPath(path),
      size: info.size,
      sha: info.sha || "",
      content,
      truncated,
      line_count: content.split("\n").length,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message || "Unexpected error while reading the file." },
      { status: 500 }
    );
  }
}