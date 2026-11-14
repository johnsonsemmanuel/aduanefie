import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
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
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import { useTranslation } from "react-i18next";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";

const MarketPricesPage = ({ configData }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  const [marketHub, setMarketHub] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAgroPrices({ category, marketHub, search });
  const prices = data?.prices || [];
  const categories = data?.categories || [];
  const hubs = data?.hubs || [];

  return (
    <>
      <SEO title={`Ghana Agro Market Prices | ${configData?.business_name || "Aduanefie"}`} />
      <MainLayout configData={configData}>
        <CustomContainer>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Box
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "16px",
                background: "linear-gradient(135deg, #14532D 0%, #67513A 100%)",
                color: "#FFFFFF",
                mb: 3,
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Chip
                    size="small"
                    label={t("LIVE GHANA AGRO INTELLIGENCE · GCX · MoFA SRID · ESOKO")}
                    sx={{ bgcolor: alpha("#FFFFFF", 0.16), color: "#FEF3C7", fontWeight: 700, mb: 1 }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "22px", md: "28px" } }}>
                    {t("Ghana Agricultural Market Price Index")}
                  </Typography>
                  <Typography sx={{ opacity: 0.9, mt: 0.75, maxWidth: 740, fontSize: "14px" }}>
                    {t("Real-time wholesale and retail commodity benchmarks across Ejura, Techiman, Tamale, Kumasi Central, and Agbogbloshie — built to empower Farmers, Retailers, and Remote Field Marketers.")}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Stakeholder Value Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid", borderColor: alpha("#15803D", 0.2) }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#15803D", mb: 0.5 }}>
                      {t("For Farmers & Cooperatives")}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                      {t("Benchmark your farmgate and harvest-ready prices against GCX & MoFA hub rates so you never undersell at the farmgate.")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid", borderColor: alpha("#67513A", 0.2) }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#67513A", mb: 0.5 }}>
                      {t("For Retailers & Bulk Buyers")}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                      {t("Compare wholesale bag/crate rates against retail market spreads and source insured cross-border or local bulk produce.")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%", borderRadius: "12px", border: "1px solid", borderColor: alpha("#D97706", 0.25) }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#B45309", mb: 0.5 }}>
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
            <Paper sx={{ p: 2, borderRadius: "12px", mb: 2.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t("Search commodity or market")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
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
                <Grid item xs={12} sm={4}>
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
              </Grid>
            </Paper>

            {/* Price Table */}
            <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
              <Table>
                <TableHead sx={{ bgcolor: "#FAF8F5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Commodity")}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Market Hub")}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t("Unit")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{t("Wholesale (GH₵)")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{t("Retail (GH₵)")}</TableCell>
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
                          <TableCell align="right" sx={{ fontWeight: 700, color: "#15803D" }}>
                            GH₵{wholesale.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            GH₵{retail.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "12.5px", color: "#67513A", fontWeight: 600 }}>
                            +GH₵{spread.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({spreadPct}%)
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
