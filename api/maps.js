const { del, get, list, put } = require("@vercel/blob");
const { requireSession } = require("../lib/auth");

const DATA_PATH = "accounts/lkf9888/maps.json";
const BACKUP_PREFIX = "accounts/lkf9888/backups/";
const CLOUD_BACKUP_LIMIT = 40;
const MAX_BODY_BYTES = 4 * 1024 * 1024;

async function streamToText(stream) {
  return new Response(stream).text();
}

function isStorageEnvelope(value) {
  return (
    value &&
    typeof value === "object" &&
    Number.isFinite(value.version) &&
    Array.isArray(value.maps) &&
    typeof value.activeMapId === "string"
  );
}

async function readCloudData() {
  const result = await get(DATA_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }

  const raw = await streamToText(result.stream);
  return raw ? JSON.parse(raw) : null;
}

async function writeCloudBackup(raw) {
  if (!raw) {
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await put(`${BACKUP_PREFIX}maps-${stamp}.json`, raw, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  const backups = await list({ prefix: BACKUP_PREFIX, limit: 1000 });
  const stale = backups.blobs
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(CLOUD_BACKUP_LIMIT);

  if (stale.length) {
    await del(stale.map((blob) => blob.pathname));
  }
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

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (!requireSession(req, res)) {
    return;
  }

  if (req.method === "GET") {
    try {
      const storage = await readCloudData();
      res.status(200).json({
        ok: true,
        storage,
      });
    } catch (error) {
      res.status(500).json({ ok: false, error: "cloud_read_failed" });
    }
    return;
  }

  if (req.method !== "PUT") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const body = JSON.parse(rawBody);
    const storage = body.storage;
    if (!isStorageEnvelope(storage)) {
      res.status(400).json({ ok: false, error: "invalid_storage_payload" });
      return;
    }

    const nextSerialized = JSON.stringify({
      ...storage,
      cloudSavedAt: new Date().toISOString(),
    });

    const current = await readCloudData();
    const currentSerialized = current ? JSON.stringify(current) : "";
    if (currentSerialized && currentSerialized !== nextSerialized) {
      await writeCloudBackup(currentSerialized);
    }

    const blob = await put(DATA_PATH, nextSerialized, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    res.status(200).json({
      ok: true,
      savedAt: new Date().toISOString(),
      etag: blob.etag,
    });
  } catch (error) {
    res.status(error.message === "payload_too_large" ? 413 : 500).json({
      ok: false,
      error: error.message === "payload_too_large" ? "payload_too_large" : "cloud_write_failed",
    });
  }
};
