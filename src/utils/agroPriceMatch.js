const SYNONYMS = [
  ["maize", "corn"],
  ["yam", "pona", "puna"],
  ["tomato", "tomatoes"],
  ["rice", "local rice"],
  ["cassava", "tapioca"],
  ["cowpea", "beans", "black-eyed"],
  ["groundnut", "peanut"],
  ["soya", "soybean", "soybeans"],
  ["plantain", "apantu"],
  ["pepper", "chili"],
  ["onion", "shallot"],
];

const expandKeywords = (text) => {
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !["bag", "kg", "fresh", "grade", "local", "white", "red", "yellow", "dry", "raw", "pack"].includes(w));

  const expanded = new Set(words);
  for (const w of words) {
    for (const group of SYNONYMS) {
      if (group.some((g) => w.includes(g) || g.includes(w))) {
        group.forEach((g) => expanded.add(g));
      }
    }
  }
  return Array.from(expanded);
};

export const findMatchingAgroPrice = (nameOrItem, prices) => {
  if (!Array.isArray(prices) || prices.length === 0) return null;
  const rawName = typeof nameOrItem === "string" ? nameOrItem : nameOrItem?.name || "";
  if (!rawName.trim()) return null;

  const keywords = expandKeywords(rawName);
  if (keywords.length === 0) return null;

  let best = null;
  let bestScore = 0;

  for (const row of prices) {
    const target = `${row?.commodity || ""} ${row?.category || ""}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (target.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = row;
    }
  }

  return bestScore > 0 ? best : null;
};

export const formatCedi = (amount) => {
  const n = Number(amount || 0);
  return `₵${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
