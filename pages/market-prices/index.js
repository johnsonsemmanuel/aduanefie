import React, { useEffect, useState } from "react";
import {
  Box,
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
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import { useTranslation } from "react-i18next";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";
import { useGetFxRates } from "api-manage/hooks/react-query/trade/useGetFxRates";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
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

  const { data, isLoading } = useGetAgroPrices({ category, marketHub, search });
  const { data: fxData } = useGetFxRates();
  const rate = Number(fxData?.rates?.[currency] || 1);
  const symbol = fxData?.symbols?.[currency] || "GH₵";
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
                  <Chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    label={t("LIVE GHANA AGRO INTELLIGENCE · GCX · MoFA SRID · ESOKO")}
                    sx={{ fontWeight: 600, mb: 1.25 }}
                  />
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
                    {t("Real-time wholesale and retail commodity benchmarks across Ejura, Techiman, Tamale, Kumasi Central, and Agbogbloshie — built to empower Farmers, Retailers, and Remote Field Marketers.")}
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
                    <Select value={currency} label={t("Currency")} onChange={(e) => setCurrency(e.target.value)}>
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

            {/* Price Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: `1px solid ${theme.palette.divider}` }}>
              <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Commodity")}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Market Hub")}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Unit")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{t("Wholesale")} ({currency})</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{t("Retail")} ({currency})</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{t("Retail Spread")}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{t("Trend")}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Source")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}><Skeleton height={36} /></TableCell>
                      </TableRow>
                    ))
                  ) : prices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        {t("No matching market price entries found.")}
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
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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
