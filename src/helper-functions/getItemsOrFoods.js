import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

export const getItemsOrFoods = () => {
  const moduleType = getCurrentModuleType();

  if (moduleType === "rental") {
    return t("Vehicles");
  } else {
    return t("items");
  }
};
