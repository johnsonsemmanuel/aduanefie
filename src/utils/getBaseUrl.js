export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (!raw) return "";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}
