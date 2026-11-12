import React from "react";
import { Button, Card, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import CustomContainer from "components/container";

export default function CreateCustomService() {
  const { t } = useTranslation();

  return (
    <CustomContainer sx={{ py: 5 }}>
      <Card
        elevation={0}
        sx={{
          maxWidth: 640,
          mx: "auto",
          p: 4,
          borderRadius: "20px",
          border: "1px solid #E0D6BD",
          bgcolor: "#FAF8F5",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="#4F3E2C" sx={{ mb: 1 }}>
          {t("Request Custom Farm Mechanization or Agro Service")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t(
            "Select from verified contractors and schedule tractor hiring, field spraying, soil testing, or irrigation setup directly."
          )}
        </Typography>
        <Button
          component={Link}
          href="/service/all-providers"
          variant="contained"
          sx={{ bgcolor: "#8B9F69", color: "#FFFFFF", fontWeight: 600, px: 3, py: 1.2 }}
        >
          {t("Browse Verified Service Providers")}
        </Button>
      </Card>
    </CustomContainer>
  );
}
