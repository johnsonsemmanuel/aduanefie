import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { getApiCollection } from "api-manage/getApiContent";
import CustomContainer from "components/container";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { service_latest_items_api } from "../../service-api-manage/ApiRoutes";
import { getServiceCardPricing } from "../common/ServiceCardPricing";

const EARTH_BORDER = "#E0D6BD";
const EARTH_DARK = "#4F3E2C";
const EARTH_ACCENT = "#67513A";
const OLIVE_GREEN = "#8B9F69";
const WARM_SAND = "#EFE7D3";

export default function ProviderDetails({ providerDetails }) {
  const { t } = useTranslation();
  const providerId = providerDetails?.id;

  const { data: itemsData, isLoading } = useQuery(
    ["service-provider-listings", providerId],
    async () => {
      const { data } = await MainApi.get(
        `${service_latest_items_api}?store_id=${providerId}&category_id=0&limit=30&offset=1`
      );
      return getApiCollection(data, "products");
    },
    { enabled: !!providerId, staleTime: 1000 * 60 * 3 }
  );

  const services = itemsData?.products ?? [];

  if (!providerDetails) {
    return (
      <CustomContainer sx={{ py: 6 }}>
        <Typography variant="h6" color={EARTH_DARK}>
          {t("Service provider details could not be loaded.")}
        </Typography>
      </CustomContainer>
    );
  }

  return (
    <CustomContainer sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        {/* Provider Header */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            border: `1px solid ${EARTH_BORDER}`,
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{ height: { xs: 140, md: 200 }, bgcolor: EARTH_DARK, overflow: "hidden" }}>
            {providerDetails?.cover_photo_full_url && (
              <img
                src={providerDetails.cover_photo_full_url}
                alt={providerDetails.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </Box>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={providerDetails?.logo_full_url}
                  alt={providerDetails?.name}
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: WARM_SAND,
                    color: EARTH_DARK,
                    border: `2px solid ${EARTH_BORDER}`,
                  }}
                >
                  {providerDetails?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" fontWeight={700} color={EARTH_DARK}>
                      {providerDetails.name}
                    </Typography>
                    <VerifiedIcon sx={{ color: OLIVE_GREEN, fontSize: 20 }} />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {providerDetails?.address || t("Registered field service contractor")}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      icon={<StarIcon sx={{ fontSize: 15, color: "#D49B35 !important" }} />}
                      label={`${Number(providerDetails?.avg_rating ?? 0).toFixed(1)} (${
                        providerDetails?.rating_count ?? 0
                      })`}
                      sx={{ bgcolor: WARM_SAND, color: EARTH_DARK, fontWeight: 600 }}
                    />
                    {providerDetails?.delivery_time && (
                      <Chip
                        size="small"
                        label={`${t("Dispatch:")} ${providerDetails.delivery_time}`}
                        sx={{ bgcolor: "#FAF8F5", border: `1px solid ${EARTH_BORDER}` }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {providerDetails?.phone && (
                <Button
                  component="a"
                  href={`tel:${providerDetails.phone}`}
                  variant="outlined"
                  startIcon={<CallIcon />}
                  sx={{
                    borderColor: EARTH_ACCENT,
                    color: EARTH_DARK,
                    fontWeight: 600,
                    borderRadius: "10px",
                  }}
                >
                  {t("Call Provider")}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Provider Services */}
        <Box>
          <Typography variant="h6" fontWeight={700} color={EARTH_DARK} sx={{ mb: 2 }}>
            {t("Services Offered by")} {providerDetails.name}
          </Typography>

          {isLoading ? (
            <Grid container spacing={2.5}>
              {[...Array(4)].map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Skeleton variant="rounded" height={240} />
                </Grid>
              ))}
            </Grid>
          ) : services.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${EARTH_BORDER}`,
                borderRadius: "16px",
                bgcolor: "#FAF8F5",
                p: 4,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {t("This provider currently has no published service packages.")}
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2.5}>
              {services.map((service) => {
                const { displayPrice, originalPrice } = getServiceCardPricing(service);
                return (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${EARTH_BORDER}`,
                        borderRadius: "16px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      <Box sx={{ height: 160, bgcolor: WARM_SAND }}>
                        <img
                          src={service?.image_full_url || "/static/no-image-found.png"}
                          alt={service.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                            {service.name}
                          </Typography>
                          {service?.unit_type && (
                            <Typography variant="caption" color="text.secondary">
                              {t("Billing Unit:")} {service.unit_type}
                            </Typography>
                          )}
                          {service?.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {service.description.replace(/<[^>]*>/g, "")}
                            </Typography>
                          )}
                        </Box>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${WARM_SAND}` }}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                              {displayPrice > 0 ? getAmountWithSign(displayPrice) : t("Quote")}
                            </Typography>
                            {originalPrice > displayPrice && (
                              <Typography
                                variant="caption"
                                sx={{ textDecoration: "line-through", color: "text.secondary" }}
                              >
                                {getAmountWithSign(originalPrice)}
                              </Typography>
                            )}
                          </Box>
                          <Button
                            component={Link}
                            href={`/service/service-details/${service.id}`}
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: OLIVE_GREEN,
                              color: "#FFFFFF",
                              fontWeight: 600,
                              borderRadius: "8px",
                              "&:hover": { bgcolor: "#778B56" },
                            }}
                          >
                            {t("Book Service")}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Stack>
    </CustomContainer>
  );
}
