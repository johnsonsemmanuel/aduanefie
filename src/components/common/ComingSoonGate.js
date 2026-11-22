import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import CustomModal from "components/modal";
import CustomDivider from "components/CustomDivider";
import CustomLogo from "components/logo/CustomLogo";
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
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
      }}
    >
      <CustomModal
        openModal
        disableAutoFocus
        handleClose={() => {}}
        maxWidth="520px"
      >
        <CustomStackFullWidth
          spacing={2.5}
          sx={{
            p: { xs: 2, sm: 3.5 },
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Stack spacing={1} alignItems="center" textAlign="center">
            {configData?.logo_full_url && (
              <CustomLogo
                logoImg={configData.logo_full_url}
                atlText={configData?.business_name || "Aduanefie"}
                height="44px"
                width="160px"
                objectFit="contain"
              />
            )}
            <Typography
              variant="overline"
              sx={{ color: theme.palette.primary.main, fontWeight: 700, letterSpacing: 1 }}
            >
              {t("Coming Soon")}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {t("Explore the New Aduanefie")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                "We are finalizing the new marketplace experience. Join the waitlist below for early access when we launch."
              )}
            </Typography>
          </Stack>

          {waitlistResult ? (
            <Alert severity="success">{waitlistResult}</Alert>
          ) : (
            <Box component="form" onSubmit={handleWaitlistSubmit}>
              <CustomStackFullWidth spacing={1.75}>
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
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
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
                </Stack>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  loading={waitlistSubmitting}
                  sx={{ py: 1.1, fontWeight: 600, textTransform: "none" }}
                >
                  {t("Join Waitlist")}
                </LoadingButton>
              </CustomStackFullWidth>
            </Box>
          )}

          <CustomDivider border="1px" />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {t("Team or owner preview?")}
            </Typography>
            <Button
              size="small"
              startIcon={<LockOutlinedIcon fontSize="small" />}
              onClick={() => {
                setShowAdminAccess((prev) => !prev);
                setAccessError("");
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {showAdminAccess ? t("Hide Access Code") : t("Owner Access Code")}
            </Button>
          </Stack>

          <Collapse in={showAdminAccess}>
            <Box component="form" onSubmit={handleVerifyAccess}>
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
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
                  sx={{ height: 40, px: 2.5, textTransform: "none", fontWeight: 600 }}
                >
                  {t("Unlock")}
                </LoadingButton>
              </Stack>
            </Box>
          </Collapse>
        </CustomStackFullWidth>
      </CustomModal>
    </Box>
  );
};

export default ComingSoonGate;
