// Exchange a Bearer token (or a guest id) for a short-lived, opaque streaming
// handle. The token travels in an Authorization header, never in a URL.
//
// POST /api/reels/session
//   Authorization: Bearer <token>   (or omitted for guests with a guest_id)
//   body: { reel_id, moduleId, zoneid, lang, lat, lng, guest_id }

import { createReelStreamSession } from "../../../src/helper-functions/reelStreamSessions";

export const config = {
  api: {
    bodyParser: { sizeLimit: "4kb" },
  },
};

const clean = (value, max = 128) =>
  typeof value === "string" ? value.slice(0, max) : null;

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const body = req.body || {};
  const reelId = Number(body.reel_id);
  if (!Number.isInteger(reelId) || reelId <= 0) {
    return res.status(400).json({ error: "invalid reel_id" });
  }

  const auth = req.headers.authorization;
  const hasToken = typeof auth === "string" && /^Bearer\s+\S+$/i.test(auth.trim());
  const guestId = clean(body.guest_id, 64);
  if (!hasToken && !guestId) {
    return res.status(401).json({ error: "authorization required" });
  }

  const { id, expiresIn } = createReelStreamSession({
    reelId,
    token: hasToken ? auth.trim().replace(/^Bearer\s+/i, "") : null,
    moduleId: clean(body.moduleId, 64),
    zoneid: clean(body.zoneid, 256),
    lang: clean(body.lang, 32),
    lat: body.lat,
    lng: body.lng,
    guestId,
  });

  // The handle is only a capability for one reel; keep it out of caches.
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ sid: id, expires_in: expiresIn });
}
