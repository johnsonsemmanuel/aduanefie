import ghanaFlag from "./assets/ghana.svg";
import nigeriaFlag from "./assets/nigeria.svg";
import togoFlag from "./assets/togo.svg";
import ivoryCoastFlag from "./assets/ivory-coast.svg";

/**
 * Language + market pairs for the selector.
 *
 * `languageCode` is the base locale used by i18next and the backend
 * X-localization header (en, fr). `countryCode` is the ISO market that drives
 * currency, phone, address and payment rules. Keeping them separate means a
 * locale switch never sends an invalid locale such as "fr-TG" to the API.
 */
export const languageList = [
  {
    languageName: "English (Ghana)",
    languageCode: "en",
    countryCode: "GH",
    countryFlag: ghanaFlag.src,
  },
  {
    languageName: "English (Nigeria)",
    languageCode: "en",
    countryCode: "NG",
    countryFlag: nigeriaFlag.src,
  },
  {
    languageName: "Français (Togo)",
    languageCode: "fr",
    countryCode: "TG",
    countryFlag: togoFlag.src,
  },
  {
    languageName: "Français (Côte d'Ivoire)",
    languageCode: "fr",
    countryCode: "CI",
    countryFlag: ivoryCoastFlag.src,
  },
];
