import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainApi from "api-manage/MainApi";
import CustomContainer from "components/container";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId, getToken } from "helper-functions/getToken";
import { SERVICE_BOOKING_DRAFT_KEY } from "../service-details/ServiceDetails";

const EARTH_BORDER = "#E0D6BD";
const EARTH_DARK = "#4F3E2C";
const EARTH_ACCENT = "#67513A";
const OLIVE_GREEN = "#8B9F69";
const WARM_SAND = "#EFE7D3";

export default function ServiceCheckoutPage() {
  const { t } = useTranslation();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const token = getToken();

  const [draft, setDraft] = useState(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SERVICE_BOOKING_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDraft(parsed);
        setContactName(
          parsed?.contactName ||
            (profileInfo?.f_name
              ? `${profileInfo.f_name} ${profileInfo.l_name || ""}`.trim()
              : "")
        );
        setContactPhone(parsed?.contactPhone || profileInfo?.phone || "");
        setContactEmail(profileInfo?.email || "");
      }
    } catch {
      setDraft(null);
    }
  }, [profileInfo?.f_name, profileInfo?.phone, profileInfo?.email]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!draft?.service?.id) return;

    if (!token && (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim())) {
      toast.error(t("Please enter your contact name, phone number, and email to confirm booking."));
      return;
    }

    setSubmitting(true);
    try {
      const guestId = token ? undefined : getGuestId() || `guest-${Date.now()}`;
      const moduleHeaders = draft?.service?.module_id
        ? { headers: { moduleId: draft.service.module_id } }
        : undefined;

      // Clear prior cart items in this module cleanly before attaching the service booking item
      try {
        await MainApi.delete(
          guestId
            ? `/api/v1/customer/cart/remove?guest_id=${encodeURIComponent(guestId)}`
            : "/api/v1/customer/cart/remove",
          moduleHeaders
        );
      } catch {
        // Empty cart is fine
      }

      await MainApi.post(
        "/api/v1/customer/cart/add",
        {
          item_id: draft.service.id,
          model: "Item",
          price: Number(draft.unitPrice || draft.service.price || 0),
          quantity: Number(draft.quantity || 1),
          variation: [],
          add_on_ids: [],
          add_on_qtys: [],
          ...(guestId ? { guest_id: guestId } : {}),
        },
        moduleHeaders
      );

      let latLng = { lat: 0, lng: 0 };
      try {
        const storedLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
        if (storedLatLng?.lat && storedLatLng?.lng) latLng = storedLatLng;
      } catch {
        // keep defaults
      }

      const orderNoteParts = [
        `SERVICE BOOKING`,
        `Date: ${draft.scheduleDate} ${draft.scheduleTime}`,
        `Site: ${draft.farmLocation}`,
        draft.notes ? `Notes: ${draft.notes}` : "",
      ].filter(Boolean);

      const orderRes = await MainApi.post(
        "/api/v1/customer/order/place",
        {
          order_amount: Number(draft.estimatedTotal || draft.unitPrice || 0),
          payment_method: "cash_on_delivery",
          order_type: "take_away",
          store_id: draft.service.store_id,
          distance: 0,
          address: draft.farmLocation,
          longitude: String(latLng.lng ?? 0),
          latitude: String(latLng.lat ?? 0),
          schedule_at: draft.scheduleAt,
          order_note: orderNoteParts.join(" | "),
          ...(guestId
            ? {
                guest_id: guestId,
                contact_person_name: contactName.trim(),
                contact_person_number: contactPhone.trim(),
                contact_person_email: contactEmail.trim(),
              }
            : {
                contact_person_name: contactName.trim() || undefined,
                contact_person_number: contactPhone.trim() || undefined,
              }),
        },
        moduleHeaders
      );

      const newOrderId =
        orderRes?.data?.order_id ?? orderRes?.data?.content?.order_id ?? "Submitted";
      setConfirmedOrderId(newOrderId);
      sessionStorage.removeItem(SERVICE_BOOKING_DRAFT_KEY);
      toast.success(t("Service booking confirmed successfully."));
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        t("Could not submit booking. Please verify your details or sign in first.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrderId) {
    return (
      <CustomContainer sx={{ py: 6 }}>
        <Card
          elevation={0}
          sx={{
            maxWidth: 620,
            mx: "auto",
            p: 4,
            borderRadius: "20px",
            border: `1px solid ${EARTH_BORDER}`,
            bgcolor: "#FAF8F5",
            textAlign: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 56, color: OLIVE_GREEN, mb: 1.5 }} />
          <Typography variant="h5" fontWeight={700} color={EARTH_DARK}>
            {t("Service Booking Confirmed")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {t("Booking Reference")}: <strong>#{confirmedOrderId}</strong>.{" "}
            {t("The service provider will review your farm schedule and confirm dispatch.")}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/profile?page=my-orders"
              variant="contained"
              sx={{ bgcolor: OLIVE_GREEN, color: "#FFFFFF", fontWeight: 600 }}
            >
              {t("View My Bookings")}
            </Button>
            <Button
              component={Link}
              href="/home"
              variant="outlined"
              sx={{ borderColor: EARTH_ACCENT, color: EARTH_DARK }}
            >
              {t("Back to Services")}
            </Button>
          </Stack>
        </Card>
      </CustomContainer>
    );
  }

  if (!draft) {
    return (
      <CustomContainer sx={{ py: 6 }}>
        <Card
          elevation={0}
          sx={{
            maxWidth: 560,
            mx: "auto",
            p: 4,
            borderRadius: "20px",
            border: `1px solid ${EARTH_BORDER}`,
            bgcolor: "#FAF8F5",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700} color={EARTH_DARK}>
            {t("No Active Service Booking")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {t("Select a mechanization crew, spraying team, or agro service first to schedule a booking.")}
          </Typography>
          <Button
            component={Link}
            href="/home"
            variant="contained"
            sx={{ bgcolor: OLIVE_GREEN, color: "#FFFFFF" }}
          >
            {t("Browse Services")}
          </Button>
        </Card>
      </CustomContainer>
    );
  }

  return (
    <CustomContainer sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h5" fontWeight={700} color={EARTH_DARK} sx={{ mb: 3 }}>
        {t("Confirm Service Booking")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            component="form"
            id="service-booking-confirm-form"
            onSubmit={handleConfirmBooking}
            sx={{
              borderRadius: "20px",
              border: `1px solid ${EARTH_BORDER}`,
              bgcolor: "#FFFFFF",
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} color={EARTH_DARK} sx={{ mb: 2 }}>
              {t("On-Site Contact Details")}
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label={t("Contact Person Name")}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <TextField
                fullWidth
                required
                label={t("Phone Number")}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              {!token && (
                <TextField
                  fullWidth
                  required
                  type="email"
                  label={t("Email Address")}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              )}
              <Alert severity="info" sx={{ bgcolor: WARM_SAND, color: EARTH_DARK }}>
                {t("Payment is settled directly as Cash on Service Completion unless agreed otherwise with the provider.")}
              </Alert>
              <Button
                type="submit"
                disabled={submitting}
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
                {submitting ? t("Confirming Booking...") : t("Confirm Booking")}
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: `1px solid ${EARTH_BORDER}`,
              bgcolor: "#FAF8F5",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} color={EARTH_DARK} sx={{ mb: 2 }}>
                {t("Booking Summary")}
              </Typography>
              <Stack spacing={1.2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("Service")}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                    {draft.service.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("Provider")}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {draft.service.store_name || t("Verified Service Provider")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("Scheduled Date & Time")}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {draft.scheduleDate} • {draft.scheduleTime}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("Farm / Site Location")}
                  </Typography>
                  <Typography variant="body2">{draft.farmLocation}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("Quantity")}
                  </Typography>
                  <Typography variant="body2">
                    {draft.quantity} {draft.service?.unit_type || t("Unit(s)")}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: EARTH_BORDER, my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight={700} color={EARTH_DARK}>
                  {t("Estimated Total")}
                </Typography>
                <Typography variant="h6" fontWeight={700} color={OLIVE_GREEN}>
                  {draft.estimatedTotal > 0
                    ? getAmountWithSign(draft.estimatedTotal)
                    : t("Quote on Inspection")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CustomContainer>
  );
}
