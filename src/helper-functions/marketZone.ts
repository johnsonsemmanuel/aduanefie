import { store } from "redux/store";
import { normalizeCountry } from "utils/marketProfiles";

const parseStoredValue = (raw: string | null | undefined): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const toCountryCode = (value: unknown): string | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  return normalizeCountry(String(value));
};

/** Resolve the active market from the selector cache, then backend config. */
export const getActiveCountry = (): string | null => {
  const storedCountry =
    typeof window !== "undefined"
      ? toCountryCode(parseStoredValue(localStorage.getItem("country")))
      : null;
  if (storedCountry) return storedCountry;

  const configState: any = store?.getState?.()?.configData ?? {};
  return (
    toCountryCode(configState.countryCode) ??
    toCountryCode(configState.configData?.country) ??
    null
  );
};

/** Drop zone and coordinates that belonged to a previously selected market. */
export const clearStoredZoneAndLocation = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("zoneid");
  localStorage.removeItem("currentLatLng");
  localStorage.removeItem("location");
};

/**
 * Call before overwriting the stored country. A market change invalidates any
 * zone or coordinate selected under the previous market.
 */
export const clearStoredZoneAndLocationOnCountryChange = (
  nextCountry: unknown,
): void => {
  if (typeof window === "undefined") return;

  const previousCountry = toCountryCode(
    parseStoredValue(localStorage.getItem("country")),
  );
  const nextCode = toCountryCode(nextCountry);

  if (previousCountry && nextCode && previousCountry !== nextCode) {
    clearStoredZoneAndLocation();
  }
};
