import React from "react";
import { Box, Chip, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useGetForYouItems } from "api-manage/hooks/react-query/useGetForYouItems";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { getToken } from "helper-functions/getToken";

const PickedForYouSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isLoggedIn = Boolean(getToken());

  const { data, isLoading } = useGetForYouItems({ limit: 8, offset: 1 });
  const items = data?.items ?? [];
  const isPersonalized = Boolean(data?.personalized);

  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: "1320px",
        width: "100%",
        mx: "auto",
        px: { xs: "16px", md: "0px" },
        py: { xs: "18px", md: "26px" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        sx={{ mb: { xs: "12px", md: "16px" } }}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "22px" },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {isPersonalized ? t("Picked For You") : t("Smart Picks Near You")}
            </Typography>
            <Chip
              size="small"
              label={isPersonalized ? t("Tailored") : t("Trending")}
              sx={{
                height: "22px",
                fontSize: "11px",
                fontWeight: 700,
                bgcolor: theme.palette.background.secondary || "#EFE7D3",
                color: theme.palette.primary.deep || "#67513A",
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", mt: 0.25 }}>
            {isPersonalized
              ? t("Recommended from your interests, orders, and favourite farms.")
              : t("Top produce, group buys, and fresh harvests in your area.")}
          </Typography>
        </Box>

        {isLoggedIn && (
          <Chip
            size="small"
            clickable
            onClick={() => router.push("/interest")}
            icon={<i className="fi fi-rr-sliders-h" style={{ fontSize: "12px", marginLeft: "6px" }} />}
            label={t("Tune Preferences")}
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: "12px",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
          />
        )}
      </Stack>

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Skeleton variant="rounded" height={240} sx={{ borderRadius: "12px" }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.slice(0, 8).map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.id}>
              <Box sx={{ position: "relative", height: "100%" }}>
                {item?.recommendation_reason && (
                  <Box
                    sx={{
                      mb: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      px: "8px",
                      py: "2px",
                      borderRadius: "999px",
                      bgcolor: theme.palette.background.secondary || "#EFE7D3",
                      color: theme.palette.primary.deep || "#67513A",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {t(item.recommendation_reason)}
                  </Box>
                )}
                <NewProductCard item={item} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PickedForYouSection;
