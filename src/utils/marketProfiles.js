/**
 * Country-aware market profiles.
 *
 * This mirrors config/market_profiles.php on the backend. One profile per
 * country drives currency, locale, phone, address, ID and payment rules in the
 * UI. A country without a profile is unsupported: callers must show an explicit
 * "coming soon" state and never silently fall back to Ghana.
 */

export const DEFAULT_COUNTRY = "GH";

export const CURRENCY_NAMES = {
  GHS: "Ghanaian Cedi",
  NGN: "Nigerian Naira",
  XOF: "West African CFA Franc",
  KES: "Kenyan Shilling",
  ZAR: "South African Rand",
  USD: "US Dollar",
};

export const MARKET_PROFILES = {
  GH: {
    country_code: "GH",
    name: "Ghana",
    locale: "en-GH",
    currency_code: "GHS",
    currency_symbol: "GH₵",
    decimal_places: 2,
    phone: {
      dial_code: "+233",
      example: "0241234567",
      pattern: /^(?:\+?233|0)?[2-5][0-9]{8}$/,
    },
    address: {
      region_label: "Region",
      district_label: "District / MMDA",
      city_label: "Town / City",
      postal_code_label: "Postal code (optional)",
      location_dataset: "ghana",
    },
    identity: {
      label: "Ghana Card",
      last4_label: "Ghana Card last 4 characters",
      hint: "Only the last 4 characters are stored. Never share your full card number here.",
      verification_available: true,
    },
    payments: {
      gateways: ["hubtel", "paystack", "flutterwave"],
      presentment_currencies: ["GHS"],
    },
    payouts: {
      currency_code: "GHS",
      networks: ["MTN", "Vodafone", "AirtelTigo"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "233", locale: "en-GH" },
    aliases: ["GHANA", "GH"],
  },
  NG: {
    country_code: "NG",
    name: "Nigeria",
    locale: "en-NG",
    currency_code: "NGN",
    currency_symbol: "₦",
    decimal_places: 2,
    phone: {
      dial_code: "+234",
      example: "08031234567",
      pattern: /^(?:\+?234|0)?[789][01][0-9]{8}$/,
    },
    address: {
      region_label: "State",
      district_label: "Local Government Area",
      city_label: "City / Town",
      postal_code_label: "Postal code (optional)",
      location_dataset: "manual",
    },
    identity: {
      label: "Nigerian National ID (NIN)",
      last4_label: "National ID last 4 characters",
      hint: "Use the last 4 characters of your NIN, driver licence or voter card reference. Only these 4 characters are stored.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack", "flutterwave"],
      presentment_currencies: ["NGN"],
    },
    payouts: {
      currency_code: "NGN",
      networks: ["MTN", "Airtel", "Glo", "9mobile"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "234", locale: "en-NG" },
    aliases: ["NIGERIA", "NG"],
  },
  TG: {
    country_code: "TG",
    name: "Togo",
    locale: "fr-TG",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+228",
      example: "90123456",
      pattern: /^(?:\+?228)?[279][0-9]{7}$/,
    },
    address: {
      region_label: "Région",
      district_label: "Préfecture",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CIN)",
      last4_label: "CIN : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["MTN MoMo", "Moov Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "228", locale: "fr-TG" },
    aliases: ["TOGO", "TG"],
  },
  CI: {
    country_code: "CI",
    name: "Côte d'Ivoire",
    locale: "fr-CI",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+225",
      example: "0123456789",
      pattern: /^(?:\+?225)?[0-9]{10}$/,
    },
    address: {
      region_label: "District",
      district_label: "Région",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CNI)",
      last4_label: "CNI : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["MTN MoMo", "Moov Money", "Orange Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "225", locale: "fr-CI" },
    aliases: ["CÔTE D'IVOIRE", "COTE D'IVOIRE", "IVORY COAST", "CI"],
  },
  BF: {
    country_code: "BF",
    name: "Burkina Faso",
    locale: "fr-BF",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+226",
      example: "70123456",
      pattern: /^(?:\+?226)?[567][0-9]{7}$/,
    },
    address: {
      region_label: "Région",
      district_label: "Province",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CNI)",
      last4_label: "CNI : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["MTN MoMo", "Moov Money", "Orange Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "226", locale: "fr-BF" },
    aliases: ["BURKINA FASO", "BF"],
  },
  SN: {
    country_code: "SN",
    name: "Senegal",
    locale: "fr-SN",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+221",
      example: "771234567",
      pattern: /^(?:\+?221)?[367][0-9]{8}$/,
    },
    address: {
      region_label: "Région",
      district_label: "Département",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CNI)",
      last4_label: "CNI : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["Orange Money", "Wave", "Free Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "221", locale: "fr-SN" },
    aliases: ["SENEGAL", "SN"],
  },
  BJ: {
    country_code: "BJ",
    name: "Benin",
    locale: "fr-BJ",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+229",
      example: "97123456",
      pattern: /^(?:\+?229)?[0-9]{8}$/,
    },
    address: {
      region_label: "Département",
      district_label: "Commune",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CNI)",
      last4_label: "CNI : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["MTN MoMo", "Moov Money", "Orange Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "229", locale: "fr-BJ" },
    aliases: ["BENIN", "BJ"],
  },
  ML: {
    country_code: "ML",
    name: "Mali",
    locale: "fr-ML",
    currency_code: "XOF",
    currency_symbol: "CFA",
    decimal_places: 0,
    phone: {
      dial_code: "+223",
      example: "70123456",
      pattern: /^(?:\+?223)?[5679][0-9]{7}$/,
    },
    address: {
      region_label: "Région",
      district_label: "Cercle",
      city_label: "Ville",
      postal_code_label: "Code postal (facultatif)",
      location_dataset: "manual",
    },
    identity: {
      label: "Carte nationale d’identité (CNI)",
      last4_label: "CNI : 4 derniers caractères",
      hint: "Seuls ces 4 caractères sont enregistrés. Ne saisissez jamais votre numéro complet.",
      verification_available: true,
    },
    payments: {
      gateways: ["paystack"],
      presentment_currencies: ["XOF"],
    },
    payouts: {
      currency_code: "XOF",
      networks: ["Orange Money", "Moov Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "223", locale: "fr-ML" },
    aliases: ["MALI", "ML"],
  },
  KE: {
    country_code: "KE",
    name: "Kenya",
    locale: "sw-KE",
    currency_code: "KES",
    currency_symbol: "Ksh",
    decimal_places: 2,
    phone: {
      dial_code: "+254",
      example: "0712345678",
      pattern: /^(?:\+?254|0)?[17][0-9]{8}$/,
    },
    address: {
      region_label: "County",
      district_label: "Sub-county",
      city_label: "Town / City",
      postal_code_label: "Postal code (optional)",
      location_dataset: "manual",
    },
    identity: {
      label: "National ID card",
      last4_label: "National ID last 4 characters",
      hint: "Only the last 4 characters are stored. Never share your full ID number here.",
      verification_available: false,
    },
    payments: {
      gateways: ["paystack", "flutterwave"],
      presentment_currencies: ["KES"],
    },
    payouts: {
      currency_code: "KES",
      networks: ["M-Pesa", "Airtel Money"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "254", locale: "sw-KE" },
    aliases: ["KENYA", "KE"],
  },
  ZA: {
    country_code: "ZA",
    name: "South Africa",
    locale: "en-ZA",
    currency_code: "ZAR",
    currency_symbol: "R",
    decimal_places: 2,
    phone: {
      dial_code: "+27",
      example: "0712345678",
      pattern: /^(?:\+?27|0)?[6-8][0-9]{8}$/,
    },
    address: {
      region_label: "Province",
      district_label: "Municipality",
      city_label: "City / Town",
      postal_code_label: "Postal code (required)",
      location_dataset: "manual",
    },
    identity: {
      label: "South African ID",
      last4_label: "ID last 4 characters",
      hint: "Only the last 4 characters are stored. Never share your full ID number here.",
      verification_available: false,
    },
    payments: {
      gateways: ["paystack", "flutterwave", "payfast"],
      presentment_currencies: ["ZAR"],
    },
    payouts: {
      currency_code: "ZAR",
      networks: ["bank_transfer"],
    },
    units: { weight: "kg", volume: "litre" },
    support: { whatsapp_dial_code: "27", locale: "en-ZA" },
    aliases: ["SOUTH AFRICA", "ZA"],
  },
};

/** Normalize a country name or ISO code to its ISO code. Returns null when unsupported. */
export const normalizeCountry = (value) => {
  if (!value) return null;
  const needle = String(value).trim().toUpperCase();
  if (!needle) return null;
  if (MARKET_PROFILES[needle]) return needle;

  for (const [code, profile] of Object.entries(MARKET_PROFILES)) {
    const aliases = [profile.name, code, ...(profile.aliases || [])];
    if (aliases.some((alias) => String(alias).toUpperCase() === needle)) {
      return code;
    }
  }
  return null;
};

/** Return a profile (with country_code) for a name/code, or null when unsupported. */
export const getMarketProfile = (value, fallback = null) => {
  const code = normalizeCountry(value);
  return code ? MARKET_PROFILES[code] : fallback;
};

/** Returns true when the value maps to a supported market. */
export const isSupportedCountry = (value) => Boolean(normalizeCountry(value));

/** Options shape for country <Select> fields, name-sorted, pilot markets first. */
const PRIORITY = ["GH", "NG", "TG"];
export const getCountryOptions = () =>
  Object.values(MARKET_PROFILES)
    .map((profile) => ({
      label: profile.name,
      value: profile.country_code,
      dial_code: profile.phone.dial_code,
      currency_code: profile.currency_code,
    }))
    .sort((a, b) => {
      const ai = PRIORITY.indexOf(a.value);
      const bi = PRIORITY.indexOf(b.value);
      if (ai !== -1 || bi !== -1) {
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      }
      return a.label.localeCompare(b.label);
    });

/** Presentment currency selector options for a country. Never arbitrary. */
export const getCurrencyOptions = (country, fallbackCountry = DEFAULT_COUNTRY) => {
  const profile = getMarketProfile(country) || getMarketProfile(fallbackCountry);
  if (!profile) return [];
  return profile.payments.presentment_currencies.map((code) => ({
    code,
    symbol: MARKET_PROFILES[code]?.currency_symbol || profile.currency_symbol,
    name: CURRENCY_NAMES[code] || code,
  }));
};

/** Format an amount using the market's symbol and decimal places. */
export const formatMarketCurrency = (amount, country, options = {}) => {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  const profile = getMarketProfile(country) || getMarketProfile(DEFAULT_COUNTRY);
  if (!profile) return String(amount);
  const decimals = options.decimals ?? profile.decimal_places;
  const value = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const withCode = options.showCode ? `${value} ${profile.currency_code}` : value;
  return options.position === "right"
    ? `${withCode} ${profile.currency_symbol}`
    : `${profile.currency_symbol}${withCode}`;
};

const COUNTRY_STORAGE_KEY = "country";

/** Read the stored market country from localStorage (SSR-safe). */
export const getStoredCountry = () => {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  try {
    const raw = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return normalizeCountry(parsed) || DEFAULT_COUNTRY;
  } catch (error) {
    return DEFAULT_COUNTRY;
  }
};

/** Persist the chosen market country as an ISO code. */
export const setStoredCountry = (country) => {
  if (typeof window === "undefined") return;
  const code = normalizeCountry(country);
  if (!code) return;
  window.localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(code));
};

export default MARKET_PROFILES;
