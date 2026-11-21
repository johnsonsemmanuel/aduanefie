// Shared pick lists for cross-border and group-buy forms.
//
// These fields used to be free-text inputs: on mobile every tap raised the
// keyboard even though the accepted values are a small known set. Keep the
// values in one place so the RFQ form, group filter and group creator agree.

export const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "50 kg bag", label: "50 kg bag" },
  { value: "100 kg bag", label: "100 kg bag" },
  { value: "crate", label: "Crate" },
  { value: "metric ton", label: "Metric ton (MT)" },
];

export const TRADE_COUNTRIES = [
  { code: "GH", name: "Ghana" },
  { code: "NG", name: "Nigeria" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "SN", name: "Senegal" },
  { code: "TG", name: "Togo" },
  { code: "BJ", name: "Benin" },
  { code: "BF", name: "Burkina Faso" },
  { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" },
  { code: "GM", name: "The Gambia" },
  { code: "GN", name: "Guinea" },
  { code: "SL", name: "Sierra Leone" },
  { code: "LR", name: "Liberia" },
  { code: "MA", name: "Morocco" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "ZA", name: "South Africa" },
];

export const DESTINATION_COUNTRY_CODES = TRADE_COUNTRIES.map((country) => country.code);
