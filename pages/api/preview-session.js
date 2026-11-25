// Exchanges a backend-issued preview token for the website's signed Edge pass.
//
// POST   /api/preview-session  { token }  -> sets HttpOnly aduanefie_edge_pass
// DELETE /api/preview-session             -> clears it (lock / revocation)
//
// The token is re-validated by the backend (HMAC check) before any cookie is
// issued. The access code itself never reaches this route.

import {
  EDGE_PASS_COOKIE,
  EDGE_PASS_MAX_AGE,
  signEdgePass,
} from "../../src/utils/previewEdgePass";

export const config = {
  api: { bodyParser: { sizeLimit: "1kb" } },
};

const TOKEN_PATTERN = /^\d{1,12}\.[a-f0-9]{64}$/i;

function cookieHeader(value, maxAge) {
  const parts = [
    `${EDGE_PASS_COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", cookieHeader("", 0));
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json({ ok: false });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ ok: false });
  }

  const secret = process.env.PREVIEW_EDGE_SECRET;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  if (!secret || secret.length < 32 || !baseUrl) {
    // Fail closed: without a server secret no Edge pass can be issued.
    return res.status(503).json({ ok: false, code: "preview_gate_unconfigured" });
  }

  const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
  if (!TOKEN_PATTERN.test(token)) {
    return res.status(403).json({ ok: false });
  }

  let expiresAt = null;
  try {
    const upstream = await fetch(`${baseUrl}/api/v1/waitlist/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-software-id": "33571750",
        origin: process.env.NEXT_CLIENT_HOST_URL || "",
      },
      body: JSON.stringify({ token }),
    });
    if (!upstream.ok) {
      res.setHeader("Set-Cookie", cookieHeader("", 0));
      return res.status(403).json({ ok: false });
    }
    const data = await upstream.json();
    if (data?.valid !== true) {
      res.setHeader("Set-Cookie", cookieHeader("", 0));
      return res.status(403).json({ ok: false });
    }
    expiresAt = Number(data.expires_at);
  } catch {
    return res.status(502).json({ ok: false });
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = Math.min(
    Number.isFinite(expiresAt) && expiresAt > now ? expiresAt : now,
    now + EDGE_PASS_MAX_AGE
  );
  if (exp <= now) {
    return res.status(403).json({ ok: false });
  }

  const pass = await signEdgePass(exp, secret);
  res.setHeader("Set-Cookie", cookieHeader(pass, exp - now));
  return res.status(200).json({ ok: true, expires_at: exp });
}
