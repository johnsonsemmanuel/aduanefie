import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CssBaseline,
  FormControlLabel,
  Grid,
  MenuItem,
  NoSsr,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomContainer from "components/container";
import AuthGuard from "components/route-guard/AuthGuard";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "components/seo";
import MainApi from "api-manage/MainApi";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import toast from "react-hot-toast";

const DEFAULT_REGIONS = [
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

const RegionalToursPage = ({ configData, initialTours = [], initialRegions = DEFAULT_REGIONS }) => {
  const router = useRouter();
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

  const [tours, setTours] = useState(initialTours);
  const [regions, setRegions] = useState(initialRegions?.length ? initialRegions : DEFAULT_REGIONS);
  const [loading, setLoading] = useState(initialTours.length === 0);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMsg, setSubmittedMsg] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");

  const [form, setForm] = useState({
    farmer_name: "",
    phone: "",
    email: "",
    region: "Ashanti",
    community: "",
    farm_size_acres: "",
    primary_crops: "",
    is_cooperative: false,
    farmer_count: 1,
    notes: "",
  });

  useEffect(() => {
    let active = true;
    MainApi.get("/api/v1/regional-tours")
      .then((res) => {
        if (!active) return;
        setTours(res?.data?.tours || []);
        if (Array.isArray(res?.data?.regions) && res.data.regions.length > 0) {
          setRegions(res.data.regions);
        }
      })
      .catch((err) => {
        // An expired token must not leave an empty, apparently public page.
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/home?from=regional-tours");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectTour = (tour) => {
    setSelectedTourId(String(tour.id));
    setForm((prev) => ({ ...prev, region: tour.region }));
    if (typeof window !== "undefined") {
      document.getElementById("regional-tour-form")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farmer_name.trim() || !form.phone.trim() || !form.region) {
      toast.error("Please enter your name, phone number, and region.");
      return;
    }
    setSubmitting(true);
    setSubmittedMsg("");
    try {
      const refCode = router?.query?.ref || router?.query?.marketer_code || "";
      const payload = {
        ...form,
        tour_id: selectedTourId ? Number(selectedTourId) : null,
        farm_size_acres: form.farm_size_acres ? Number(form.farm_size_acres) : null,
        farmer_count: form.is_cooperative ? Math.max(2, Number(form.farmer_count || 2)) : 1,
        marketer_code: refCode ? String(refCode).trim() : undefined,
      };
      const { data } = await MainApi.post("/api/v1/regional-tours/register", payload);
      const msg = data?.message || "Registration submitted!";
      setSubmittedMsg(msg);
      toast.success(msg);
      setForm({
        farmer_name: "",
        phone: "",
        email: "",
        region: form.region,
        community: "",
        farm_size_acres: "",
        primary_crops: "",
        is_cooperative: false,
        farmer_count: 1,
        notes: "",
      });
      setSelectedTourId("");
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        "Could not submit registration. Please check your details.";
      toast.error(msg);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        router.replace("/home?from=regional-tours");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <SEO
        title={`Regional Tours | ${effectiveConfig?.business_name || "Aduanefie"}`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <NoSsr>
        <AuthGuard from="regional-tours" requireToken>
        <SimpleMobileHeader title="Regional Tours" backHref="/home" />
        <CustomContainer>
          <Box sx={{ pt: { xs: 1.5, md: 3 }, pb: { xs: 4, md: 6 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: "14px",
                bgcolor: (theme) => theme.palette.primary.deep || "#67513A",
                color: "#FFFFFF",
                mb: 2.5,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.55rem" }, mb: 0.35 }}>
                Regional Farmer Tours
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.88)" }}>
                Register for an upcoming stop or request a field visit in your region.
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Upcoming Tour Stops
                </Typography>
                {loading ? (
                  <Stack spacing={1.5}>
                    {[1, 2].map((k) => (
                      <Skeleton key={k} variant="rounded" height={120} sx={{ borderRadius: "12px" }} />
                    ))}
                  </Stack>
                ) : tours.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: "12px" }}>
                    No tour dates are published yet. Use the form to request a regional visit. Regions with the highest farmer demand are scheduled first.
                  </Alert>
                ) : (
                  <Stack spacing={1.5}>
                    {tours.map((tour) => {
                      const selected = String(selectedTourId) === String(tour.id);
                      return (
                        <Card
                          key={tour.id}
                          variant="outlined"
                          sx={{
                            borderRadius: "12px",
                            borderColor: selected ? "primary.main" : "divider",
                            borderWidth: selected ? 2 : 1,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                              <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: "15px" }}>
                                  {tour.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                                  {tour.region}
                                  {tour.venue ? ` · ${tour.venue}` : tour.district ? ` · ${tour.district}` : ""}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                  Date: {tour.start_date} · {tour.spots_left} spots left
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                variant={selected ? "contained" : "outlined"}
                                onClick={() => handleSelectTour(tour)}
                                sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                              >
                                {selected ? "Selected" : "Register"}
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper id="regional-tour-form" variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: "14px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {selectedTourId ? "Register for Selected Tour" : "Register / Request a Regional Visit"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                    Takes 30 seconds. You will receive an SMS confirmation.
                  </Typography>

                  {submittedMsg && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {submittedMsg}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={1.5}>
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="Full Name / Cooperative Lead"
                        value={form.farmer_name}
                        onChange={(e) => setForm({ ...form, farmer_name: e.target.value })}
                      />
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="Phone Number (for SMS confirmation)"
                        placeholder="e.g. 0241234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        label="Region"
                        value={form.region}
                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                      >
                        {regions.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        size="small"
                        label="Town / Farming Community"
                        value={form.community}
                        onChange={(e) => setForm({ ...form, community: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Primary Crops / Produce"
                        placeholder="e.g. Maize, Tomatoes, Cocoa, Plantain"
                        value={form.primary_crops}
                        onChange={(e) => setForm({ ...form, primary_crops: e.target.value })}
                      />
                      <Stack direction="row" spacing={1.25}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Farm Size (Acres)"
                          inputProps={{ min: 0, step: "0.1" }}
                          value={form.farm_size_acres}
                          onChange={(e) => setForm({ ...form, farm_size_acres: e.target.value })}
                        />
                        {form.is_cooperative && (
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Farmers in Group"
                            inputProps={{ min: 2 }}
                            value={form.farmer_count}
                            onChange={(e) => setForm({ ...form, farmer_count: e.target.value })}
                          />
                        )}
                      </Stack>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={form.is_cooperative}
                            onChange={(e) => setForm({ ...form, is_cooperative: e.target.checked })}
                          />
                        }
                        label={<Typography variant="body2">Registering on behalf of a farmer group / cooperative</Typography>}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                        sx={{ py: 1.1, fontWeight: 700, borderRadius: "10px" }}
                      >
                        {submitting
                          ? "Submitting..."
                          : selectedTourId
                          ? "Confirm Tour Registration"
                          : "Request Regional Visit"}
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CustomContainer>
        </AuthGuard>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const base = await getCommonServerSideProps(context);
  // Tours are account-only now. The browser fetches them with the signed-in
  // user's token; SSR has no access to localStorage and must not call the API.
  const initialTours = [];
  const initialRegions = DEFAULT_REGIONS;
  return {
    ...base,
    props: {
      ...(base?.props || {}),
      initialTours,
      initialRegions,
    },
  };
};
export default RegionalToursPage;
