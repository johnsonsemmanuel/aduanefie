import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import ghanaLocations from "data/ghanaLocations.json";

const GhanaRegionDistrictFields = ({
  formik,
  onFieldChange,
  gridProps = { xs: 12, sm: 6, md: 4 },
}) => {
  const { t } = useTranslation();

  const regionValue = formik?.values?.region || "";
  const districtValue = formik?.values?.district || "";

  const regionOptions = useMemo(
    () =>
      ghanaLocations.map((r) => ({
        label: r.name,
        value: r.name,
      })),
    []
  );

  const selectedRegionObj = useMemo(
    () =>
      ghanaLocations.find(
        (r) => r.name.toLowerCase() === regionValue.toLowerCase()
      ) || null,
    [regionValue]
  );

  const districtOptions = useMemo(
    () =>
      (selectedRegionObj?.districts || []).map((d) => ({
        label: d,
        value: d,
      })),
    [selectedRegionObj]
  );

  const townOptions = useMemo(
    () =>
      (selectedRegionObj?.towns || []).map((town) => ({
        label: town,
        value: town,
      })),
    [selectedRegionObj]
  );

  const setField = (name, val) => {
    if (onFieldChange) {
      onFieldChange(name, val);
    } else {
      formik?.setFieldValue(name, val);
    }
  };

  return (
    <>
      <Grid item {...gridProps}>
        <CustomSelectWithFormik
          selectFieldData={regionOptions}
          inputLabel={t("Region (Ghana)")}
          placeholder={t("Select Region")}
          passSelectedValue={(value) => {
            setField("region", value);
            if (value !== regionValue) {
              setField("district", "");
              setField("sub_district", "");
            }
          }}
          touched={formik?.touched?.region}
          errors={formik?.errors?.region}
          fieldProps={formik?.getFieldProps("region")}
        />
      </Grid>
      <Grid item {...gridProps}>
        <CustomSelectWithFormik
          selectFieldData={districtOptions}
          inputLabel={t("District / MMDA")}
          placeholder={
            regionValue ? t("Select District / MMDA") : t("Select a region first")
          }
          passSelectedValue={(value) => {
            setField("district", value);
            if (value !== districtValue) {
              setField("sub_district", "");
            }
          }}
          touched={formik?.touched?.district}
          errors={formik?.errors?.district}
          fieldProps={formik?.getFieldProps("district")}
        />
      </Grid>
      <Grid item {...gridProps}>
        <CustomSelectWithFormik
          selectFieldData={townOptions}
          inputLabel={t("Town / Sub-District (Optional)")}
          placeholder={
            regionValue ? t("Select Town / Sub-District") : t("Select a region first")
          }
          passSelectedValue={(value) => setField("sub_district", value)}
          touched={formik?.touched?.sub_district}
          errors={formik?.errors?.sub_district}
          fieldProps={formik?.getFieldProps("sub_district")}
        />
      </Grid>
    </>
  );
};

export default GhanaRegionDistrictFields;
