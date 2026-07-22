import React from "react";
import { alpha, Grid, useTheme } from "@mui/material";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import { useTranslation } from "react-i18next";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AgricultureIcon from "@mui/icons-material/Agriculture";

const STORE_TYPE_OPTIONS = [
  { label: "Regular Store", value: "default" },
  { label: "Farm / Micro-Farm", value: "farm" },
];

const StoreTypeSelector = ({ formik, handleFieldChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <CustomSelectWithFormik
        labelColor={alpha(theme.palette.neutral[1000], 0.8)}
        selectFieldData={STORE_TYPE_OPTIONS}
        inputLabel={t("Store Type")}
        passSelectedValue={(value) => handleFieldChange("store_type", value)}
        touched={formik.touched.store_type}
        errors={formik.errors.store_type}
        fieldProps={formik.getFieldProps("store_type")}
        placeholder={t("Select Store Type")}
        required
        startIcon={
          <StorefrontIcon
            sx={{
              color: alpha(theme.palette.neutral[400], 0.7),
              fontSize: "18px",
            }}
          />
        }
      />
    </Grid>
  );
};

export default StoreTypeSelector;
