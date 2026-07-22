import { useEffect, useState } from "react";
import { alpha, Grid, InputAdornment, Typography, useTheme } from "@mui/material";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import { useTranslation } from "react-i18next";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { zone_list } from "api-manage/ApiRoutes";
import { community_zone_by_zone_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import GHANA_REGIONS from "data/ghanaRegions";

const getZones = async () => {
  const { data } = await MainApi.get(zone_list);
  return data?.data ?? data ?? [];
};

const getCommunityZonesByZone = async (zoneId) => {
  if (!zoneId) return [];
  const { data } = await MainApi.get(`${community_zone_by_zone_api}?zone_id=${zoneId}`);
  return data?.data ?? data ?? [];
};

const CommunityZoneInfo = ({ handleFieldChange, values, touched, errors }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [selectedRegion, setSelectedRegion] = useState(values?.region || "");
  const [selectedZoneId, setSelectedZoneId] = useState(values?.zone_id || "");

  const { data: allZones = [], isLoading: zonesLoading, refetch: refetchZones } = useQuery(
    ["all-zones"],
    getZones,
    { enabled: false, onError: onSingleErrorResponse }
  );

  const { data: communityZones = [], isLoading: communityLoading } = useQuery(
    ["community-zones", selectedZoneId],
    () => getCommunityZonesByZone(selectedZoneId),
    { enabled: false, onError: onSingleErrorResponse }
  );

  useEffect(() => {
    refetchZones();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      refetchZones();
    }
  }, [selectedRegion]);

  const zoneOptions = allZones
    .filter((zone) => !selectedRegion || zone?.region === selectedRegion)
    .map((zone) => ({
      label: zone?.name,
      value: String(zone?.id),
    }));

  const communityZoneOptions = communityZones.map((cz) => ({
    label: cz?.name || cz?.title || `Zone ${cz?.id}`,
    value: String(cz?.id),
  }));

  const regionOptions = GHANA_REGIONS.map((region) => ({
    label: region.label,
    value: region.value,
  }));

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSelectedZoneId("");
    handleFieldChange("region", value);
    handleFieldChange("zone_id", "");
    handleFieldChange("community_zone_id", "");
  };

  const handleZoneChange = (value) => {
    setSelectedZoneId(value);
    handleFieldChange("zone_id", value);
    handleFieldChange("community_zone_id", "");
  };

  const handleCommunityZoneChange = (value) => {
    handleFieldChange("community_zone_id", value);
  };

  return (
    <CustomStackFullWidth spacing={2}>
      <Typography fontSize="16px" fontWeight="600" mb={1}>
        {t("Community Zone Assignment")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CustomSelectWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            selectFieldData={regionOptions}
            inputLabel={t("Region")}
            passSelectedValue={handleRegionChange}
            touched={touched?.region}
            errors={errors?.region}
            fieldProps={{}}
            placeholder={t("Select Region")}
            required
            startIcon={
              <PublicIcon
                sx={{
                  color: alpha(theme.palette.neutral[400], 0.7),
                  fontSize: "18px",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomSelectWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            selectFieldData={zoneOptions}
            inputLabel={t("Zone")}
            passSelectedValue={handleZoneChange}
            touched={touched?.zone_id}
            errors={errors?.zone_id}
            fieldProps={{}}
            placeholder={t("Select Zone")}
            required
            disabled={!selectedRegion || zonesLoading}
            startIcon={
              <LocationOnIcon
                sx={{
                  color: alpha(theme.palette.neutral[400], 0.7),
                  fontSize: "18px",
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomSelectWithFormik
            labelColor={alpha(theme.palette.neutral[1000], 0.8)}
            selectFieldData={communityZoneOptions}
            inputLabel={t("Community Zone")}
            passSelectedValue={handleCommunityZoneChange}
            touched={touched?.community_zone_id}
            errors={errors?.community_zone_id}
            fieldProps={{}}
            placeholder={t("Select Community Zone")}
            required
            disabled={!selectedZoneId || communityLoading}
            startIcon={
              <HomeIcon
                sx={{
                  color: alpha(theme.palette.neutral[400], 0.7),
                  fontSize: "18px",
                }}
              />
            }
          />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default CommunityZoneInfo;
