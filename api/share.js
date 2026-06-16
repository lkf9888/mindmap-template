const crypto = require("node:crypto");
const { get, put } = require("@vercel/blob");
const { requireSession } = require("../lib/auth");

const SHARE_PREFIX = "accounts/lkf9888/shares/";
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const SHARE_ID_PATTERN = /^[a-zA-Z0-9_-]{8,32}$/;

async function streamToText(stream) {
  return new Response(stream).text();
}

function createShareId() {
  return crypto.randomBytes(8).toString("base64url");
}

function getShareId(req) {
  const requestUrl = new URL(req.url || "/api/share", `https://${req.headers.host || "localhost"}`);
  return String(requestUrl.searchParams.get("id") || requestUrl.searchParams.get("s") || "").trim();
}

function getSharePath(id) {
  return `${SHARE_PREFIX}${id}.json`;
}

function isShareId(value) {
  return SHARE_ID_PATTERN.test(value);
}

function isShareMap(value) {
  return value && typeof value === "object" && Array.isArray(value.nodes) && Array.isArray(value.edges);
}

async function readRequestBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      throw new Error("payload_too_large");
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readSharedMap(id) {
  const result = await get(getSharePath(id), { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }

  const raw = await streamToText(result.stream);
  return raw ? JSON.parse(raw) : null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const id = getShareId(req);
    if (!isShareId(id)) {
      res.status(400).json({ ok: false, error: "invalid_share_id" });
      return;
    }

    try {
      const share = await readSharedMap(id);
      if (!share?.map) {
        res.status(404).json({ ok: false, error: "share_not_found" });
        return;
      }

      res.status(200).json({ ok: true, id, map: share.map });
    } catch (error) {
      res.status(500).json({ ok: false, error: "share_read_failed" });
    }
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!requireSession(req, res)) {
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const body = JSON.parse(rawBody);
    if (!isShareMap(body.map)) {
      res.status(400).json({ ok: false, error: "invalid_share_payload" });
      return;
    }

    const id = createShareId();
    await put(
      getSharePath(id),
      JSON.stringify({
        id,
        createdAt: new Date().toISOString(),
        map: body.map,
      }),
      {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "application/json",
      },
    );

    res.status(200).json({ ok: true, id });
  } catch (error) {
    res.status(error.message === "payload_too_large" ? 413 : 500).json({
      ok: false,
      error: error.message === "payload_too_large" ? "payload_too_large" : "share_write_failed",
    });
  }
};
