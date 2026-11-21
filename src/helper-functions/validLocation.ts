export type ValidLocation = {
  lat: number;
  lng: number;
};

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const isValidLocation = (value: unknown): value is ValidLocation => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  const lat = toFiniteNumber(candidate.lat);
  const lng = toFiniteNumber(candidate.lng);

  if (lat === null || lng === null) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;

  // 0,0 is the old "no location" placeholder. It is not a delivery location
  // for any supported market, so reject it instead of presenting fake nearby
  // results centred on the Gulf of Guinea.
  if (lat === 0 && lng === 0) return false;

  return true;
};

export const readCurrentLocation = (
  raw: string | null | undefined,
): ValidLocation | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isValidLocation(parsed)
      ? { lat: Number(parsed.lat), lng: Number(parsed.lng) }
      : null;
  } catch {
    return null;
  }
};
