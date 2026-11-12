import React, { useMemo, useState } from "react";
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HandymanIcon from "@mui/icons-material/Handyman";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { getApiCollection } from "api-manage/getApiContent";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import CustomContainer from "components/container";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getModuleId } from "helper-functions/getModuleId";
import { getServiceCardPricing } from "./components/common/ServiceCardPricing";
import {
  service_popular_items_api,
  service_providers_list_api,
  service_farming_items_api,
} from "./service-api-manage/ApiRoutes";

const EARTH_BORDER = "#E0D6BD";
const EARTH_DARK = "#4F3E2C";
const EARTH_ACCENT = "#67513A";
const OLIVE_GREEN = "#8B9F69";
const WARM_SAND = "#EFE7D3";

const ServiceModule = () => {
  const { t } = useTranslation();
  const moduleId = getModuleId();
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  const { data: categoriesRes, isLoading: categoriesLoading } = useGetCategories();
  const categories = categoriesRes?.data ?? [];

  const { data: servicesData, isLoading: servicesLoading } = useQuery(
    ["service-module-listings", moduleId],
    async () => {
      const { data } = await MainApi.get(
        `${service_popular_items_api}?limit=24&offset=1&type=all`
      );
      return getApiCollection(data, "products");
    },
    { enabled: !!moduleId, staleTime: 1000 * 60 * 3 }
  );

  const { data: providersData, isLoading: providersLoading } = useQuery(
    ["service-module-providers", moduleId],
    async () => {
      const { data } = await MainApi.get(
        `${service_providers_list_api}?offset=1&limit=12&store_type=all`
      );
      return getApiCollection(data, "stores");
    },
    { enabled: !!moduleId, staleTime: 1000 * 60 * 3 }
  );

  const { data: farmingData, isLoading: farmingLoading } = useQuery(
    ["service-module-farming-products", moduleId],
    async () => {
      const { data } = await MainApi.get(
        `${service_farming_items_api}?limit=12&offset=1&module_id=${moduleId}`
      );
      return data?.items ?? [];
    },
    { enabled: !!moduleId, staleTime: 1000 * 60 * 3 }
  );

  const services = servicesData?.products ?? [];
  const providers = providersData?.stores ?? [];

  const filteredServices = useMemo(() => {
    if (selectedCategoryId === "all") return services;
    return services.filter((item) => {
      if (String(item?.category_id) === String(selectedCategoryId)) return true;
      if (Array.isArray(item?.category_ids)) {
        return item.category_ids.some(
          (c) => String(c?.id ?? c) === String(selectedCategoryId)
        );
      }
      return false;
    });
  }, [services, selectedCategoryId]);

  return (
    <Box sx={{ pb: 6 }}>
      <CustomContainer>
        <Stack spacing={4}>
          {/* Flat Earth-Toned Service Hero Banner (Zero Gradients) */}
          <Box
            sx={{
              bgcolor: EARTH_DARK,
              color: "#FFFFFF",
              borderRadius: "20px",
              p: { xs: 3, md: 4.5 },
              border: `1px solid ${EARTH_ACCENT}`,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={3}
            >
              <Box sx={{ maxWidth: 680 }}>
                <Chip
                  icon={<HandymanIcon sx={{ color: "#FFFFFF !important", fontSize: 16 }} />}
                  label={t("Agro Services & Mechanization Hub")}
                  sx={{
                    bgcolor: EARTH_ACCENT,
                    color: "#FAF8F5",
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#FAF8F5", mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  {t("Book Trusted Field Teams, Tractor Operators & Agronomists")}
                </Typography>
                <Typography variant="body1" sx={{ color: "#EFE7D3", opacity: 0.95 }}>
                  {t(
                    "Schedule on-farm mechanization, drone or manual spraying, land preparation, soil testing, and agricultural contractors without cart friction."
                  )}
                </Typography>
              </Box>

              <Stack direction={{ xs: "row", sm: "row" }} spacing={1.5} flexWrap="wrap">
                <Button
                  component={Link}
                  href="/service/all-providers"
                  variant="contained"
                  sx={{
                    bgcolor: OLIVE_GREEN,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 2.5,
                    py: 1.2,
                    "&:hover": { bgcolor: "#778B56" },
                  }}
                >
                  {t("Browse Providers")}
                </Button>
                <Button
                  component={Link}
                  href="/profile?page=my-orders"
                  variant="outlined"
                  startIcon={<CalendarMonthIcon />}
                  sx={{
                    borderColor: WARM_SAND,
                    color: WARM_SAND,
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 2.5,
                    py: 1.2,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  {t("My Bookings")}
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Service Category Filter */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: EARTH_DARK }}>
                {t("Service Categories")}
              </Typography>
            </Stack>
            {categoriesLoading ? (
              <Stack direction="row" spacing={1}>
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} variant="rounded" width={110} height={36} />
                ))}
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={t("All Services")}
                  onClick={() => setSelectedCategoryId("all")}
                  sx={{
                    fontWeight: 600,
                    bgcolor: selectedCategoryId === "all" ? EARTH_DARK : WARM_SAND,
                    color: selectedCategoryId === "all" ? "#FFFFFF" : EARTH_DARK,
                    "&:hover": {
                      bgcolor: selectedCategoryId === "all" ? EARTH_ACCENT : EARTH_BORDER,
                    },
                  }}
                />
                {categories.map((cat) => {
                  const active = String(selectedCategoryId) === String(cat.id);
                  return (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      sx={{
                        fontWeight: 600,
                        bgcolor: active ? EARTH_DARK : WARM_SAND,
                        color: active ? "#FFFFFF" : EARTH_DARK,
                        "&:hover": {
                          bgcolor: active ? EARTH_ACCENT : EARTH_BORDER,
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Available Services (Booking Catalog) */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: EARTH_DARK }}>
                  {t("Bookable Agricultural Services")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Select a service package to schedule date, farm location, and crew allocation.")}
                </Typography>
              </Box>
            </Stack>

            {servicesLoading ? (
              <Grid container spacing={2.5}>
                {[...Array(4)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Skeleton variant="rounded" height={280} />
                  </Grid>
                ))}
              </Grid>
            ) : filteredServices.length === 0 ? (
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${EARTH_BORDER}`,
                  borderRadius: "16px",
                  bgcolor: "#FAF8F5",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                  {t("No service packages found in this category")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                  {t("Try selecting another category or view verified providers below.")}
                </Typography>
                {selectedCategoryId !== "all" && (
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedCategoryId("all")}
                    sx={{ borderColor: EARTH_ACCENT, color: EARTH_DARK }}
                  >
                    {t("Show All Services")}
                  </Button>
                )}
              </Card>
            ) : (
              <Grid container spacing={2.5}>
                {filteredServices.map((service) => {
                  const { displayPrice, originalPrice } = getServiceCardPricing(service);
                  const imageSrc =
                    service?.image_full_url ||
                    "/static/no-image-found.png";
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: `1px solid ${EARTH_BORDER}`,
                          borderRadius: "16px",
                          overflow: "hidden",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            height: 165,
                            bgcolor: WARM_SAND,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={imageSrc}
                            alt={service.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          {service?.unit_type && (
                            <Chip
                              size="small"
                              label={service.unit_type}
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                bgcolor: EARTH_DARK,
                                color: "#FFFFFF",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>

                        <CardContent
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: OLIVE_GREEN, fontWeight: 700, display: "block", mb: 0.5 }}
                            >
                              {service?.store_name || t("Verified Service Provider")}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: EARTH_DARK,
                                lineHeight: 1.3,
                                mb: 1,
                              }}
                            >
                              {service.name}
                            </Typography>
                            {service?.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  mb: 1.5,
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
                            sx={{ pt: 1.5, borderTop: `1px solid ${WARM_SAND}` }}
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

          {/* Currently Farming Products */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: EARTH_DARK }}>
                  {t("Currently Farming")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Farm produce actively growing or harvest-ready this season")}
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/items/farming"
                variant="text"
                sx={{ color: EARTH_ACCENT, fontWeight: 700 }}
              >
                {t("View All Farming")}
              </Button>
            </Stack>

            {farmingLoading ? (
              <Grid container spacing={2.5}>
                {[...Array(4)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Skeleton variant="rounded" height={280} />
                  </Grid>
                ))}
              </Grid>
            ) : farmingData.length === 0 ? (
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${EARTH_BORDER}`,
                  borderRadius: "16px",
                  bgcolor: "#FAF8F5",
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                  {t("No products currently in farming mode")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                  {t("Check back soon for fresh farm produce")}
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={2.5}>
                {farmingData.map((product) => {
                  const imageSrc =
                    product?.image_full_url || "/static/no-image-found.png";
                  const isHarvestReady = product?.farming_status === "harvest_ready";
                  const isBackyard = product?.is_backyard;
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: `1px solid ${EARTH_BORDER}`,
                          borderRadius: "16px",
                          overflow: "hidden",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            height: 165,
                            bgcolor: WARM_SAND,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={imageSrc}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          {isHarvestReady && (
                            <Chip
                              size="small"
                              label={t("Harvest Ready")}
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                bgcolor: "#155724",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                borderRadius: "6px",
                              }}
                            />
                          )}
                          {isBackyard && (
                            <Chip
                              size="small"
                              label={t("Backyard Grown")}
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                bgcolor: EARTH_DARK,
                                color: "#FFFFFF",
                                fontWeight: 600,
                                borderRadius: "6px",
                              }}
                            />
                          )}
                        </Box>

                        <CardContent
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: OLIVE_GREEN, fontWeight: 700, display: "block", mb: 0.5 }}
                            >
                              {product?.store_name || t("Verified Farm")}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: EARTH_DARK,
                                lineHeight: 1.3,
                                mb: 1,
                              }}
                            >
                              {product.name}
                            </Typography>
                            {product?.farming_status && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isHarvestReady ? "#155724" : EARTH_DARK,
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  mb: 1.5,
                                }}
                              >
                                {t(product.farming_status)}
                              </Typography>
                            )}
                          </Box>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ pt: 1.5, borderTop: `1px solid ${WARM_SAND}` }}
                          >
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                                {product.price > 0 ? getAmountWithSign(product.price) : t("Quote")}
                              </Typography>
                            </Box>
                            <Button
                              component={Link}
                              href={`/items/details/${product.id}`}
                              variant="contained"
                              size="small"
                              sx={{
                                bgcolor: isHarvestReady ? "#155724" : OLIVE_GREEN,
                                color: "#FFFFFF",
                                fontWeight: 600,
                                borderRadius: "8px",
                                "&:hover": { bgcolor: isHarvestReady ? "#0d3b13" : "#778B56" },
                              }}
                            >
                              {t("View Produce")}
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

          {/* Verified Service Providers */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: EARTH_DARK }}>
                  {t("Verified Service Providers")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Field contractors, mechanization operators, and agribusiness specialists.")}
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/service/all-providers"
                variant="text"
                sx={{ color: EARTH_ACCENT, fontWeight: 700 }}
              >
                {t("View All")}
              </Button>
            </Stack>

            {providersLoading ? (
              <Grid container spacing={2.5}>
                {[...Array(4)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Skeleton variant="rounded" height={140} />
                  </Grid>
                ))}
              </Grid>
            ) : providers.length === 0 ? (
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${EARTH_BORDER}`,
                  borderRadius: "16px",
                  p: 3,
                  bgcolor: "#FAF8F5",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("No service providers are registered in this zone yet.")}
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={2.5}>
                {providers.map((provider) => (
                  <Grid item xs={12} sm={6} md={4} key={provider.id}>
                    <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${EARTH_BORDER}`,
                        borderRadius: "16px",
                        p: 2.5,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        bgcolor: "#FFFFFF",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={provider?.logo_full_url}
                          alt={provider?.name}
                          sx={{ width: 56, height: 56, bgcolor: WARM_SAND, color: EARTH_DARK }}
                        >
                          {provider?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              color={EARTH_DARK}
                              noWrap
                            >
                              {provider?.name}
                            </Typography>
                            <VerifiedIcon sx={{ fontSize: 16, color: OLIVE_GREEN }} />
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3 }}>
                            <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {provider?.address || t("Service coverage across your zone")}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <Stack direction="row" alignItems="center" spacing={0.3}>
                              <StarIcon sx={{ fontSize: 15, color: "#D49B35" }} />
                              <Typography variant="caption" fontWeight={600}>
                                {Number(provider?.avg_rating ?? 0).toFixed(1)}
                              </Typography>
                            </Stack>
                            {provider?.delivery_time && (
                              <Typography variant="caption" color="text.secondary">
                                • {t("Response:")} {provider.delivery_time}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${WARM_SAND}` }}>
                        <Button
                          component={Link}
                          href={`/service/provider/${provider.id}`}
                          fullWidth
                          variant="outlined"
                          sx={{
                            borderColor: EARTH_ACCENT,
                            color: EARTH_DARK,
                            fontWeight: 600,
                            borderRadius: "8px",
                            "&:hover": { bgcolor: WARM_SAND, borderColor: EARTH_DARK },
                          }}
                        >
                          {t("View Provider & Services")}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      </CustomContainer>
    </Box>
  );
};

export default ServiceModule;
