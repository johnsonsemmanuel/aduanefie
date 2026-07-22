import React, { useState } from "react";
import {
  alpha,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import CustomMultiSelect from "components/custom-multi-select/CustomMultiSelect";
import { RadioGroup, Radio, FormControlLabel, FormLabel } from "@mui/material";
import MultiFileUploader from "components/multi-file-uploader/MultiFileUploader";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import GoogleMapComponent from "components/Map/GoogleMapComponent";
import { useTranslation } from "react-i18next";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import StraightenIcon from "@mui/icons-material/Straighten";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import MapIcon from "@mui/icons-material/Map";
import BadgeIcon from "@mui/icons-material/Badge";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const FARMING_METHODS = [
  { label: "Organic", value: "organic" },
  { label: "Mixed", value: "mixed" },
  { label: "Conventional", value: "conventional" },
];

const CROP_OPTIONS = [
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Grains", value: "grains" },
  { label: "Herbs", value: "herbs" },
  { label: "Tubers", value: "tubers" },
  { label: "Legumes", value: "legumes" },
];

const FarmFields = ({ RestaurantJoinFormik, handleFieldChange }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [farmLocation, setFarmLocation] = useState({
    lat: RestaurantJoinFormik.values.lat || "",
    lng: RestaurantJoinFormik.values.lng || "",
  });

  const handleFarmLocationChange = (value) => {
    setFarmLocation(value);
    handleFieldChange("lat", value?.lat || "");
    handleFieldChange("lng", value?.lng || "");
  };

  const handleFarmPhotoChange = (files) => {
    handleFieldChange("farm_photos", files);
  };

  const handleGhanaCardImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFieldChange("ghana_card_image", file);
    }
  };

  return (
    <CustomStackFullWidth spacing={3} mt={2}>
      <Typography
        fontSize={{ xs: "16px", sm: "18px" }}
        fontWeight="500"
        textAlign="left"
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
          pb: 1,
        }}
      >
        {t("Farm Information")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            backgroundColor
            required="true"
            type="text"
            label={t("Farm Name")}
            placeholder={t("Enter farm name")}
            value={RestaurantJoinFormik.values.farm_name}
            touched={RestaurantJoinFormik.touched.farm_name}
            errors={RestaurantJoinFormik.errors.farm_name}
            fieldProps={RestaurantJoinFormik.getFieldProps("farm_name")}
            onChangeHandler={(value) => handleFieldChange("farm_name", value)}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <AgricultureIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.farm_name &&
                      !RestaurantJoinFormik.errors.farm_name
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            backgroundColor
            required="true"
            type="number"
            label={t("Growing Area (sqm)")}
            placeholder={t("Enter growing area in square meters")}
            value={RestaurantJoinFormik.values.growing_area_sqm}
            touched={RestaurantJoinFormik.touched.growing_area_sqm}
            errors={RestaurantJoinFormik.errors.growing_area_sqm}
            fieldProps={RestaurantJoinFormik.getFieldProps("growing_area_sqm")}
            onChangeHandler={(value) => handleFieldChange("growing_area_sqm", value)}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <StraightenIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.growing_area_sqm &&
                      !RestaurantJoinFormik.errors.growing_area_sqm
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomMultiSelect
            options={CROP_OPTIONS}
            label={t("Primary Crops")}
            placeholder={t("Select primary crops")}
            touched={RestaurantJoinFormik.touched.primary_crops}
            errors={RestaurantJoinFormik.errors.primary_crops}
            handleChange={(value) => handleFieldChange("primary_crops", value)}
            icon={
              <FilterVintageIcon
                sx={{
                  color: alpha(theme.palette.neutral[400], 0.7),
                  fontSize: "18px",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomStackFullWidth>
            <FormLabel sx={{ fontSize: "12px", fontWeight: 500, color: alpha(theme.palette.neutral[1000], 0.8), mb: 1 }}>
              {t("Farming Method")}
            </FormLabel>
            <RadioGroup
              row
              value={RestaurantJoinFormik.values.farming_method || ""}
              onChange={(e) => handleFieldChange("farming_method", e.target.value)}
            >
              {FARMING_METHODS.map((method) => (
                <FormControlLabel
                  key={method.value}
                  value={method.value}
                  control={<Radio size="small" />}
                  label={t(method.label)}
                />
              ))}
            </RadioGroup>
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomStackFullWidth>
            <Typography fontSize="12px" fontWeight="500" mb={1} sx={{ color: alpha(theme.palette.neutral[1000], 0.8) }}>
              {t("Farm Photos")} (Max 3)
            </Typography>
            <MultiFileUploader
              totalFiles={RestaurantJoinFormik.values.farm_photos}
              fileImagesHandler={handleFarmPhotoChange}
              maxFileSize={2000000}
              supportedFileFormats={["jpg", "jpeg", "png", "webp"]}
              acceptedFileInput="image/*"
              labelText={t("Upload farm photos")}
              titleText={t("Farm Photos")}
              hintText={t("Max 3 images, 2MB each")}
              gridControl
            />
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomStackFullWidth>
            <Typography fontSize="12px" fontWeight="500" mb={1} sx={{ color: alpha(theme.palette.neutral[1000], 0.8) }}>
              {t("GPS Location")}
            </Typography>
            <GoogleMapComponent
              setLocation={handleFarmLocationChange}
              location={farmLocation}
              height="250px"
              setDisablePickButton={() => {}}
              setLocationEnabled={() => {}}
              setPlaceDetailsEnabled={() => {}}
              polygonPaths={[]}
              fromVendor={true}
              t={(key) => t(key)}
            />
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextFieldWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            backgroundColor
            required="true"
            type="text"
            label={t("Ghana Card Number")}
            placeholder="GHA-XXXXXXXXX-X"
            value={RestaurantJoinFormik.values.ghana_card_number}
            touched={RestaurantJoinFormik.touched.ghana_card_number}
            errors={RestaurantJoinFormik.errors.ghana_card_number}
            fieldProps={RestaurantJoinFormik.getFieldProps("ghana_card_number")}
            onChangeHandler={(value) => handleFieldChange("ghana_card_number", value)}
            fontSize="12px"
            startIcon={
              <InputAdornment position="start">
                <BadgeIcon
                  sx={{
                    color:
                      RestaurantJoinFormik.touched.ghana_card_number &&
                      !RestaurantJoinFormik.errors.ghana_card_number
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomStackFullWidth>
            <Typography fontSize="12px" fontWeight="500" mb={1} sx={{ color: alpha(theme.palette.neutral[1000], 0.8) }}>
              {t("Ghana Card Image")}
            </Typography>
            <ImageUploaderWithPreview
              imageUrl={RestaurantJoinFormik.values.ghana_card_image}
              onChange={handleGhanaCardImageChange}
              labelText={t("Upload Ghana Card")}
              hintText={t("JPG, PNG up to 2MB")}
              width="100%"
            />
          </CustomStackFullWidth>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default FarmFields;
