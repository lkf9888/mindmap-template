const {
  clearSessionCookie,
  createSessionCookie,
  getAuthEmail,
  getPasswordHash,
  readJsonBody,
  sha256Hex,
  timingSafeEqual,
  verifySession,
} = require("../lib/auth");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    res.status(200).json({ ok: true, authenticated: verifySession(req) });
    return;
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearSessionCookie());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const expectedEmail = getAuthEmail();
  const expectedPasswordHash = getPasswordHash();
  if (!expectedEmail || !expectedPasswordHash) {
    res.status(500).json({ ok: false, error: "auth_not_configured" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const passwordHash = sha256Hex(String(body.password || ""));

    if (email !== expectedEmail || !timingSafeEqual(passwordHash, expectedPasswordHash)) {
      res.status(401).json({ ok: false, error: "invalid_credentials" });
      return;
    }

    res.setHeader("Set-Cookie", createSessionCookie(req, email));
    res.status(200).json({ ok: true, email });
  } catch (error) {
    res.status(400).json({ ok: false, error: "invalid_request" });
  }
};
