import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import ImageUploaderWithPreview from "components/single-file-uploader-with-preview/ImageUploaderWithPreview";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import useGetFarmInputProducts from "api-manage/hooks/react-query/farm/useGetFarmInputProducts";
import { useSelector } from "react-redux";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { farm_input_products_api } from "api-manage/ApiRoutes";
import toast from "react-hot-toast";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { shadows } from "@mui/system";

const FARM_STATUS_BADGE = {
  pending: { label: "Pending", color: "warning" },
  active: { label: "Active", color: "success" },
  flagged: { label: "Flagged", color: "error" },
};

const MyFarm = ({ configData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [updateImage, setUpdateImage] = useState(null);

  const farmStatus = profileInfo?.farm_status || "pending";
  const statusBadge = FARM_STATUS_BADGE[farmStatus] || FARM_STATUS_BADGE.pending;
  const isOrganicActive =
    profileInfo?.is_organic_badge_active && profileInfo?.complaint_count_30d < 3;

  const zoneid =
    typeof window !== "undefined"
      ? localStorage.getItem("zoneid")
      : undefined;

  const { data: inputProducts, isLoading: inputProductsLoading } = useQuery(
    ["farm-input-products", zoneid],
    async () => {
      const { data } = await MainApi.get(farm_input_products_api, {
        params: { zone_id: zoneid },
      });
      return data;
    },
    { enabled: !!zoneid, onError: onSingleErrorResponse }
  );

  const products = inputProducts?.data?.items ?? inputProducts?.items ?? [];

  const handlePostHarvestUpdate = async () => {
    if (!updateText.trim()) {
      toast.error(t("Update text is required"));
      return;
    }
    const formData = new FormData();
    formData.append("store_id", profileInfo?.id);
    formData.append("message", updateText);
    if (updateImage) {
      formData.append("image", updateImage);
    }

    try {
      await MainApi.post(farm_updates_api, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("Harvest update posted"));
      setOpenUpdateModal(false);
      setUpdateText("");
      setUpdateImage(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("Failed to post update"));
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isSmall ? 2 : 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  return (
    <CustomStackFullWidth spacing={3}>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={1}>
        <Typography fontSize="20px" fontWeight="700">
          {t("My Farm")}
        </Typography>
        <Chip
          label={t(statusBadge.label)}
          color={statusBadge.color}
          size="small"
          sx={{ fontWeight: 600 }}
        />
        {isOrganicActive && (
          <Chip
            icon={<VerifiedIcon sx={{ fontSize: "14px" }} />}
            label={t("Organic Badge Active")}
            color="success"
            variant="outlined"
            size="small"
          />
        )}
      </Stack>

      <CustomStackFullWidth
        sx={{
          backgroundColor: theme.palette.neutral[100],
          borderRadius: "8px",
          boxShadow: shadows[1],
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography fontSize="16px" fontWeight="600">
            {t("Farm Details")}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AgricultureIcon />}
            onClick={() => setOpenUpdateModal(true)}
          >
            {t("Post Harvest Update")}
          </Button>
        </Stack>

        <Grid container spacing={2} mt={1}>
          {profileInfo?.farm_name && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography fontSize="12px" color="text.secondary">{t("Farm Name")}</Typography>
              <Typography fontSize="14px" fontWeight="500">{profileInfo.farm_name}</Typography>
            </Grid>
          )}
          {profileInfo?.growing_area_sqm && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography fontSize="12px" color="text.secondary">{t("Growing Area")}</Typography>
              <Typography fontSize="14px" fontWeight="500">{`${profileInfo.growing_area_sqm} ${t("sqm")}`}</Typography>
            </Grid>
          )}
          {profileInfo?.farming_method && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography fontSize="12px" color="text.secondary">{t("Farming Method")}</Typography>
              <Typography fontSize="14px" fontWeight="500" sx={{ textTransform: "capitalize" }}>{profileInfo.farming_method}</Typography>
            </Grid>
          )}
        </Grid>
      </CustomStackFullWidth>

      <CustomStackFullWidth
        sx={{
          backgroundColor: theme.palette.neutral[100],
          borderRadius: "8px",
          boxShadow: shadows[1],
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography fontSize="16px" fontWeight="600" mb={1}>
          {t("Recommended Input Products")}
        </Typography>
        {inputProductsLoading ? (
          <CircularProgress size={24} />
        ) : products.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <Slider {...sliderSettings}>
              {products.map((item) => (
                <div key={item?.id}>
                  <NewProductCard
                    variant="vertical"
                    item={item}
                    cardWidth={{ xs: "140px", md: "170px" }}
                  />
                </div>
              ))}
            </Slider>
          </Box>
        ) : (
          <Typography fontSize="14px" color="text.secondary">
            {t("No recommended products available")}
          </Typography>
        )}
      </CustomStackFullWidth>

      <CustomModal
        openModal={openUpdateModal}
        handleClose={() => setOpenUpdateModal(false)}
        maxWidth="sm"
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography fontSize="18px" fontWeight="600" mb={2}>
            {t("Post Harvest Update")}
          </Typography>
          <Stack spacing={2}>
            <textarea
              placeholder={t("Share your harvest update...")}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${theme.palette.divider}`,
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            <ImageUploaderWithPreview
              imageUrl={updateImage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUpdateImage(file);
              }}
              labelText={t("Upload Image (optional)")}
              hintText={t("JPG, PNG up to 2MB")}
              width="100%"
            />
            <Button
              variant="contained"
              onClick={handlePostHarvestUpdate}
              disabled={!updateText.trim()}
            >
              {t("Post Update")}
            </Button>
          </Stack>
        </Box>
      </CustomModal>
    </CustomStackFullWidth>
  );
};

export default MyFarm;
