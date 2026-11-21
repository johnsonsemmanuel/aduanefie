export const safeJsonParse = (raw, fallback = null) => {
  if (raw === null || raw === undefined || raw === "" || raw === "undefined" || raw === "null") {
    return fallback;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};
