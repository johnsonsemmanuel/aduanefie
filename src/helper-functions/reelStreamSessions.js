// Server-only store for short-lived reel streaming handles.
//
// A <video> element cannot send an Authorization header, so the previous
// implementation put the long-lived Bearer token in the stream URL query
// string where it was recorded by access logs, proxies and monitoring. The
// browser now exchanges the token for an opaque random handle over a header;
// only the handle appears in the media URL, and it grants access to one reel
// for a few minutes only. It is not usable against any other API.
//
// This module is imported exclusively by pages/api/reels/* routes.

import { randomBytes, randomUUID } from "crypto";

const TTL_MS = 10 * 60 * 1000;
const MAX_SESSIONS = 2000;

/** @type {Map<string, {reelId:number, token:?string, moduleId:*, zoneid:*, lang:*, lat:*, lng:*, guestId:?string, expiresAt:number}>} */
const sessions = new Map();

const prune = () => {
  const now = Date.now();
  for (const [id, entry] of sessions) {
    if (entry.expiresAt <= now) sessions.delete(id);
  }
};

const newHandle = () => {
  if (typeof randomUUID === "function") return randomUUID();
  return randomBytes(24).toString("hex");
};

export const createReelStreamSession = (data) => {
  prune();
  if (sessions.size >= MAX_SESSIONS) {
    const oldest = sessions.keys().next().value;
    if (oldest !== undefined) sessions.delete(oldest);
  }

  const id = newHandle();
  sessions.set(id, {
    reelId: data.reelId,
    token: data.token || null,
    moduleId: data.moduleId || null,
    zoneid: data.zoneid || null,
    lang: data.lang || null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    guestId: data.guestId || null,
    expiresAt: Date.now() + TTL_MS,
  });

  return { id, expiresIn: Math.floor(TTL_MS / 1000) };
};

export const getReelStreamSession = (id) => {
  if (typeof id !== "string" || id.length > 128) return null;
  const entry = sessions.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }
  return entry;
};
