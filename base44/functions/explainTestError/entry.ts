import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";

const MAX_OUTPUT = 12000;

const TEST_SCHEMA = {
  type: "object",
  properties: {
    counts: {
      type: "object",
      properties: {
        detected: { type: "boolean" },
        total: { type: "number" },
        passed: { type: "number" },
        failed: { type: "number" },
      },
      required: ["detected"],
    },
    summary: { type: "string" },
    explanation: { type: "string" },
    suggested_fixes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          files: { type: "array", items: { type: "string" } },
        },
        required: ["title", "detail"],
      },
    },
    referenced_files: { type: "array", items: { type: "string" } },
  },
  required: ["explanation"],
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const rawOutput = String(body.raw_output || "").trim().slice(0, MAX_OUTPUT);
    if (rawOutput.length < 10) {
      return Response.json(
        { ok: false, error: "Paste the test output you want explained (at least a few lines)." },
        { status: 400 }
      );
    }

    const repository = body.repository || {};
    const prompt = [
      "You are RepoSathi AI's test assistant. You help beginner developers understand failing test output.",
      "",
      "Important: the output below was pasted by the user from their own machine. You did NOT run these tests and you cannot run any tests.",
      "",
      "Rules:",
      "- Read the test counts only if the output states them explicitly. If it does not, set detected to false and leave the numbers at 0.",
      "- Explain the most important failure in plain language: what the test expected and what actually happened instead.",
      "- Suggest possible fixes. These are suggestions to try, not verified fixes: never say a fix is confirmed or tested.",
      "- Only reference files that are actually named in the output.",
      "- Keep it beginner-friendly and concrete.",
      "",
      repository.full_name ? `Repository: ${repository.full_name}` : "Repository: not specified",
      repository.primary_language ? `Primary language: ${repository.primary_language}` : "",
      body.test_command ? `Command the user ran: ${body.test_command}` : "",
      "",
      "Test output:",
      "```",
      rawOutput,
      "```",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: TEST_SCHEMA,
    });

    const data = response && typeof response === "object" ? response : {};
    const explanation = typeof data.explanation === "string" ? data.explanation.trim() : "";
    if (!explanation) {
      return Response.json({ ok: false, error: "The assistant did not return an explanation. Please try again." }, { status: 502 });
    }

    const counts = data.counts && data.counts.detected
      ? {
          detected: true,
          total: Number(data.counts.total) || 0,
          passed: Number(data.counts.passed) || 0,
          failed: Number(data.counts.failed) || 0,
        }
      : { detected: false, total: 0, passed: 0, failed: 0 };

    const fixes = Array.isArray(data.suggested_fixes)
      ? data.suggested_fixes
          .filter((fix) => fix && fix.title)
          .slice(0, 5)
          .map((fix) => ({
            title: String(fix.title),
            detail: String(fix.detail || ""),
            files: Array.isArray(fix.files) ? fix.files.slice(0, 4).map((f) => String(f)) : [],
          }))
      : [];

    const referencedFiles = Array.isArray(data.referenced_files)
      ? data.referenced_files.slice(0, 8).map((f) => String(f))
      : [];

    return Response.json({
      ok: true,
      counts,
      summary: typeof data.summary === "string" ? data.summary : "",
      explanation,
      suggested_fixes: fixes,
      referenced_files: referencedFiles,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message || "The test assistant is unavailable right now." },
      { status: 500 }
    );
  }
}