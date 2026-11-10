import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../src/components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CustomContainer from "../../../src/components/container";
import SEO from "../../../src/components/seo";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import {
  useTradeBlocCorridors,
  useTradeBlocWithFallback,
} from "api-manage/hooks/react-query/trade/useTradeData";
import {
  getWholesaleMarketHref,
  parseList,
  TRADE_API_ENABLED,
} from "components/trade/tradeData";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const TradeBlocDetail = ({ slug, configData, metaData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { bloc } = useTradeBlocWithFallback(slug);
  const { data: corridors = [], isError: corridorsError } =
    useTradeBlocCorridors(slug);
  const liveCorridorsUnavailable = !TRADE_API_ENABLED || corridorsError;

  const metadata = processMetadata(metaData, {
    title: `${bloc?.name || "Trade bloc"} - ${configData?.business_name}`,
    description:
      bloc?.description ||
      "Freight corridors and member-country information for an African regional trade bloc.",
    image: configData?.logo_full_url,
  });

  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }

  if (!bloc) {
    return (
      <>
        <CssBaseline />
        <SEO
          title={metadata.title}
          description={metadata.description}
          image={metadata.image}
          configData={configData}
        />
        <MainLayout configData={configData}>
          <SimpleMobileHeader title="Trade Bloc" backHref="/trade/blocs" />
          <CustomContainer>
            <Box sx={{ py: "40px" }}>
              <Typography component="h1" sx={{ fontSize: "24px", fontWeight: 700 }}>
                {t("Trade bloc not found")}
              </Typography>
              <Typography sx={{ mt: "8px", color: "text.secondary" }}>
                {t("This bloc is not available. Browse the other regional blocs instead.")}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: "20px" }}
                onClick={() => router.push("/trade/blocs")}
              >
                {t("Back to trade blocs")}
              </Button>
            </Box>
          </CustomContainer>
        </MainLayout>
      </>
    );
  }

  const members = parseList(bloc.member_countries);
  const currencies = parseList(bloc.primary_currencies);

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <SimpleMobileHeader title={bloc.name} backHref="/trade/blocs" />
        <CustomContainer>
          <Box sx={{ py: { xs: "16px", md: "32px" } }}>
            <Button
              size="small"
              onClick={() => router.push("/trade/blocs")}
              sx={{ mb: "12px", display: { xs: "none", md: "inline-flex" } }}
            >
              ← {t("All trade blocs")}
            </Button>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "24px", md: "34px" },
                fontWeight: 700,
                letterSpacing: "-0.8px",
                lineHeight: 1.2,
              }}
            >
              {bloc.name}
            </Typography>
            <Typography
              sx={{
                mt: "10px",
                maxWidth: "720px",
                fontSize: "14.5px",
                lineHeight: 1.55,
                color: "text.secondary",
              }}
            >
              {bloc.description}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap="8px" sx={{ mt: "16px" }}>
              <Chip
                label={t("{{count}} member countries", { count: members.length })}
                size="small"
              />
              <Chip
                label={t("{{count}} currencies", { count: currencies.length })}
                size="small"
                variant="outlined"
              />
              <Chip
                label={t("{{count}} active corridors", { count: corridors.length })}
                size="small"
                variant="outlined"
              />
              {bloc.website && (
                <Chip
                  component="a"
                  href={bloc.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  label={t("Official website")}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>

            <Box
              sx={{
                mt: { xs: "24px", md: "32px" },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1.9fr" },
                gap: "16px",
                alignItems: "start",
              }}
            >
              {/* Member countries & currencies */}
              <Box
                sx={{
                  p: { xs: "18px", md: "22px" },
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                  {t("Member countries")}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="6px" sx={{ mt: "12px" }}>
                  {members.map((country) => (
                    <Chip key={country} label={country} size="small" />
                  ))}
                </Stack>

                <Typography sx={{ fontSize: "16px", fontWeight: 700, mt: "22px" }}>
                  {t("Primary currencies")}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="6px" sx={{ mt: "12px" }}>
                  {currencies.map((currency) => (
                    <Chip
                      key={currency}
                      label={currency}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Corridors */}
              <Box
                sx={{
                  p: { xs: "18px", md: "22px" },
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                  {t("Trade corridors")}
                </Typography>
                <Typography
                  sx={{ mt: "6px", fontSize: "13.5px", color: "text.secondary" }}
                >
                  {t(
                    "Indicative trucking rates and transit times for cross-border lanes inside this bloc."
                  )}
                </Typography>

                {corridors.length > 0 ? (
                  <TableContainer component={Paper} sx={{ mt: "14px", boxShadow: "none" }}>
                    <Table sx={{ minWidth: 560 }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("Route")}</TableCell>
                          <TableCell align="right">{t("Distance")}</TableCell>
                          <TableCell align="right">{t("Transit")}</TableCell>
                          <TableCell align="right">{t("Rate/ton")}</TableCell>
                          <TableCell align="center">{t("Cold chain")}</TableCell>
                          <TableCell align="center">{t("Warehousing")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {corridors.map((corridor) => (
                          <TableRow key={corridor.id ?? `${corridor.origin_country}-${corridor.destination_country}`}>
                            <TableCell>
                              {corridor.corridor_name ||
                                `${corridor.origin_country} → ${corridor.destination_country}`}
                            </TableCell>
                            <TableCell align="right">
                              {corridor.distance_km
                                ? `${Math.round(corridor.distance_km)} km`
                                : "—"}
                            </TableCell>
                            <TableCell align="right">
                              {corridor.transit_days_estimate
                                ? `${corridor.transit_days_estimate} d`
                                : "—"}
                            </TableCell>
                            <TableCell align="right">
                              {corridor.trucking_rate_per_ton_usd
                                ? money(corridor.trucking_rate_per_ton_usd)
                                : "—"}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={corridor.cold_chain_available ? t("Yes") : t("No")}
                                size="small"
                                color={corridor.cold_chain_available ? "success" : "default"}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={corridor.warehousing_available ? t("Yes") : t("No")}
                                size="small"
                                color={corridor.warehousing_available ? "success" : "default"}
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{
                      mt: "14px",
                      p: "18px",
                      borderRadius: "14px",
                      bgcolor: "background.secondary",
                    }}
                  >
                    <Typography sx={{ fontSize: "13.5px", color: "text.secondary" }}>
                      {liveCorridorsUnavailable
                        ? t(
                            "Live corridor data is not available yet. It will appear here once the trade service is switched on."
                          )
                        : t("No active corridors are configured for this bloc yet.")}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: "12px" }}
                      onClick={() => router.push(getWholesaleMarketHref())}
                    >
                      {t("Browse wholesale commodities")}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                mt: { xs: "24px", md: "32px" },
                p: { xs: "18px", md: "24px" },
                borderRadius: "20px",
                bgcolor: "background.secondary",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: "14px",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                  {t("Ready to move produce?")}
                </Typography>
                <Typography sx={{ mt: "4px", fontSize: "13.5px", color: "text.secondary" }}>
                  {t(
                    "Shop the wholesale market now. Quote requests for cross-border shipments are coming next."
                  )}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => router.push(getWholesaleMarketHref())}
              >
                {t("Shop Wholesale Market")}
              </Button>
            </Box>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default TradeBlocDetail;

export const getServerSideProps = async (context) => {
  const result = await getCommonServerSideProps(context, "trade_bloc_page");
  if (result?.redirect) return result;
  return {
    ...result,
    props: {
      ...result.props,
      slug: context.params?.slug ?? null,
    },
  };
};
