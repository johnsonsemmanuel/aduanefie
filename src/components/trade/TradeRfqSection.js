import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  useCreateTradeRfq,
  useGetTradeRfqs,
  useSubmitRfqQuote,
} from "api-manage/hooks/react-query/trade/useTradeRfqs";

const INITIAL_FORM = {
  buyer_name: "",
  buyer_company: "",
  buyer_phone: "",
  buyer_email: "",
  commodity: "",
  category: "Grains & Cereals",
  quantity: "",
  unit: "100 kg bag",
  target_price_ghs: "",
  incoterm: "DDP",
  origin_country: "Ghana",
  destination_country: "Nigeria",
  destination_city: "",
  trade_bloc: "ECOWAS",
  requires_insurance: true,
  requires_phytosanitary: true,
  notes: "",
};

const TradeRfqSection = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [quoteModalRfq, setQuoteModalRfq] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    supplier_name: "",
    supplier_phone: "",
    quoted_unit_price_ghs: "",
    incoterm: "DDP",
    lead_time_days: 7,
    compliance_docs: "AfCFTA Certificate of Origin, Phytosanitary",
    notes: "",
  });

  const { data: rfqData, isLoading } = useGetTradeRfqs("all");
  const { mutate: createRfq, isLoading: isSubmitting } = useCreateTradeRfq();
  const { mutate: submitQuote, isLoading: isSubmittingQuote } = useSubmitRfqQuote();

  const rfqs = rfqData?.requests || [];

  const handleSubmitRfq = (e) => {
    e.preventDefault();
    if (!form.buyer_name || !form.buyer_phone || !form.commodity || !form.quantity) {
      toast.error(t("Please fill in your name, phone, commodity, and quantity."));
      return;
    }
    createRfq(
      {
        ...form,
        quantity: Number(form.quantity),
        target_price_ghs: form.target_price_ghs ? Number(form.target_price_ghs) : null,
      },
      {
        onSuccess: () => {
          toast.success(t("RFQ posted! Verified farms and cooperatives can now submit quotes."));
          setForm(INITIAL_FORM);
        },
        onError: () => {
          toast.error(t("Could not submit RFQ. Please check your inputs."));
        },
      }
    );
  };

  const handleOpenQuoteModal = (rfq) => {
    setQuoteModalRfq(rfq);
    setQuoteForm((prev) => ({ ...prev, incoterm: rfq.incoterm || "DDP" }));
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!quoteModalRfq) return;
    submitQuote(
      {
        rfqId: quoteModalRfq.id,
        payload: {
          ...quoteForm,
          quoted_unit_price_ghs: Number(quoteForm.quoted_unit_price_ghs),
          lead_time_days: Number(quoteForm.lead_time_days || 7),
        },
      },
      {
        onSuccess: () => {
          toast.success(t("Quote submitted to buyer & trade desk."));
          setQuoteModalRfq(null);
        },
        onError: () => {
          toast.error(t("Could not submit quote."));
        },
      }
    );
  };

  return (
    <Box sx={{ mt: { xs: "28px", md: "44px" } }}>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "20px", md: "26px" },
          fontWeight: 700,
          letterSpacing: "-0.6px",
          mb: 1,
        }}
      >
        {t("Cross-Border Request for Quotation (RFQ)")}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: "14px", mb: 3 }}>
        {t("Post bulk agro sourcing requirements across ECOWAS & AfCFTA corridors and receive competitive quotes from verified farms with phytosanitary and Trade Assurance options.")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "16px", mb: 2 }}>
              {t("Post a Bulk Sourcing RFQ")}
            </Typography>
            <Box component="form" onSubmit={handleSubmitRfq}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label={t("Buyer Name")}
                    value={form.buyer_name}
                    onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t("Company / Cooperative")}
                    value={form.buyer_company}
                    onChange={(e) => setForm({ ...form, buyer_company: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label={t("Phone / WhatsApp")}
                    value={form.buyer_phone}
                    onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    label={t("Email (optional)")}
                    value={form.buyer_email}
                    onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label={t("Commodity (e.g. White Maize Grade 2)")}
                    value={form.commodity}
                    onChange={(e) => setForm({ ...form, commodity: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    required
                    label={t("Quantity")}
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label={t("Unit (e.g. 100 kg bag / MT)")}
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label={t("Target Price (GH₵ / unit)")}
                    value={form.target_price_ghs}
                    onChange={(e) => setForm({ ...form, target_price_ghs: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t("Trade Bloc")}</InputLabel>
                    <Select
                      value={form.trade_bloc}
                      label={t("Trade Bloc")}
                      onChange={(e) => setForm({ ...form, trade_bloc: e.target.value })}
                    >
                      <MenuItem value="ECOWAS">ECOWAS</MenuItem>
                      <MenuItem value="AfCFTA">AfCFTA</MenuItem>
                      <MenuItem value="EAC">EAC</MenuItem>
                      <MenuItem value="SADC">SADC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t("Incoterm")}</InputLabel>
                    <Select
                      value={form.incoterm}
                      label={t("Incoterm")}
                      onChange={(e) => setForm({ ...form, incoterm: e.target.value })}
                    >
                      <MenuItem value="DDP">DDP (Delivered Duty Paid)</MenuItem>
                      <MenuItem value="CIF">CIF (Cost, Insurance & Freight)</MenuItem>
                      <MenuItem value="FOB">FOB (Free On Board)</MenuItem>
                      <MenuItem value="EXW">EXW (Ex Works Farmgate)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    label={t("Destination Country")}
                    value={form.destination_country}
                    onChange={(e) => setForm({ ...form, destination_country: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t("Destination City / Port")}
                    value={form.destination_city}
                    onChange={(e) => setForm({ ...form, destination_city: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={form.requires_insurance}
                          onChange={(e) => setForm({ ...form, requires_insurance: e.target.checked })}
                        />
                      }
                      label={<Typography sx={{ fontSize: "12.5px" }}>{t("Trade Assurance & Cargo Insurance")}</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={form.requires_phytosanitary}
                          onChange={(e) => setForm({ ...form, requires_phytosanitary: e.target.checked })}
                        />
                      }
                      label={<Typography sx={{ fontSize: "12.5px" }}>{t("Phytosanitary & AfCFTA CoO")}</Typography>}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ fontWeight: 700, textTransform: "none", borderRadius: "10px", py: 1 }}
                  >
                    {isSubmitting ? t("Submitting...") : t("Submit Sourcing RFQ")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                {t("Live Buyer Sourcing Requests")} ({rfqs.length})
              </Typography>
            </Stack>

            {isLoading ? (
              <Typography sx={{ color: "text.secondary", fontSize: "14px" }}>{t("Loading RFQs...")}</Typography>
            ) : rfqs.length === 0 ? (
              <Typography sx={{ color: "text.secondary", fontSize: "14px", py: 3 }}>
                {t("No open RFQs yet. Be the first buyer to post a bulk agro sourcing request.")}
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {rfqs.map((rfq) => (
                  <Box
                    key={rfq.id}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography sx={{ fontWeight: 700, fontSize: "15px" }}>
                            {rfq.commodity} — {Number(rfq.quantity).toLocaleString()} {rfq.unit}
                          </Typography>
                          <Chip size="small" label={rfq.status?.toUpperCase()} variant="outlined" />
                        </Stack>
                        <Typography sx={{ fontSize: "12.5px", color: "text.secondary", mt: 0.5 }}>
                          {rfq.origin_country} → {rfq.destination_country} {rfq.destination_city ? `(${rfq.destination_city})` : ""} · {rfq.trade_bloc} · {rfq.incoterm}
                          {rfq.target_price_ghs ? ` · Target GH₵${Number(rfq.target_price_ghs).toLocaleString()}` : ""}
                        </Typography>
                        <Stack direction="row" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap">
                          {rfq.requires_insurance && <Chip size="small" color="success" variant="outlined" label={t("Insured")} />}
                          {rfq.requires_phytosanitary && <Chip size="small" variant="outlined" label={t("Phytosanitary + AfCFTA CoO")} />}
                          <Chip size="small" label={`${rfq.quotes_count || 0} ${t("Quotes")}`} />
                        </Stack>
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenQuoteModal(rfq)}
                        sx={{ textTransform: "none", fontWeight: 600, flexShrink: 0 }}
                      >
                        {t("Submit Quote")}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={Boolean(quoteModalRfq)} onClose={() => setQuoteModalRfq(null)} fullWidth maxWidth="xs">
        <DialogTitle>
          {t("Submit Supplier Quote")} — #{quoteModalRfq?.id}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmitQuote}>
          <DialogContent>
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              <TextField
                fullWidth
                size="small"
                required
                label={t("Farm / Cooperative Name")}
                value={quoteForm.supplier_name}
                onChange={(e) => setQuoteForm({ ...quoteForm, supplier_name: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                required
                label={t("Supplier Phone / WhatsApp")}
                value={quoteForm.supplier_phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, supplier_phone: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                required
                type="number"
                label={t("Quoted Unit Price (GH₵)")}
                value={quoteForm.quoted_unit_price_ghs}
                onChange={(e) => setQuoteForm({ ...quoteForm, quoted_unit_price_ghs: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label={t("Lead Time (Days)")}
                value={quoteForm.lead_time_days}
                onChange={(e) => setQuoteForm({ ...quoteForm, lead_time_days: e.target.value })}
              />
              <TextField
                fullWidth
                size="small"
                label={t("Export Compliance Docs Ready")}
                value={quoteForm.compliance_docs}
                onChange={(e) => setQuoteForm({ ...quoteForm, compliance_docs: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQuoteModalRfq(null)}>{t("Cancel")}</Button>
            <Button type="submit" variant="contained" disabled={isSubmittingQuote}>
              {isSubmittingQuote ? t("Sending...") : t("Send Quote")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TradeRfqSection;
