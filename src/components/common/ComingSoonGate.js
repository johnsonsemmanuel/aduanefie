import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setWaitlistError("Please enter a valid email address.");
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
      setWaitlistResult(
        data?.message ||
          "You're on the waitlist! We'll notify you as soon as the new Aduanefie launches."
      );
    } catch (err) {
      setWaitlistError(
        err?.response?.data?.message ||
          "Could not join the waitlist right now. Please try again."
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
      setAccessError("Enter the owner access code.");
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
      setAccessError("Invalid access code.");
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 422) {
        setAccessError(err?.response?.data?.message || "Invalid access code.");
      } else if (trimmed === "0242") {
        // Allow owner access if API is unreachable during deploy/local preview
        markUnlocked();
      } else {
        setAccessError("Invalid access code.");
      }
    } finally {
      setAccessChecking(false);
    }
  };

  return (
    <Dialog
      open
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(14px)",
            backgroundColor: "rgba(9, 24, 18, 0.78)",
          },
        },
      }}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
      }}
    >
      <Box
        sx={{
          px: { xs: 2.5, sm: 4 },
          pt: { xs: 3, sm: 3.5 },
          pb: 2.5,
          background: "linear-gradient(135deg, #0b3b24 0%, #14633c 100%)",
          color: "#ffffff",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Chip
            icon={<RocketLaunchOutlinedIcon sx={{ color: "#ffffff !important", fontSize: 16 }} />}
            label="Coming Soon"
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.16)",
              color: "#ffffff",
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600 }}>
            Aduanefie 2.0
          </Typography>
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          The New Aduanefie is Almost Ready
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, lineHeight: 1.5 }}>
          We are putting the finishing touches on farm-direct sourcing, shared group
          buying, and cross-border African trade. Join the waitlist for early access
          when we open.
        </Typography>
      </Box>

      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
        {waitlistResult ? (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon />}
            sx={{ borderRadius: "12px", mb: 2 }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              You are on the list!
            </Typography>
            <Typography variant="body2">{waitlistResult}</Typography>
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleWaitlistSubmit}>
            <Stack spacing={1.75}>
              {waitlistError && (
                <Alert severity="error" sx={{ borderRadius: "10px" }}>
                  {waitlistError}
                </Alert>
              )}
              <TextField
                label="Full Name"
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kwame Mensah"
              />
              <TextField
                label="Email Address"
                type="email"
                required
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  label="Phone / WhatsApp (Optional)"
                  size="small"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233..."
                />
                <TextField
                  select
                  label="I am joining as"
                  size="small"
                  fullWidth
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                >
                  {INTEREST_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={waitlistSubmitting}
                sx={{
                  mt: 0.5,
                  py: 1.25,
                  borderRadius: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {waitlistSubmitting ? "Joining Waitlist..." : "Join the Waitlist"}
              </Button>
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Building or reviewing the platform?
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
            {showAdminAccess ? "Hide Owner Access" : "Owner Access Code"}
          </Button>
        </Stack>

        <Collapse in={showAdminAccess}>
          <Box component="form" onSubmit={handleVerifyAccess} sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={1.25} alignItems="flex-start">
              <TextField
                label="Owner Access Code"
                type="password"
                size="small"
                fullWidth
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter 4-digit code"
                error={Boolean(accessError)}
                helperText={accessError || "Authorized team & owner preview only"}
                inputProps={{ autoComplete: "off" }}
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={accessChecking}
                sx={{ height: 40, px: 2.5, textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {accessChecking ? "Checking..." : "Unlock"}
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonGate;
