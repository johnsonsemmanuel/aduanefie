const STORAGE_KEY = "aduanefie_recently_viewed_v1";
const MAX_ITEMS = 8;

export const recordRecentlyViewed = (item) => {
  if (typeof window === "undefined" || !item?.id) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const prev = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(prev) ? prev : [];
    const entry = {
      id: item.id,
      slug: item.slug || item.id,
      name: item.name || "",
      price: item.price ?? 0,
      image: item.image_full_url || item.image || "",
      store_name: item.store_name || item.store?.name || "",
      module_id: item.module_id || null,
      viewedAt: Date.now(),
    };
    const next = [entry, ...list.filter((x) => x && x.id !== item.id)].slice(
      0,
      MAX_ITEMS
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota / private-mode errors
  }
};

export const getRecentlyViewed = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => x && x.id && x.name) : [];
  } catch {
    return [];
  }
};
