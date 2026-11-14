import React, { useState } from "react";
import {
  Box,
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
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetLiveFarmingItems } from "api-manage/hooks/react-query/useGetLiveFarmingItems";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import InsuranceBadge from "components/badges/InsuranceBadge";

const LiveFarmingSection = ({ limit = 8, showViewAll = true, hideIfEmpty = true }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [backyardOnly, setBackyardOnly] = useState(false);

  const { data, isLoading } = useGetLiveFarmingItems({
    status: statusFilter,
    backyard: backyardOnly,
    limit,
    offset: 1,
  });

  const products = data?.products || [];

  if (!isLoading && hideIfEmpty && products.length === 0 && statusFilter === "all" && !backyardOnly) {
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
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fi fi-rr-leaf" style={{ fontSize: "18px", lineHeight: 1, display: "flex" }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.2 }}>
                {t("Live Farming Marketplace")}
              </Typography>
              <Chip
                size="small"
                color="success"
                variant="outlined"
                label={t("LIVE")}
                sx={{
                  height: 20,
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: "12.5px", color: theme.palette.text.secondary, mt: 0.25 }}>
              {t("Track active crops in cultivation, view harvest progress, and reserve or pre-order directly from farms.")}
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
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            {t("View All Live Farms")}
          </Button>
        )}
      </Stack>

      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{ mb: 2 }}
      >
        <Tabs
          value={statusFilter}
          onChange={(_, val) => setStatusFilter(val)}
          sx={{
            minHeight: 34,
            "& .MuiTab-root": {
              minHeight: 34,
              py: 0.5,
              px: 1.5,
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "none",
            },
          }}
        >
          <Tab value="all" label={t("All Active")} />
          <Tab value="farming" label={t("Growing Now")} />
          <Tab value="harvest_ready" label={t("Harvest Ready")} />
        </Tabs>

        <Chip
          clickable
          size="small"
          label={t("Backyard Farms Only")}
          onClick={() => setBackyardOnly((prev) => !prev)}
          color={backyardOnly ? "success" : "default"}
          variant={backyardOnly ? "filled" : "outlined"}
          sx={{ fontWeight: 600, fontSize: "11.5px" }}
        />
      </Stack>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Skeleton variant="rounded" height={260} sx={{ borderRadius: "12px" }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>
            {t("No crops match this live farming filter right now.")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.map((item) => {
            const status = item?.effective_farming_status || item?.farming_status || "farming";
            const isHarvestReady = status === "harvest_ready";
            const progress = typeof item?.cultivation_progress_pct === "number" ? item.cultivation_progress_pct : isHarvestReady ? 100 : 45;
            const daysLeft = item?.days_to_harvest;
            const imgSrc = item?.image_full_url || item?.image || "/static/empty_img.png";

            return (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
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
                    borderColor: alpha("#15803D", 0.14),
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 20px rgba(21,128,61,0.12)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: 155, overflow: "hidden", bgcolor: "#F3F4F6" }}>
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={item?.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ position: "absolute", top: 8, left: 8, right: 8, flexWrap: "wrap", gap: 0.5 }}
                    >
                      <Chip
                        size="small"
                        icon={
                          <Box
                            component="img"
                            src={LIVE_FARMING_BADGE}
                            alt=""
                            sx={{ width: 15, height: 15, ml: "4px !important", borderRadius: "4px" }}
                          />
                        }
                        label={isHarvestReady ? t("Harvest Ready") : t("Live Farming")}
                        sx={{
                          height: 22,
                          bgcolor: isHarvestReady ? "#15803D" : "#B45309",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "10.5px",
                        }}
                      />
                      <InsuranceBadge item={item} variant="compact" />
                    </Stack>
                  </Box>

                  <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item?.name}
                      </Typography>
                      <Typography sx={{ fontSize: "11.5px", color: "text.secondary", mt: 0.25 }}>
                        {item?.store_name || t("Verified Farm")}
                        {item?.origin_country ? ` · ${item.origin_country}` : ""}
                        {item?.is_backyard ? ` · ${t("Backyard")}` : ""}
                      </Typography>

                      <Box sx={{ mt: 1.25 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                          <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#15803D" }}>
                            {isHarvestReady
                              ? t("Ready for Dispatch")
                              : daysLeft !== null && daysLeft !== undefined
                              ? t("{{days}}d to harvest", { days: daysLeft })
                              : t("In Cultivation")}
                          </Typography>
                          <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "text.secondary" }}>
                            {progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, Math.max(5, progress))}
                          sx={{
                            height: 6,
                            borderRadius: 4,
                            bgcolor: alpha("#15803D", 0.12),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              bgcolor: isHarvestReady ? "#15803D" : "#D97706",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "14.5px", color: "#67513A" }}>
                        {getAmountWithSign(item?.price || 0)}
                      </Typography>
                      <Chip
                        size="small"
                        label={item?.pre_order_available ? t("Pre-Order") : t("View Crop")}
                        sx={{
                          height: 22,
                          fontSize: "11px",
                          fontWeight: 700,
                          bgcolor: alpha("#67513A", 0.1),
                          color: "#67513A",
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
