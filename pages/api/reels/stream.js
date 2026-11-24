// Proxy endpoint that adds auth headers to the reel stream request.
// This allows the browser's <video> element to make Range requests natively,
// enabling true progressive playback without MSE/blob complexity.
//
// Usage: /api/reels/stream?reel_id=123&sid=OPAQUE_HANDLE
//
// `sid` is a short-lived, single-reel handle obtained from POST
// /api/reels/session (where the Bearer token is supplied in a header). The
// token itself is never placed in a URL, where access logs would record it.

import { getReelStreamSession } from "../../../src/helper-functions/reelStreamSessions";

export const config = {
  api: {
    // Remove the 4 MB response limit so large videos stream through
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  const { reel_id, sid } = req.query;

  const reelId = Number(reel_id);
  if (!Number.isInteger(reelId) || reelId <= 0) {
    return res.status(400).json({ error: "reel_id required" });
  }

  const session = getReelStreamSession(sid);
  if (!session) {
    return res.status(401).json({ error: "stream session expired" });
  }
  if (session.reelId !== reelId) {
    return res.status(403).json({ error: "session reel mismatch" });
  }

  const baseUrl = ((process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "") || "").replace(/\/$/, "");
  const guestParam = session.guestId
    ? `&guest_id=${encodeURIComponent(session.guestId)}`
    : "";
  const upstreamUrl = `${baseUrl}/api/v1/customer/reels/details?reel_id=${reelId}&stream=1${guestParam}`;

  const upstreamHeaders = {
    Accept: "video/*,*/*",
    "X-software-id": "33571750",
  };

  // Values come from the server-side session, not from client query params.
  if (session.token) upstreamHeaders["Authorization"] = `Bearer ${session.token}`;
  if (session.moduleId) upstreamHeaders["moduleId"] = session.moduleId;
  if (session.zoneid) upstreamHeaders["zoneid"] = session.zoneid;
  if (session.lang) upstreamHeaders["X-localization"] = session.lang;
  if (session.lat !== null && session.lat !== undefined) upstreamHeaders["latitude"] = session.lat;
  if (session.lng !== null && session.lng !== undefined) upstreamHeaders["longitude"] = session.lng;

  // Every upstream request carries a Range header: forward the browser's own
  // Range if present (for seeks/partial reads), otherwise default to the full
  // file as a single 206 (`bytes=0-`). Server returns 206 Partial Content.
  upstreamHeaders["Range"] = req.headers["range"] || "bytes=0-";

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, { headers: upstreamHeaders });
  } catch (err) {
    return res.status(502).json({ error: "upstream fetch failed" });
  }

  // Forward status (200 or 206 Partial Content)
  res.status(upstream.status);

  // Forward relevant response headers
  const forward = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
  ];
  forward.forEach((h) => {
    const val = upstream.headers.get(h);
    if (val) res.setHeader(h, val);
  });

  // Tell the browser it may cache this in memory but not on disk
  res.setHeader("Cache-Control", "private, no-store");

  // Pipe the upstream body to the response
  if (!upstream.body) return res.end();

  const reader = upstream.body.getReader();
  const pump = () => {
    reader
      .read()
      .then(({ value, done }) => {
        if (done) return res.end();
        res.write(Buffer.from(value));
        pump();
      })
      .catch(() => res.end());
  };
  pump();
}
