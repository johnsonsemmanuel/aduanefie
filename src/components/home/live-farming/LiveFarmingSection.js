import React, { useState } from "react";
import {
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetLiveFarmingItems } from "api-manage/hooks/react-query/useGetLiveFarmingItems";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";
import { findMatchingAgroPrice, formatCedi } from "utils/agroPriceMatch";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import InsuranceBadge from "components/badges/InsuranceBadge";

const LiveFarmingSection = ({
  limit = 8,
  showViewAll = true,
  hideIfEmpty = true,
  initialBackyardOnly = false,
  lockBackyard = false,
  titleOverride = null,
  subtitleOverride = null,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [backyardOnly, setBackyardOnly] = useState(initialBackyardOnly);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, refetch } = useGetLiveFarmingItems({
    status: statusFilter,
    backyard: backyardOnly,
    limit,
    offset: 1,
  });
  const { data: agroPriceData } = useGetAgroPrices();
  const agroPrices = agroPriceData?.prices || [];

  const rawProducts = data?.products || [];
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const products = normalizedQuery
    ? rawProducts.filter((p) => {
        const hay = `${p?.name || ""} ${p?.store_name || ""} ${p?.origin_farm || ""}`.toLowerCase();
        return hay.includes(normalizedQuery);
      })
    : rawProducts;

  if (!isError && !isLoading && hideIfEmpty && rawProducts.length === 0 && statusFilter === "all" && !backyardOnly) {
    return null;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "12px",
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ mb: { xs: 1.25, sm: 2 } }}
      >
        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: "8px",
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fi fi-rr-leaf" style={{ fontSize: "16px", lineHeight: 1, display: "flex" }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "15px", sm: "18px" },
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t(titleOverride || "Live Farming")}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={t("LIVE")}
                sx={{
                  height: 18,
                  fontSize: "9.5px",
                  fontWeight: 700,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.deep,
                }}
              />

            </Stack>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "12.5px",
                color: theme.palette.text.secondary,
                mt: 0.25,
              }}
            >
              {t("Track active crops in cultivation, view harvest progress, and reserve directly from farms.")}
            </Typography>
          </Box>
        </Stack>

        {showViewAll && (
          <Button
            component={Link}
            href="/live-farming"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "11.5px", sm: "13px" },
              px: { xs: 1.25, sm: 1.75 },
              borderRadius: "8px",
              textTransform: "none",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t("View All")}
          </Button>
        )}
      </Stack>

      <Stack
        direction="row"
        flexWrap="nowrap"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{ mb: { xs: 1.5, sm: 2 }, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        <Tabs
          value={statusFilter}
          onChange={(_, val) => setStatusFilter(val)}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            minHeight: 32,
            "& .MuiTab-root": {
              minHeight: 32,
              minWidth: "auto",
              py: 0.5,
              px: { xs: 1, sm: 1.5 },
              fontSize: { xs: "11.5px", sm: "12px" },
              fontWeight: 600,
              textTransform: "none",
            },
          }}
        >
          <Tab value="all" label={t("All")} />
          <Tab value="farming" label={t("Growing")} />
          <Tab value="harvest_ready" label={t("Harvest Ready")} />
        </Tabs>

        <Chip
          clickable={!lockBackyard}
          size="small"
          label={t("Backyard")}
          onClick={lockBackyard ? undefined : () => setBackyardOnly((prev) => !prev)}
          color={backyardOnly ? "success" : "default"}
          variant={backyardOnly ? "filled" : "outlined"}
          sx={{ fontWeight: 600, fontSize: "11px", flexShrink: 0 }}
        />
      </Stack>

      {!showViewAll && (
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Search crops, farms, or regions...")}
            sx={{
              maxWidth: 420,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "13.5px",
              },
            }}
          />
        </Box>
      )}

      {isError ? (
        <Alert severity="error" action={<Button color="inherit" onClick={() => refetch()}>{t("Retry")}</Button>}>
          {t("Farming listings could not be loaded. Please try again.")}
        </Alert>
      ) : isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Skeleton variant="rounded" height={260} sx={{ borderRadius: "12px" }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary", fontSize: "13.5px", mb: 1.25 }}>
            {t("No crops match this live farming filter right now.")}
          </Typography>
          {(statusFilter !== "all" || (backyardOnly && !lockBackyard)) && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setStatusFilter("all");
                setBackyardOnly(lockBackyard ? initialBackyardOnly : false);
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {t(lockBackyard ? "Clear filters" : "Show all active crops")}
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={{ xs: 1.25, sm: 2 }}>
          {products.map((item) => {
            const status = item?.effective_farming_status || item?.farming_status || "farming";
            const isHarvestReady = status === "harvest_ready";
            const progress = typeof item?.cultivation_progress_pct === "number" ? item.cultivation_progress_pct : isHarvestReady ? 100 : 0;
            const daysLeft = item?.days_to_harvest;
            const imgSrc = item?.image_full_url || item?.image || "/static/empty_img.png";

            return (
              <Grid item xs={6} sm={6} md={3} key={item.id}>
                <Card
                  component={Link}
                  href={`/product/${item?.slug || item?.id}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.primary.main, 0.28),
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.deep, 0.14)}`,
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: { xs: 118, sm: 155 }, overflow: "hidden", bgcolor: theme.palette.background.secondary }}>
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={item?.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ position: "absolute", top: 6, left: 6, right: 6, flexWrap: "nowrap", gap: 0.5 }}
                    >
                      <Chip
                        size="small"
                        label={isHarvestReady ? t("Harvest Ready") : t("Growing")}
                        sx={{
                          height: { xs: 20, sm: 22 },
                          bgcolor: isHarvestReady ? theme.palette.primary.main : (theme.palette.warning.secondary || "#bf6a02"),
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: { xs: "9.5px", sm: "10.5px" },
                        }}
                      />
                      <Box sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                        <InsuranceBadge item={item} variant="compact" />
                      </Box>
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } }, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "12.5px", sm: "14px" },
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10.5px", sm: "11.5px" },
                          color: "text.secondary",
                          mt: 0.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item?.store_name || t("Verified Farm")}
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                          {item?.origin_country ? ` · ${item.origin_country}` : ""}
                          {item?.is_backyard ? ` · ${t("Backyard")}` : ""}
                        </Box>
                      </Typography>

                      <Box sx={{ mt: { xs: 0.9, sm: 1.25 } }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.35 }}>
                          <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, fontWeight: 600, color: theme.palette.primary.deep, whiteSpace: "nowrap" }}>
                            {isHarvestReady
                              ? t("Ready")
                              : daysLeft !== null && daysLeft !== undefined
                              ? t("{{days}}d left", { days: daysLeft })
                              : t("Growing")}
                          </Typography>
                          <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, fontWeight: 700, color: "text.secondary" }}>
                            {progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, Math.max(5, progress))}
                          sx={{
                            height: { xs: 5, sm: 6 },
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.primary.main, 0.16),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              bgcolor: isHarvestReady ? theme.palette.primary.main : (theme.palette.warning.secondary || "#bf6a02"),
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.5} sx={{ mt: { xs: 1, sm: 1.5 } }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: "12.5px", sm: "14.5px" }, color: theme.palette.primary.deep, whiteSpace: "nowrap" }}>
                          {getAmountWithSign(item?.price || 0)}
                        </Typography>
                        {(() => {
                          const m = findMatchingAgroPrice(item, agroPrices);
                          if (!m) return null;
                          const mktRetail = Number(m.retail_price_ghs || 0);
                          const itemPrice = Number(item?.price || 0);
                          const savePct = mktRetail > itemPrice && itemPrice > 0 ? Math.round(((mktRetail - itemPrice) / mktRetail) * 100) : 0;
                          return (
                            <Typography sx={{ fontSize: "10px", fontWeight: 600, color: savePct >= 5 ? theme.palette.success.dark : "text.secondary", whiteSpace: "nowrap" }}>
                              {savePct >= 5 ? `${t("Save")} ${savePct}%` : `${t("Mkt")} ${formatCedi(m.wholesale_price_ghs)}`}
                            </Typography>
                          );
                        })()}
                      </Box>
                      <Chip
                        size="small"
                        label={item?.pre_order_available ? t("Pre-Order") : t("View")}
                        sx={{
                          height: { xs: 20, sm: 22 },
                          fontSize: { xs: "10px", sm: "11px" },
                          fontWeight: 700,
                          bgcolor: theme.palette.background.secondary,
                          color: theme.palette.primary.deep,
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default LiveFarmingSection;
