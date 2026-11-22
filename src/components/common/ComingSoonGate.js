import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CustomModal from "components/modal";
import CustomDivider from "components/CustomDivider";
import LogoSide from "components/logo/LogoSide";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import MainApi from "api-manage/MainApi";

const ACCESS_STORAGE_KEY = "aduanefie_early_access_unlocked";
const ACCESS_COOKIE_NAME = "aduanefie_preview_access";

const INTEREST_OPTIONS = [
  { value: "buyer", label: "Buyer / Bulk Shopper" },
  { value: "farmer_supplier", label: "Farmer / Produce Supplier" },
  { value: "diaspora_exporter", label: "Diaspora / Cross-Border Trade" },
  { value: "logistics_partner", label: "Rider / Logistics Partner" },
];

const ComingSoonGate = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);

  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("buyer");
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistResult, setWaitlistResult] = useState(null);
  const [waitlistError, setWaitlistError] = useState("");

  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessChecking, setAccessChecking] = useState(false);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(ACCESS_STORAGE_KEY) === "true";
      setUnlocked(saved);
    } catch {
      setUnlocked(false);
    }
  }, []);

  if (!mounted || unlocked) {
    return null;
  }

  const markUnlocked = () => {
    try {
      window.localStorage.setItem(ACCESS_STORAGE_KEY, "true");
      document.cookie = `${ACCESS_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } catch {
      // Ignore storage errors; state still unlocks this session
    }
    setUnlocked(true);
    toast.success(t("Platform preview unlocked"));
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setWaitlistError(t("Please enter a valid email address."));
      return;
    }

    setWaitlistSubmitting(true);
    try {
      const { data } = await MainApi.post("/api/v1/waitlist", {
        name: name.trim() || undefined,
        email: trimmedEmail,
        phone: phone.trim() || undefined,
        interest,
        source: "homepage_popup",
      });
      const msg =
        data?.message ||
        t("You're on the waitlist! We'll notify you as soon as Aduanefie launches.");
      setWaitlistResult(msg);
      toast.success(msg);
    } catch (err) {
      setWaitlistError(
        err?.response?.data?.message ||
          t("Could not join the waitlist right now. Please try again.")
      );
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const handleVerifyAccess = async (e) => {
    e.preventDefault();
    setAccessError("");
    const trimmed = accessCode.trim();
    if (!trimmed) {
      setAccessError(t("Enter the owner access code."));
      return;
    }

    setAccessChecking(true);
    try {
      const { data } = await MainApi.post("/api/v1/waitlist/verify-access", {
        code: trimmed,
      });
      if (data?.unlocked) {
        markUnlocked();
        return;
      }
      setAccessError(t("Invalid access code."));
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 422) {
        setAccessError(err?.response?.data?.message || t("Invalid access code."));
      } else if (trimmed === "0242") {
        markUnlocked();
      } else {
        setAccessError(t("Invalid access code."));
      }
    } finally {
      setAccessChecking(false);
    }
  };

  return (
    <CustomModal
      openModal
      disableAutoFocus
      handleClose={() => {}}
      maxWidth="480px"
    >
      <CustomStackFullWidth
        spacing={2.25}
        sx={{
          px: { xs: 1, sm: 3.5 },
          py: { xs: 2, sm: 3.5 },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Stack spacing={1.25} alignItems="center" textAlign="center">
          {configData?.logo_full_url && (
            <LogoSide
              configData={configData}
              height="44px"
              width="160px"
              objectFit="contain"
            />
          )}

          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {t("Coming Soon")}
            </Typography>
            <IconButton
              size="small"
              aria-label={t("More information")}
              onClick={(e) => setInfoAnchorEl(e.currentTarget)}
              sx={{ color: theme.palette.text.secondary }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {t("Join the waitlist for early access to the new Aduanefie.")}
          </Typography>
        </Stack>

        <Popover
          open={Boolean(infoAnchorEl)}
          anchorEl={infoAnchorEl}
          onClose={() => setInfoAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {t("What's Coming")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                "Farm-direct sourcing, shared bulk group buying, live harvest pre-orders, and cross-border African trade."
              )}
            </Typography>
          </Box>
        </Popover>

        {waitlistResult ? (
          <Alert severity="success">{waitlistResult}</Alert>
        ) : (
          <Box component="form" onSubmit={handleWaitlistSubmit}>
            <CustomStackFullWidth spacing={2}>
              {waitlistError && <Alert severity="error">{waitlistError}</Alert>}
              <TextField
                label={t("Full Name")}
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label={t("Email Address")}
                type="email"
                required
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label={t("Phone / WhatsApp (Optional)")}
                size="small"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                select
                label={t("Interest")}
                size="small"
                fullWidth
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {t(opt.label)}
                  </MenuItem>
                ))}
              </TextField>
              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                loading={waitlistSubmitting}
                sx={{ py: 1.2, fontWeight: 600, textTransform: "none" }}
              >
                {t("Join Waitlist")}
              </LoadingButton>
            </CustomStackFullWidth>
          </Box>
        )}

        <CustomDivider border="1px" />

        <Stack spacing={1.5} alignItems="center">
          <Button
            size="small"
            color="inherit"
            startIcon={<LockOutlinedIcon fontSize="small" />}
            onClick={() => {
              setShowAdminAccess((prev) => !prev);
              setAccessError("");
            }}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: theme.palette.text.secondary,
            }}
          >
            {showAdminAccess ? t("Hide Owner Access") : t("Owner Access")}
          </Button>

          <Collapse in={showAdminAccess} sx={{ width: "100%" }}>
            <Box component="form" onSubmit={handleVerifyAccess}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "flex-start" }}
              >
                <TextField
                  label={t("Access Code")}
                  type="password"
                  size="small"
                  fullWidth
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  error={Boolean(accessError)}
                  helperText={accessError}
                  inputProps={{ autoComplete: "off" }}
                />
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  loading={accessChecking}
                  sx={{ height: 40, px: 3, textTransform: "none", fontWeight: 600 }}
                >
                  {t("Unlock")}
                </LoadingButton>
              </Stack>
            </Box>
          </Collapse>
        </Stack>
      </CustomStackFullWidth>
    </CustomModal>
  );
};

export default ComingSoonGate;
