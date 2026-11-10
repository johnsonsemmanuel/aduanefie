// Static copy of the four regional trade blocs seeded by
// soft/database/seeders/TradeBlocSeeder.php. It is used only as a fallback so
// the /trade pages stay useful until the trade API is deployed; when the live
// endpoints answer, their data replaces this list.

export const WHOLESALE_MODULE_ID = 2;

export const FALLBACK_TRADE_BLOCS = [
  {
    id: "ecowas",
    slug: "ecowas",
    name: "Economic Community of West African States (ECOWAS)",
    shortName: "ECOWAS",
    description:
      "West African trade bloc promoting economic integration among 15 member states.",
    member_countries: [
      "Benin",
      "Burkina Faso",
      "Côte d'Ivoire",
      "Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Mali",
      "Niger",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo",
      "Cape Verde",
    ],
    primary_currencies: [
      "XOF",
      "XAF",
      "GHS",
      "NGN",
      "GMD",
      "GNF",
      "LRD",
      "MWK",
      "SLL",
      "CVE",
    ],
    website: "https://ecowas.int",
    status: "active",
  },
  {
    id: "sadc",
    slug: "sadc",
    name: "Southern African Development Community (SADC)",
    shortName: "SADC",
    description:
      "Southern African trade bloc promoting economic development and integration.",
    member_countries: [
      "Angola",
      "Botswana",
      "Comoros",
      "DRC",
      "Eswatini",
      "Lesotho",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Namibia",
      "Seychelles",
      "South Africa",
      "Tanzania",
      "Zambia",
      "Zimbabwe",
    ],
    primary_currencies: [
      "ZAR",
      "BWP",
      "MZN",
      "ZMW",
      "MWK",
      "NAD",
      "LSL",
      "SZL",
      "MUR",
      "SCR",
    ],
    website: "https://www.sadc.int",
    status: "active",
  },
  {
    id: "eac",
    slug: "eac",
    name: "East African Community (EAC)",
    shortName: "EAC",
    description:
      "East African trade bloc promoting economic integration among 8 partner states.",
    member_countries: [
      "Burundi",
      "DRC",
      "Kenya",
      "Rwanda",
      "South Sudan",
      "Tanzania",
      "Uganda",
    ],
    primary_currencies: ["KES", "UGX", "TZS", "RWF", "BIF", "SSP", "CDF"],
    website: "https://www.eac.int",
    status: "active",
  },
  {
    id: "comesa",
    slug: "comesa",
    name: "Common Market for Eastern and Southern Africa (COMESA)",
    shortName: "COMESA",
    description:
      "African trade bloc promoting economic integration among 21 member states.",
    member_countries: [
      "Burundi",
      "Comoros",
      "DRC",
      "Djibouti",
      "Egypt",
      "Eritrea",
      "Eswatini",
      "Ethiopia",
      "Kenya",
      "Libya",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "Sudan",
      "Tunisia",
      "Uganda",
      "Zambia",
      "Zimbabwe",
    ],
    primary_currencies: [
      "KES",
      "UGX",
      "TZS",
      "ETB",
      "RWF",
      "BIF",
      "SSP",
      "EGP",
      "SDG",
      "MWK",
      "MZN",
      "ZMW",
      "ZWL",
      "MUR",
      "SCR",
    ],
    website: "https://www.comesa.int",
    status: "active",
  },
];

// The API sometimes serialises JSON columns as strings (the Laravel model has
// no array cast for them), so accept both shapes.
export const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || value.length === 0) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const findFallbackBloc = (slug) =>
  FALLBACK_TRADE_BLOCS.find((bloc) => bloc.slug === slug) ?? null;

export const getWholesaleMarketHref = () =>
  `/home?module=${WHOLESALE_MODULE_ID}`;
