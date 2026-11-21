import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CssBaseline,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "components/seo";
import MainApi from "api-manage/MainApi";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import toast from "react-hot-toast";
import {
  getCountryOptions,
  getMarketProfile,
  normalizeCountry,
} from "utils/marketProfiles";

const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Eastern",
  "Central",
  "Western",
  "Western North",
  "Volta",
  "Oti",
  "Bono",
  "Bono East",
  "Ahafo",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
];

const BecomeAMarketerPage = ({ configData }) => {
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) dispatch(setConfigData(configData));
    else configRefetch();
  }, [configData, configRefetch, dispatch]);

  useEffect(() => {
    if (dataConfig) dispatch(setConfigData(dataConfig));
  }, [dataConfig, dispatch]);

  const effectiveConfig = configData || dataConfig;
  const countryOptions = getCountryOptions();

  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState("");
  const [form, setForm] = useState({
    country: normalizeCountry(effectiveConfig?.country) || "GH",
    full_name: "",
    email: "",
    phone: "",
    region: "Greater Accra",
    district: "",
    momo_network: "MTN",
    experience_notes: "",
  });

  const marketProfile = getMarketProfile(form.country);
  const usesGhanaRegions = marketProfile?.address?.location_dataset === "ghana";
  const regionLabel = marketProfile?.address?.region_label || "Region / State";
  const districtLabel = marketProfile?.address?.district_label || "District / Town";
  const payoutNetworks = marketProfile?.payouts?.networks || ["MTN"];
  const phoneExample = marketProfile?.phone?.example || "0241234567";
  const phoneDialCode = marketProfile?.phone?.dial_code || "+233";

  const handleCountryChange = (country) => {
    const profile = getMarketProfile(country);
    setForm((current) => ({
      ...current,
      country,
      region: profile?.address?.location_dataset === "ghana" ? "Greater Accra" : "",
      district: "",
      momo_network: profile?.payouts?.networks?.[0] || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    setSubmittedMsg("");
    try {
      const { data } = await MainApi.post("/api/v1/marketer-applications", {
        ...form,
        country: form.country,
        country_code: form.country,
      });
      const msg = data?.message || "Application submitted!";
      setSubmittedMsg(msg);
      toast.success(msg);
      setForm({
        country: form.country,
        full_name: "",
        email: "",
        phone: "",
        region: form.region,
        district: "",
        momo_network: form.momo_network,
        experience_notes: "",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Could not submit application. Please check your details.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <SEO
        title={`Become a Regional Marketer | ${effectiveConfig?.business_name || "Aduanefie"}`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <SimpleMobileHeader title="Become a Marketer" backHref="/home" />
        <CustomContainer>
          <Box sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 4, md: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3.5 },
                borderRadius: "16px",
                bgcolor: (theme) => theme.palette.primary.deep || "#67513A",
                color: "#FFFFFF",
                mb: 3,
              }}
            >
              <Chip
                size="small"
                label="Aduanefie Partners Program"
                sx={{
                  bgcolor: (theme) => theme.palette.primary.main || "#8B9F69",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  mb: 1,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.35rem", md: "1.95rem" }, mb: 0.75 }}>
                Earn by Onboarding Farmers in Your Region
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", maxWidth: 680 }}>
                Join Aduanefie&apos;s regional field network. Earn an onboarding bounty in your local currency for every verified farm or agro-vendor you onboard, plus a recurring share of Aduanefie&apos;s commission on their delivered orders.
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Stack spacing={1.5}>
                  {[
                    {
                      title: "Onboarding Bounty",
                      desc: "Paid in your local currency per verified farmer, backyard grower, or agro-input vendor who joins through your referral code.",
                    },
                    {
                      title: "20% Recurring Order Commission",
                      desc: "Earn ongoing commissions on every delivered order from farms you bring onto Aduanefie.",
                    },
                    {
                      title: "Lead Regional Tours & Field Verification",
                      desc: "Host farmer onboarding stops in your region and verify backyard farms directly from partners.aduanefie.com.",
                    },
                  ].map((item) => (
                    <Paper
                      key={item.title}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: "12px", bgcolor: "background.paper" }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: "14.5px", mb: 0.35 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.45 }}>
                        {item.desc}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: "14px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Apply as a Regional Marketer
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                    Once approved, your partner portal credentials and referral code are sent via SMS.
                  </Typography>

                  {submittedMsg && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {submittedMsg}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={1.5}>
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        label="Country"
                        value={form.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                      >
                        {countryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      />
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        <TextField
                          required
                          fullWidth
                          size="small"
                          type="email"
                          label="Email Address"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <TextField
                          required
                          fullWidth
                          size="small"
                          label="Phone Number (MoMo / SMS)"
                          placeholder={phoneExample}
                          helperText={`${phoneDialCode} mobile number`}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                        {usesGhanaRegions ? (
                          <TextField
                            select
                            required
                            fullWidth
                            size="small"
                            label={regionLabel}
                            value={form.region}
                            onChange={(e) => setForm({ ...form, region: e.target.value })}
                          >
                            {GHANA_REGIONS.map((r) => (
                              <MenuItem key={r} value={r}>
                                {r}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            required
                            fullWidth
                            size="small"
                            label={regionLabel}
                            value={form.region}
                            onChange={(e) => setForm({ ...form, region: e.target.value })}
                          />
                        )}
                        <TextField
                          fullWidth
                          size="small"
                          label={districtLabel}
                          value={form.district}
                          onChange={(e) => setForm({ ...form, district: e.target.value })}
                        />
                      </Stack>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Preferred Payout Network"
                        value={form.momo_network}
                        onChange={(e) => setForm({ ...form, momo_network: e.target.value })}
                      >
                        {payoutNetworks.map((net) => (
                          <MenuItem key={net} value={net}>
                            {net}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        label="Field / Farming Network Experience (optional)"
                        placeholder="Tell us about your community, farmer cooperatives, or sales experience..."
                        value={form.experience_notes}
                        onChange={(e) => setForm({ ...form, experience_notes: e.target.value })}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                        sx={{ py: 1.1, fontWeight: 700, borderRadius: "10px" }}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export const getServerSideProps = getCommonServerSideProps;
export default BecomeAMarketerPage;
