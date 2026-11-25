/**
 * Authoritative feature flag reader backed by backend `BusinessSetting`
 * (`configData.feature_flags` from `/api/v1/config`).
 */

export const isFeatureVisible = (configData, featureKey, fallback = true) => {
  if (!featureKey) return true;
  const entry = configData?.feature_flags?.[featureKey];
  if (!entry || typeof entry !== "object") return fallback;
  if (typeof entry.public_visible === "boolean") return entry.public_visible;
  return fallback;
};

export const isFeatureTransactionEnabled = (
  configData,
  featureKey,
  fallback = false
) => {
  if (!featureKey) return fallback;
  const entry = configData?.feature_flags?.[featureKey];
  if (!entry || typeof entry !== "object") return fallback;
  if (typeof entry.allow_new_transactions === "boolean") {
    return entry.allow_new_transactions;
  }
  return fallback;
};

export const isBackgroundQueryEnabled = (
  configData,
  featureKey,
  envFallback = false
) => {
  const entry = configData?.feature_flags?.[featureKey];
  if (entry && typeof entry === "object" && typeof entry.allow_background_queries === "boolean") {
    return entry.allow_background_queries;
  }
  return envFallback;
};
