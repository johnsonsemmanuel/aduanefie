import React from "react";
import { Box, Button, Card, Chip, Skeleton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import useGetMyOrdersList from "api-manage/hooks/react-query/order/useGetMyOrdersList";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";

const EARTH_BORDER = "#E0D6BD";
const EARTH_DARK = "#4F3E2C";
const OLIVE_GREEN = "#8B9F69";

export default function MyBookings() {
  const { t } = useTranslation();
  const token = getToken();
  const moduleId = getModuleId();

  const { data: runningData, isLoading } = useGetMyOrdersList(
    { orderType: "running-orders", offset: 1, moduleId },
    !!token
  );

  const bookings = runningData?.orders ?? [];

  if (!token) {
    return (
      <Card
        elevation={0}
        sx={{ p: 3, borderRadius: "16px", border: `1px solid ${EARTH_BORDER}`, bgcolor: "#FAF8F5" }}
      >
        <Typography variant="body1" color={EARTH_DARK}>
          {t("Please sign in to view your service bookings.")}
        </Typography>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={96} />
        <Skeleton variant="rounded" height={96} />
      </Stack>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: `1px solid ${EARTH_BORDER}`,
          bgcolor: "#FAF8F5",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
          {t("No Active Service Bookings")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          {t("Schedule tractor hire, spraying, or agronomy visits from Agro Services.")}
        </Typography>
        <Button
          component={Link}
          href="/home"
          variant="contained"
          sx={{ bgcolor: OLIVE_GREEN, color: "#FFFFFF" }}
        >
          {t("Explore Agro Services")}
        </Button>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          elevation={0}
          sx={{ p: 2.5, borderRadius: "16px", border: `1px solid ${EARTH_BORDER}` }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                {t("Booking")} #{booking.id} • {booking?.store?.name || t("Service Provider")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {booking?.schedule_at || booking?.created_at}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                size="small"
                label={(booking?.order_status || "pending").replace(/_/g, " ")}
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
              />
              <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                {getAmountWithSign(booking?.order_amount ?? 0)}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
