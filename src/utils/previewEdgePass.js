// Signed Edge session for the private preview gate.
//
// The website issues its own HMAC-signed, HttpOnly cookie after the backend
// confirms a preview token. Middleware verifies the signature with the
// server-only PREVIEW_EDGE_SECRET, so a hand-made cookie cannot unlock pages.
// Works in both the Edge runtime and Node (Web Crypto).

export const EDGE_PASS_COOKIE = "aduanefie_edge_pass";
export const EDGE_PASS_MAX_AGE = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function signEdgePass(expSeconds, secret) {
  const sig = await hmacHex(`aduanefie-edge-v1:${expSeconds}`, secret);
  return `${expSeconds}.${sig}`;
}

export async function verifyEdgePass(rawValue, secret) {
  if (!secret || typeof rawValue !== "string") return false;
  const dotIdx = rawValue.indexOf(".");
  if (dotIdx <= 0) return false;
  const expStr = rawValue.slice(0, dotIdx);
  const sigStr = rawValue.slice(dotIdx + 1).toLowerCase();
  if (!/^\d{1,12}$/.test(expStr) || !/^[a-f0-9]{64}$/.test(sigStr)) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = await hmacHex(`aduanefie-edge-v1:${exp}`, secret);
    return constantTimeEqual(expected, sigStr);
  } catch {
    return false;
  }
}
