import React from "react";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { parseList } from "./tradeData";

const BlocCard = ({ bloc, onOpen }) => {
  const { t } = useTranslation();
  const members = parseList(bloc.member_countries);
  const currencies = parseList(bloc.primary_currencies);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          p: { xs: "20px", md: "24px" },
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" gap="12px">
          <Typography
            component="h3"
            sx={{ fontSize: "17px", fontWeight: 700, lineHeight: 1.3 }}
          >
            {bloc.name}
          </Typography>
          {bloc.status === "active" && (
            <Chip
              label={t("Active")}
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography sx={{ fontSize: "13.5px", color: "text.secondary" }}>
          {bloc.description}
        </Typography>

        <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
          {t("{{count}} member countries", { count: members.length })}
        </Typography>

        {currencies.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap="6px">
            {currencies.slice(0, 4).map((currency) => (
              <Chip
                key={currency}
                label={currency}
                size="small"
                variant="outlined"
              />
            ))}
            {currencies.length > 4 && (
              <Typography
                component="span"
                sx={{ fontSize: "12px", color: "text.secondary", alignSelf: "center" }}
              >
                +{currencies.length - 4}
              </Typography>
            )}
          </Stack>
        )}

        <Box sx={{ mt: "auto", pt: "8px" }}>
          <Button variant="outlined" size="small" onClick={() => onOpen(bloc)}>
            {t("View corridors")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlocCard;
