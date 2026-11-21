export const GHANA_UNIT_GUIDE = [
  { label: "Olonka", approx: "~2.3 kg (grains/gari)" },
  { label: "Mini Bag", approx: "50 kg" },
  { label: "Maxi Bag", approx: "100 kg" },
  { label: "Tomato Crate", approx: "~52 kg (full wooden box)" },
  { label: "Paint Bucket", approx: "~4–5 kg" },
];

export const inferWeightKg = (item) => {
  const explicit = Number(item?.unit_weight_kg || 0);
  if (explicit > 0) return explicit;

  const rawUnit = `${item?.agro_unit || ""} ${item?.unit_type || ""} ${item?.name || ""}`.toLowerCase();
  const kgMatch = rawUnit.match(/(\d+(?:\.\d+)?)\s*kg\b/);
  if (kgMatch) {
    const parsed = Number(kgMatch[1]);
    if (parsed > 0) return parsed;
  }
  if (/bag_100kg|maxi\s*bag|100\s*kg/.test(rawUnit)) return 100;
  if (/bag_50kg|mini\s*bag|50\s*kg/.test(rawUnit)) return 50;
  if (/olonka/.test(rawUnit)) return 2.3;
  if (/metric\s*ton|\b1\s*ton\b/.test(rawUnit)) return 1000;
  return 0;
};

export const computePricePerKg = (item, unitPrice) => {
  const price = Number(unitPrice || item?.price || 0);
  const weightKg = inferWeightKg(item);
  if (price <= 0 || weightKg <= 0) return null;
  // Don't show redundant per-kg if the unit is already 1 kg
  if (Math.abs(weightKg - 1) < 0.01) return null;
  return {
    weightKg,
    pricePerKg: price / weightKg,
  };
};

export const getPostHarvestTip = (item) => {
  const text = `${item?.name || ""} ${item?.category_name || ""} ${item?.description || ""}`.toLowerCase();

  if (/yam|cassava|cocoyam|sweet\s*potato|ginger|turmeric/.test(text)) {
    return {
      storageTip: "Store in a cool, dry, well-ventilated shaded spot — avoid damp floors or sealed plastic bags.",
      shelfLifeNote: "Tubers keep best 7–21 days unwashed in dry shade (peeled cassava: freeze or use within 48h).",
    };
  }
  if (/tomato|pepper|garden\s*egg|okro|okra|onion|shallot/.test(text)) {
    return {
      storageTip: "Keep ripe tomatoes & peppers cool and airy; refrigerate only after full ripening to preserve flavour.",
      shelfLifeNote: "Best enjoyed within 3–6 days of harvest for peak firmness.",
    };
  }
  if (/kontomire|spinach|lettuce|ayoyo|gboma|cabbage|leaf|greens|herb/.test(text)) {
    return {
      storageTip: "Wrap loosely in a slightly damp cloth or breathable bag and refrigerate immediately.",
      shelfLifeNote: "Highly perishable leafy greens — best used within 2–3 days.",
    };
  }
  if (/plantain|banana|pawpaw|mango|pineapple|avocado|pear|orange|watermelon/.test(text)) {
    return {
      storageTip: "Ripen at room temperature away from direct sun; move to fridge only once fully ripe.",
      shelfLifeNote: "Unripe bunches hold 4–7 days; ripe fruit best within 2–3 days.",
    };
  }
  if (/maize|corn|rice|millet|sorghum|bean|cowpea|soy|groundnut|gari|flour|cocoa|cashew|shea/.test(text)) {
    return {
      storageTip: "Keep dry in airtight or PICS hermetic bags off the floor (target moisture ≤ 13% for grains).",
      shelfLifeNote: "Dry staples store cleanly for 3–6+ months when kept dry and pest-free.",
    };
  }
  if (/tilapia|catfish|fish|chicken|poultry|egg|beef|goat|mutton|pork|meat|snail/.test(text)) {
    return {
      storageTip: "Refrigerate or freeze immediately on delivery; keep fresh eggs pointed-end down in a cool tray.",
      shelfLifeNote: "Chilled protein: use within 24–48h or freeze promptly.",
    };
  }
  return {
    storageTip: "Unpack promptly on delivery and store in a cool, clean, ventilated place (or refrigerate if chilled).",
    shelfLifeNote: "Inspect fresh produce on delivery — report any transit damage with a photo within 6 hours.",
  };
};

export const getGhanaSeasonalGuide = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 7) {
    return {
      seasonName: "Major Rainy Season",
      monthsLabel: "Mar – Jul",
      peakCrops: ["Plantain", "Garden Eggs", "Okro", "Kontomire", "Pineapple", "Fresh Maize"],
      plantingNow: "Maize, rice, cassava, yam sets, and cowpea across forest & transition belts.",
      harvestSoon: "New Pona Yam & Major-season Maize arriving July–August.",
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      seasonName: "Minor Rainy Season",
      monthsLabel: "Sep – Nov",
      peakCrops: ["New Yam", "Local Rice", "White Maize", "Groundnuts", "Plantain", "Cassava"],
      plantingNow: "Minor-season vegetables, cowpea, and fast-maturing maize in southern & middle belts.",
      harvestSoon: "Irrigated dry-season tomatoes, onions & shallots from Dec onward.",
    };
  }
  return {
    seasonName: "Dry / Irrigated Season",
    monthsLabel: "Dec – Feb",
    peakCrops: ["Irrigated Tomatoes", "Onions", "Shallots", "Dried Maize", "Local Rice", "Yam"],
    plantingNow: "Irrigated valley vegetables (tomatoes, peppers, leafy greens) & land prep for Major Season.",
    harvestSoon: "Early irrigated vegetables & stored northern grains.",
  };
};
