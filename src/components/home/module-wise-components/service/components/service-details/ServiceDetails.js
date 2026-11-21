import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CallIcon from "@mui/icons-material/Call";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getServiceCardPricing } from "../common/ServiceCardPricing";

const EARTH_BORDER = "#E0D6BD";
const EARTH_DARK = "#4F3E2C";
const EARTH_ACCENT = "#67513A";
const OLIVE_GREEN = "#8B9F69";
const WARM_SAND = "#EFE7D3";

export const SERVICE_BOOKING_DRAFT_KEY = "aduanefie_service_booking";

// Tapping a time field on mobile normally opens the keyboard. Offer fixed
// 30-minute slots instead, matching the checkout scheduling sheet.
const SERVICE_TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

// dayjs only parses "HH:mm" with the customParseFormat plugin, which is not
// registered here. Format the fixed slots directly so we never render
// "Invalid Date" in the picker.
const formatTimeSlot = (value) => {
  const [hours, minutes] = String(value || "").split(":");
  const hourNumber = Number(hours);
  if (!Number.isFinite(hourNumber) || minutes === undefined) return value || "";
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = hourNumber % 12 === 0 ? 12 : hourNumber % 12;
  return `${displayHour}:${minutes} ${suffix}`;
};

export default function ServiceProductDetails({ serviceDetailsData }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { profileInfo } = useSelector((state) => state.profileInfo);

  const defaultDate = useMemo(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const defaultLocation =
    typeof window !== "undefined" ? localStorage.getItem("location") || "" : "";

  const [scheduleDate, setScheduleDate] = useState(defaultDate);
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [quantity, setQuantity] = useState(1);
  const [farmLocation, setFarmLocation] = useState(defaultLocation);
  const [contactName, setContactName] = useState(
    profileInfo?.f_name ? `${profileInfo.f_name} ${profileInfo.l_name || ""}`.trim() : ""
  );
  const [contactPhone, setContactPhone] = useState(profileInfo?.phone || "");
  const [notes, setNotes] = useState("");

  if (!serviceDetailsData) {
    return (
      <Card
        elevation={0}
        sx={{
          my: 5,
          p: 4,
          borderRadius: "16px",
          border: `1px solid ${EARTH_BORDER}`,
          bgcolor: "#FAF8F5",
        }}
      >
        <Typography variant="h6" color={EARTH_DARK}>
          {t("Service package not found.")}
        </Typography>
      </Card>
    );
  }

  const { displayPrice, originalPrice } = getServiceCardPricing(serviceDetailsData);
  const qtyNum = Math.max(1, Number(quantity) || 1);
  const estimatedTotal = displayPrice * qtyNum;
  const plainDescription = (serviceDetailsData?.description || "").replace(/<[^>]*>/g, "");

  const handleProceedToBooking = (e) => {
    e.preventDefault();
    if (!scheduleDate || !farmLocation.trim()) {
      toast.error(t("Please choose a preferred service date and farm/site location."));
      return;
    }

    const draft = {
      service: serviceDetailsData,
      quantity: qtyNum,
      unitPrice: displayPrice,
      estimatedTotal,
      scheduleDate,
      scheduleTime,
      scheduleAt: `${scheduleDate} ${scheduleTime}:00`,
      farmLocation: farmLocation.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      notes: notes.trim(),
    };

    try {
      sessionStorage.setItem(SERVICE_BOOKING_DRAFT_KEY, JSON.stringify(draft));
      router.push("/service/checkout");
    } catch {
      toast.error(t("Unable to save booking draft in your browser."));
    }
  };

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Grid container spacing={4}>
        {/* Left: Service Description & Provider */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              border: `1px solid ${EARTH_BORDER}`,
              bgcolor: "#FFFFFF",
            }}
          >
            <Box sx={{ height: { xs: 220, md: 340 }, bgcolor: WARM_SAND }}>
              <img
                src={serviceDetailsData?.image_full_url || "/static/no-image-found.png"}
                alt={serviceDetailsData.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }} flexWrap="wrap">
                <Chip
                  size="small"
                  label={serviceDetailsData?.unit_type || t("Per Service")}
                  sx={{ bgcolor: WARM_SAND, color: EARTH_DARK, fontWeight: 700 }}
                />
                {serviceDetailsData?.category_name && (
                  <Chip
                    size="small"
                    label={serviceDetailsData.category_name}
                    sx={{ bgcolor: "#FAF8F5", border: `1px solid ${EARTH_BORDER}` }}
                  />
                )}
              </Stack>

              <Typography variant="h4" fontWeight={700} color={EARTH_DARK} sx={{ mb: 1 }}>
                {serviceDetailsData.name}
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="baseline" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700} color={OLIVE_GREEN}>
                  {displayPrice > 0 ? getAmountWithSign(displayPrice) : t("Custom Quote")}
                </Typography>
                {serviceDetailsData?.unit_type && displayPrice > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    / {serviceDetailsData.unit_type}
                  </Typography>
                )}
                {originalPrice > displayPrice && (
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: "text.secondary" }}
                  >
                    {getAmountWithSign(originalPrice)}
                  </Typography>
                )}
              </Stack>

              <Divider sx={{ borderColor: WARM_SAND, my: 2 }} />

              <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK} sx={{ mb: 1 }}>
                {t("Scope of Work & Details")}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {plainDescription ||
                  t("Verified agricultural contractor dispatch tailored to your farm location.")}
              </Typography>

              {serviceDetailsData?.store_id && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "#FAF8F5",
                    border: `1px solid ${EARTH_BORDER}`,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1.5}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <StorefrontIcon sx={{ color: EARTH_ACCENT }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("Service Provider")}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                          {serviceDetailsData.store_name}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        component={Link}
                        href={`/service/provider/${serviceDetailsData.store_id}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: EARTH_ACCENT, color: EARTH_DARK }}
                      >
                        {t("View Provider")}
                      </Button>
                      {serviceDetailsData?.store_phone && (
                        <Button
                          component="a"
                          href={`tel:${serviceDetailsData.store_phone}`}
                          size="small"
                          startIcon={<CallIcon />}
                          sx={{ color: OLIVE_GREEN }}
                        >
                          {t("Call")}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Booking Form */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            component="form"
            onSubmit={handleProceedToBooking}
            sx={{
              borderRadius: "20px",
              border: `1px solid ${EARTH_BORDER}`,
              bgcolor: "#FAF8F5",
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CalendarMonthIcon sx={{ color: EARTH_ACCENT }} />
              <Typography variant="h6" fontWeight={700} color={EARTH_DARK}>
                {t("Schedule Service Booking")}
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <DatePicker
                      label={t("Preferred Date")}
                      value={scheduleDate ? dayjs(scheduleDate) : null}
                      minDate={dayjs(defaultDate)}
                      onChange={(newValue) =>
                        setScheduleDate(
                          newValue?.isValid() ? newValue.format("YYYY-MM-DD") : "",
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          sx={{ bgcolor: "#FFFFFF" }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Select
                      fullWidth
                      value={scheduleTime || ""}
                      displayEmpty
                      label={t("Start Time")}
                      inputProps={{ "aria-label": t("Start Time") }}
                      renderValue={(value) =>
                        value ? formatTimeSlot(value) : t("Select time")
                      }
                      onChange={(e) => setScheduleTime(e.target.value)}
                      sx={{ bgcolor: "#FFFFFF" }}
                    >
                      {SERVICE_TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot} value={slot}>
                          {formatTimeSlot(slot)}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <TextField
                fullWidth
                required
                type="number"
                label={`${t("Service Units / Acreage")} (${
                  serviceDetailsData?.unit_type || t("Units")
                })`}
                inputProps={{ min: 1 }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ bgcolor: "#FFFFFF" }}
              />

              <TextField
                fullWidth
                required
                label={t("Farm / Site Location")}
                placeholder={t("Town, district, or landmark for team dispatch")}
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                sx={{ bgcolor: "#FFFFFF" }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t("Contact Person")}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    sx={{ bgcolor: "#FFFFFF" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t("Phone Number")}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    sx={{ bgcolor: "#FFFFFF" }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("Job Instructions / Crop Details")}
                placeholder={t("Terrain notes, crop type, equipment clearance, or special needs...")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ bgcolor: "#FFFFFF" }}
              />

              <Divider sx={{ borderColor: EARTH_BORDER }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight={600} color={EARTH_DARK}>
                  {t("Estimated Booking Total")}
                </Typography>
                <Typography variant="h6" fontWeight={700} color={EARTH_DARK}>
                  {estimatedTotal > 0 ? getAmountWithSign(estimatedTotal) : t("Quote on Inspection")}
                </Typography>
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  bgcolor: OLIVE_GREEN,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "10px",
                  py: 1.4,
                  "&:hover": { bgcolor: "#778B56" },
                }}
              >
                {t("Continue to Booking Confirmation")}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
