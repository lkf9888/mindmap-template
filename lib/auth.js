const crypto = require("node:crypto");

const COOKIE_NAME = "mindmap_cloud_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function readEnv(name) {
  return String(process.env[name] || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function getAuthEmail() {
  return readEnv("MINDMAP_AUTH_EMAIL").toLowerCase();
}

function getPasswordHash() {
  return readEnv("MINDMAP_AUTH_PASSWORD_SHA256").toLowerCase();
}

function getSessionSecret() {
  return readEnv("MINDMAP_SESSION_SECRET");
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signSession(email, issuedAt) {
  return crypto.createHmac("sha256", getSessionSecret()).update(`${email}.${issuedAt}`).digest("base64url");
}

function serializeSession(email) {
  const issuedAt = Date.now();
  const payload = {
    email,
    issuedAt,
    signature: signSession(email, issuedAt),
  };
  return base64UrlEncode(JSON.stringify(payload));
}

function parseCookies(req) {
  return String(req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) {
        return cookies;
      }
      cookies[part.slice(0, separatorIndex)] = decodeURIComponent(part.slice(separatorIndex + 1));
      return cookies;
    }, {});
}

function verifySession(req) {
  const expectedEmail = getAuthEmail();
  const secret = getSessionSecret();
  if (!expectedEmail || !secret) {
    return false;
  }

  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(token));
    const email = String(payload.email || "").toLowerCase();
    const issuedAt = Number(payload.issuedAt);
    const signature = String(payload.signature || "");
    const expired = !Number.isFinite(issuedAt) || Date.now() - issuedAt > SESSION_TTL_SECONDS * 1000;
    if (email !== expectedEmail || expired) {
      return false;
    }

    return timingSafeEqual(signature, signSession(email, issuedAt));
  } catch (error) {
    return false;
  }
}

function isSecureRequest(req) {
  const host = String(req.headers.host || "");
  return (
    req.headers["x-forwarded-proto"] === "https" ||
    !(host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]"))
  );
}

function createSessionCookie(req, email) {
  const secure = isSecureRequest(req) ? "; Secure" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(serializeSession(email))}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function requireSession(req, res) {
  if (verifySession(req)) {
    return true;
  }

  res.status(401).json({ ok: false, error: "unauthorized" });
  return false;
}

async function readJsonBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

module.exports = {
  clearSessionCookie,
  createSessionCookie,
  getAuthEmail,
  getPasswordHash,
  readJsonBody,
  requireSession,
  sha256Hex,
  timingSafeEqual,
  verifySession,
};
