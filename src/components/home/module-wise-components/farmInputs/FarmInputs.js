import { t } from "i18next";
import { Stack } from "@mui/material";
import React from "react";
import CustomContainer from "../../../container";
import ModuleSearchBanner from "../shared/ModuleSearchBanner";
import FeaturedCategories from "../../featured-categories";
import PopularItemsNearby from "../../popular-items-nearby";
import Stores from "../../stores";

const FarmInputs = () => {
  const zoneid =
    typeof window !== "undefined"
      ? localStorage.getItem("zoneid")
      : undefined;

  return (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <ModuleSearchBanner
        zoneid={zoneid}
        title={t("Farm Inputs")}
        subtitle={t(
          "Seeds, fertilizers, tools and equipment for every season."
        )}
      />

      <CustomContainer noMobilePadding>
        <FeaturedCategories title={t("Farm Input Categories")} />
      </CustomContainer>

      <CustomContainer>
        <PopularItemsNearby
          title={t("Popular Farm Inputs")}
          subTitle={t("Top-selling products in your area")}
        />
      </CustomContainer>

      <CustomContainer>
        <Stores title={t("Explore Stores")} />
      </CustomContainer>
    </Stack>
  );
};

export default FarmInputs;
