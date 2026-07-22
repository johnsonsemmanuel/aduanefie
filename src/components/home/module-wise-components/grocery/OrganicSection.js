import React, { useMemo, useState } from "react";
import { alpha, Box, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import ProductCard from "components/cards/ProductCard";
import OrganicTag from "components/organic-tag";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import CustomPagination from "components/custom-pagination";
import { useTranslation } from "react-i18next";
import useGetOrganicItems from "api-manage/hooks/react-query/farm/useGetOrganicItems";
import { useSelector, useDispatch } from "react-redux";
import {
  setCropType,
  setZone,
  setFarmingMethod,
  resetOrganicFilter,
} from "redux/slices/organicFilter";
import { getSelectedVariations } from "components/header/second-navbar/SecondNavbar";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";

const CROP_CHIPS = [
  { label: "All", value: null },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Grains", value: "grains" },
  { label: "Herbs", value: "herbs" },
];

const OrganicSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { cropType, zone, farmingMethod } = useSelector(
    (state) => state.organicFilter
  );
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = React.useState(1);
  const [pageLimit] = React.useState(10);

  const zoneid =
    typeof window !== "undefined"
      ? localStorage.getItem("zoneid")
      : undefined;

  const { data, isLoading, refetch } = useGetOrganicItems({
    offset: (page - 1) * pageLimit,
    limit: pageLimit,
    zone_id: zoneid,
    crop_type: cropType,
    farming_method: farmingMethod,
  });

  const products = data?.data?.items ?? data?.items ?? [];

  const handleCropChipClick = (value) => {
    dispatch(setCropType(value));
    setPage(1);
  };

  const handleResetFilters = () => {
    dispatch(resetOrganicFilter());
    setPage(1);
  };

  if (!isLoading && !products.length) return null;

  return (
    <Stack gap={{ xs: "16px", lg: "24px" }}>
      <SliderSectionHeader
        heading={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box component="span" sx={{ color: theme.palette.primary.main, fontSize: "24px", lineHeight: 1 }}>
              🌿
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
              }}
            >
              {t("Organic Produce")}
            </Typography>
          </Stack>
        }
        sx={{ mb: "0.5rem" }}
      />

      <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
        {CROP_CHIPS.map((chip) => (
          <Chip
            key={chip.label}
            label={t(chip.label)}
            onClick={() => handleCropChipClick(chip.value)}
            color={cropType === chip.value ? "primary" : "default"}
            variant={cropType === chip.value ? "filled" : "outlined"}
            size="small"
            sx={{
              fontWeight: cropType === chip.value ? 600 : 400,
              fontSize: "12px",
              borderRadius: "8px",
            }}
          />
        ))}
        {(cropType || farmingMethod || zone) && (
          <Chip
            label={t("Clear All")}
            onClick={handleResetFilters}
            size="small"
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              borderRadius: "8px",
              border: `1px dashed ${theme.palette.neutral[400]}`,
            }}
          />
        )}
      </Stack>

      <Grid container spacing={2}>
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Grid item xs={6} sm={6} md={3} key={i}>
              <ProductCardSimmer variant="vertical" />
            </Grid>
          ))
        ) : (
          products.map((item) => (
            <Grid item xs={6} sm={6} md={3} key={item?.id}>
              <Box sx={{ position: "relative" }}>
                <ProductCard
                  item={item}
                  cardFor="vertical"
                  cardType="vertical-type"
                  noMargin="true"
                />
                {item?.is_organic && (
                  <OrganicTag status={1} top="10px" left="10px" />
                )}
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {data?.data?.total_size > pageLimit && (
        <CustomPagination
          total_size={data?.data?.total_size}
          page_limit={pageLimit}
          offset={page}
          setOffset={setPage}
        />
      )}
    </Stack>
  );
};

export default OrganicSection;
