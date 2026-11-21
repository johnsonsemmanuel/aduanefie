import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Link from "next/link";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "components/seo";
import { useTranslation } from "react-i18next";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";
import { useGetFxRates } from "api-manage/hooks/react-query/trade/useGetFxRates";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { GHANA_UNIT_GUIDE, getGhanaSeasonalGuide } from "utils/agroGuidance";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";

const MarketPricesPage = ({ configData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    } else {
      configRefetch();
    }
  }, [configData, configRefetch, dispatch]);

  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig, dispatch]);

  const effectiveConfig = configData || dataConfig;
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  const [marketHub, setMarketHub] = useState("all");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("GHS");

  const {
    data,
    isLoading,
    isError: pricesError,
    refetch: refetchPrices,
  } = useGetAgroPrices({ category, marketHub, search });
  const { data: fxData, isError: fxError } = useGetFxRates();
  // Never present a hard-coded rate as current. Without live FX data we show
  // the GH₵ source prices and say so explicitly.
  const activeCurrency = fxError ? "GHS" : currency;
  const rate = Number(fxData?.rates?.[activeCurrency] || 1);
  const symbol = fxData?.symbols?.[activeCurrency] || "GH₵";
  const formatFx = (ghsAmount) => {
    const converted = Number(ghsAmount || 0) * rate;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const prices = data?.prices || [];
  const categories = data?.categories || [];
  const hubs = data?.hubs || [];

  return (
    <>
      <CssBaseline />
      <SEO
        title={`Ghana Agro Market Prices | ${effectiveConfig?.business_name || "Aduanefie"}`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <SimpleMobileHeader title="Market Prices" backHref="/trade" />
        <CustomContainer>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "12px",
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "22px", md: "28px" },
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("Ghana Agricultural Market Price Index")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      mt: 0.75,
                      maxWidth: 740,
                      fontSize: "14px",
                    }}
                  >
                    {t("Wholesale and retail commodity benchmarks managed from the Aduanefie trade desk across major Ghana market hubs.")}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Stakeholder Value Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, fontSize: "15px", color: theme.palette.primary.main, mb: 0.5 }}>
                      {t("For Farmers & Cooperatives")}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                      {t("Benchmark your farmgate and harvest-ready prices against GCX & MoFA hub rates so you never undersell at the farmgate.")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, fontSize: "15px", color: theme.palette.primary.main, mb: 0.5 }}>
                      {t("For Retailers & Bulk Buyers")}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                      {t("Compare wholesale bag/crate rates against retail market spreads and source insured cross-border or local bulk produce.")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, fontSize: "15px", color: theme.palette.primary.main, mb: 0.5 }}>
                      {t("For Remote Field Marketers")}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                      {t("Use live regional price spreads to onboard rural farms, verify harvest readiness, and earn commissions on verified marketplace supply.")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Filters */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: "12px", border: `1px solid ${theme.palette.divider}`, mb: 2.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t("Search commodity or market")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t("Category")}</InputLabel>
                    <Select value={category} label={t("Category")} onChange={(e) => setCategory(e.target.value)}>
                      <MenuItem value="all">{t("All Categories")}</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t("Market Hub")}</InputLabel>
                    <Select value={marketHub} label={t("Market Hub")} onChange={(e) => setMarketHub(e.target.value)}>
                      <MenuItem value="all">{t("All Hubs")}</MenuItem>
                      {hubs.map((hub) => (
                        <MenuItem key={hub} value={hub}>{hub}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t("Currency")}</InputLabel>
                    <Select
                      value={activeCurrency}
                      label={t("Currency")}
                      disabled={fxError}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <MenuItem value="GHS">GHS (GH₵)</MenuItem>
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="NGN">NGN (₦)</MenuItem>
                      <MenuItem value="XOF">XOF (CFA)</MenuItem>
                      <MenuItem value="KES">KES (KSh)</MenuItem>
                      <MenuItem value="ZAR">ZAR (R)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {fxError && (
              <Alert severity="info" sx={{ mb: 2.5, borderRadius: "12px" }}>
                {t("Live exchange rates are unavailable. Showing GH₵ reference prices.")}
              </Alert>
            )}

            {/* Ghana Seasonal Crop Guide & Standard Unit Reference */}
            {(() => {
              const guide = getGhanaSeasonalGuide();
              return (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    mb: 2.5,
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.success.main, 0.04),
                  }}
                >
                  <Stack spacing={1.25}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1}>
                      <Typography sx={{ fontWeight: 700, fontSize: "14px", color: theme.palette.text.primary }}>
                        {t("Ghana Seasonal Supply")}: {guide.seasonName} ({guide.monthsLabel})
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                        {t("Next harvest")}: {guide.harvestSoon}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography sx={{ fontSize: "12px", fontWeight: 600, color: theme.palette.text.secondary }}>
                        {t("Best Value / Peak Now:")}
                      </Typography>
                      {guide.peakCrops.map((crop) => (
                        <Chip
                          key={crop}
                          component={Link}
                          href={`/search?search_value=${encodeURIComponent(crop)}`}
                          clickable
                          size="small"
                          label={crop}
                          sx={{ fontSize: "11.5px", fontWeight: 600, height: 24 }}
                        />
                      ))}
                    </Stack>
                    <Typography sx={{ fontSize: "11.5px", color: theme.palette.text.secondary }}>
                      <strong>{t("Standard Ghana Units")}:</strong>{" "}
                      {GHANA_UNIT_GUIDE.map((u) => `${u.label} (${u.approx})`).join(" · ")}
                    </Typography>
                  </Stack>
                </Paper>
              );
            })()}

            {/* Price Table */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: `1px solid ${theme.palette.divider}`,
                overflowX: "auto",
                maxWidth: "100%",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Table sx={{ minWidth: 760 }}>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Commodity")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Market Hub")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Unit")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Wholesale")} ({activeCurrency})</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Retail")} ({activeCurrency})</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Retail Spread")}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Trend")}</TableCell>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Source")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{t("Actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={9}><Skeleton height={36} /></TableCell>
                      </TableRow>
                    ))
                  ) : pricesError ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        <Stack spacing={1.5} alignItems="center">
                          <Typography>{t("Could not load market prices.")}</Typography>
                          <Button size="small" onClick={() => refetchPrices()}>
                            {t("Retry")}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : prices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        {t("No market price data yet.")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    prices.map((row) => {
                      const wholesale = Number(row.wholesale_price_ghs || 0);
                      const retail = Number(row.retail_price_ghs || 0);
                      const spread = Math.max(0, retail - wholesale);
                      const spreadPct = wholesale > 0 ? ((spread / wholesale) * 100).toFixed(1) : "0.0";
                      const pct = Number(row.price_change_pct || 0);
                      const isUp = row.trend === "up" || pct > 0;
                      const isDown = row.trend === "down" || pct < 0;
                      const Icon = isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : TrendingFlatIcon;

                      return (
                        <TableRow key={row.id || row.commodity} hover>
                          <TableCell>
                            <Typography sx={{ fontWeight: 700, fontSize: "13.5px" }}>{row.commodity}</Typography>
                            <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>{row.category}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>{row.market_hub}</TableCell>
                          <TableCell sx={{ fontSize: "13px" }}>{row.unit}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            {formatFx(wholesale)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {formatFx(retail)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "12.5px", color: theme.palette.text.secondary, fontWeight: 600 }}>
                            +{formatFx(spread)} ({spreadPct}%)
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              icon={<Icon sx={{ fontSize: 14 }} />}
                              label={pct > 0 ? `+${pct}%` : `${pct}%`}
                              color={isUp ? "success" : isDown ? "error" : "default"}
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: "11px" }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={row.source_platform} sx={{ fontSize: "11px", fontWeight: 600 }} />
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                            <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                              <Button
                                component={Link}
                                href={`/search?search_value=${encodeURIComponent(row.commodity || "")}`}
                                size="small"
                                variant="contained"
                                sx={{ fontSize: "11.5px", py: 0.35, px: 1.2, textTransform: "none", borderRadius: "7px" }}
                              >
                                {t("Shop")}
                              </Button>
                              <Button
                                component={Link}
                                href={`/trade?commodity=${encodeURIComponent(row.commodity || "")}&unit=${encodeURIComponent(row.unit || "")}#rfq`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "11.5px", py: 0.35, px: 1.1, textTransform: "none", borderRadius: "7px" }}
                              >
                                {t("Bulk RFQ")}
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>

            {/* Mobile cards: same data, no horizontal scrolling. */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {isLoading ? (
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} elevation={0} sx={{ borderRadius: "12px", p: 2 }}>
                      <Skeleton height={20} />
                      <Skeleton height={36} sx={{ mt: 1 }} />
                    </Card>
                  ))}
                </Stack>
              ) : pricesError ? (
                <Alert
                  severity="error"
                  action={<Button size="small" onClick={() => refetchPrices()}>{t("Retry")}</Button>}
                  sx={{ borderRadius: "12px" }}
                >
                  {t("Could not load market prices.")}
                </Alert>
              ) : prices.length === 0 ? (
                <Paper elevation={0} sx={{ p: 3, textAlign: "center", borderRadius: "12px", color: "text.secondary" }}>
                  {t("No market price data yet.")}
                </Paper>
              ) : (
                <Stack spacing={1.5}>
                  {prices.map((row) => {
                    const wholesale = Number(row.wholesale_price_ghs || 0);
                    const retail = Number(row.retail_price_ghs || 0);
                    const spread = Math.max(0, retail - wholesale);
                    const spreadPct = wholesale > 0 ? ((spread / wholesale) * 100).toFixed(1) : "0.0";
                    const pct = Number(row.price_change_pct || 0);
                    const isUp = row.trend === "up" || pct > 0;
                    const isDown = row.trend === "down" || pct < 0;
                    const Icon = isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : TrendingFlatIcon;
                    return (
                      <Card key={row.id || row.commodity} elevation={0} sx={{ borderRadius: "12px", border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: "15px" }}>{row.commodity}</Typography>
                              <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                                {row.category} · {row.market_hub} · {row.unit}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              icon={<Icon sx={{ fontSize: 14 }} />}
                              label={pct > 0 ? `+${pct}%` : `${pct}%`}
                              color={isUp ? "success" : isDown ? "error" : "default"}
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: "11px", whiteSpace: "nowrap" }}
                            />
                          </Stack>
                          <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                            <Box flex={1}>
                              <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>{t("Wholesale")}</Typography>
                              <Typography sx={{ fontWeight: 700, color: "primary.main", fontSize: "14px" }}>{formatFx(wholesale)}</Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>{t("Retail")}</Typography>
                              <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>{formatFx(retail)}</Typography>
                            </Box>
                            <Box flex={1}>
                              <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>{t("Spread")}</Typography>
                              <Typography sx={{ fontSize: "12.5px", fontWeight: 600 }}>
                                +{formatFx(spread)} ({spreadPct}%)
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                            <Chip size="small" label={row.source_platform} sx={{ fontSize: "11px" }} />
                            <Stack direction="row" spacing={0.75}>
                              <Button
                                component={Link}
                                href={`/search?search_value=${encodeURIComponent(row.commodity || "")}`}
                                size="small"
                                variant="contained"
                                sx={{ fontSize: "11.5px", py: 0.35, px: 1.25, textTransform: "none", borderRadius: "7px" }}
                              >
                                {t("Shop")}
                              </Button>
                              <Button
                                component={Link}
                                href={`/trade?commodity=${encodeURIComponent(row.commodity || "")}&unit=${encodeURIComponent(row.unit || "")}#rfq`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "11.5px", py: 0.35, px: 1.1, textTransform: "none", borderRadius: "7px" }}
                              >
                                {t("Bulk RFQ")}
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default MarketPricesPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "market_prices");
};
