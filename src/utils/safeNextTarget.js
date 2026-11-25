// Shared by the Edge gate and browser unlock flow. Backslashes are URL host
// separators too; a startsWith('/') check alone permits external redirects.
export const safeNextTarget = (value) => {
  if (typeof value !== "string" || !value.startsWith("/") ||
      value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/";
  try {
    const base = "https://aduanefie.com";
    const target = new URL(value, base);
    if (target.origin !== base || target.pathname === "/coming-soon") return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
};
