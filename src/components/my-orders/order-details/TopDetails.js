import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  Button,
  Drawer,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import moment from "moment";
import EstimatedArrival from "components/my-orders/order-details/EstimatedArrival";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOfflinePaymentInfo,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomModal from "../../modal";
import TrackSvg from "../assets/TrackSvg";
import DigitalPaymentManage from "./DigitalPaymentManage";
import OfflineOrderDetailsModal from "./offline-order/OfflineOrderDetailsModal";
import PaymentUpdate from "./other-order/PaymentUpdate";
import AddPaymentMethod from "components/checkout/item-checkout/AddPaymentMethod";
import PaymentMethod from "components/checkout/PaymentMethod";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import {
  getDigitalMethodFromZone,
  handleFailedOrderPlace,
} from "utils/CustomFunctions";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useUpdatePaymentByWallet } from "api-manage/hooks/react-query/useUpdatePaymentByWallet";
import { baseUrl } from "api-manage/MainApi";


// Build same-origin print documents with DOM APIs. Backend-provided invoice and
// contract values are always assigned through textContent; interpolating them
// into document.write() allowed stored HTML/script to execute with access to
// the opener's localStorage (including the auth token).
const buildPrintDoc = (title, existingWin = null) => {
  if (typeof window === "undefined") return null;
  const win = existingWin || window.open("", "_blank");
  if (!win) return null;
  const doc = win.document;
  doc.open();
  // Static skeleton only - no application data is written as markup.
  doc.write(
    '<!doctype html><html><head><meta charset="utf-8"><title></title></head><body></body></html>'
  );
  doc.close();
  doc.title = String(title || "Document");
  const body = doc.body;
  body.style.cssText =
    "font-family:sans-serif;padding:32px;max-width:760px;margin:auto";
  return { win, doc, body };
};

const addEl = (doc, parent, tag, text, style) => {
  const node = doc.createElement(tag);
  if (style) node.setAttribute("style", style);
  if (text !== undefined && text !== null) node.textContent = String(text);
  parent.appendChild(node);
  return node;
};

const CELL = "padding:8px;border-bottom:1px solid #ddd";
const MUTED = "margin:4px 0;font-size:13px;color:#555";

import MainApi from "api-manage/MainApi";
import { WHOLESALE_MODULE_ID } from "components/trade/tradeData";
import Router, { useRouter } from "next/router";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import RateAndReview from "components/review/RateAndReview";
import CustomDivider from "components/CustomDivider";

const TopDetails = (props) => {
  const {
    data,
    trackData,
    trackDataIsLoading,
    trackDataIsFetching,
    currentTab,
    configData,
    id,
    openModal,
    setOpenModal,
    refetchOrderDetails,
    refetchTrackData,
    dataIsLoading,
    page,
    openPaymentMethod,
    setOpenPaymentMethod,
    paymentMethodUpdateMutation,
    paymentFailedData,
    setPaymentFailedData,
    isBooking,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  console.log({ orderDetailsModal });
  const { profileInfo } = useSelector((state) => state.profileInfo);
  console.log({ profileInfo });
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isServiceBooking =
    isBooking === true || trackData?.module_type === "service";
  const parentBookingId = router.query?.parentBookingId;
  const isSubBooking = isServiceBooking && !!parentBookingId;
  const { otpForCompleteServiceEnabled } = useServiceBusinessConfig(
    configData,
    null
  );
  const hasServiceOtp = Boolean(data?.otp);
  const isBookingOtpEligibleStatus = ["confirmed", "ongoing"].includes(
    data?.booking_status
  );
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [returnFareOpenModal, setReturnFareOpenModal] = useState(false);
  const [openModalOffline, setOpenModelOffline] = useState(false);
  const [parcelReceiveModal, setParcelReceiveModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();

  console.log({ paymentFailedData });

  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );
  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );

  const handleOfflineClose = () => {
    dispatch(clearOfflinePaymentInfo());
    dispatch(setOrderDetailsModal(false));
    setOpenModelOffline(false);
  };

  // Open the "order placed successfully" modal reactively from the live Redux
  // flag (set during checkout, just before navigating here). Driving it off the
  // flag - rather than a mount-time `useState(orderDetailsModal)` snapshot -
  // makes it survive the loading skeleton and the route/`key` remounts that
  // happen while the order id resolves. A throwaway first mount used to consume
  // the flag before the real one rendered, so the modal never showed. The flag
  // is cleared on close (handleOfflineClose), so it won't reopen on later visits.
  // Gate on resolved order data: the page remounts while the order id
  // resolves, and opening on a throwaway skeleton mount made the modal
  // flash (open → unmount → reopen = "shows 2 times, 1 blink").
  useEffect(() => {
    const hasOrderData = Boolean(
      trackData?.id ?? data?.id ?? data?.[0]?.order_id
    );
    if (orderDetailsModal && hasOrderData) {
      setOpenModelOffline(true);
    }
  }, [orderDetailsModal, trackData?.id, data?.id]);
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  const isZoneDigital = getDigitalMethodFromZone(
    trackData?.module_type !== "parcel"
      ? trackData?.store?.zone_id
      : trackData?.zone_id,
    zoneData?.data
  );

  const { mutate: walletPaymentMutation } = useUpdatePaymentByWallet();

  const handlePayment = (mutation) => {
    const handleSuccess = (response) => {
      toast.success(response.message);
      refetchOrderDetails();
      refetchTrackData();
      setOpenPaymentMethod(false);
    };

    const formData = {
      order_id: id,
      _method: paymentMethod === "wallet" ? "POST" : "PUT",
    };

    mutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };
  console.log({ data });

  // Scoped to this page (order-details / booking-details under
  // profile?page=my-orders) only - checkout and service/checkout never call
  // failedOrderPlace, so they're unaffected.
  const failedOrderPlace = () => {
    // trackData (trackOrderData) is order-only and comes back empty for a
    // booking - the booking's real payload (incl. payment_method) is `data`.
    const currentPaymentMethod = data?.payment_method ?? trackData?.payment_method;
    const isSameCashMethod =
      (paymentMethod === "cash_on_delivery" ||
        paymentMethod === "cash_after_service") &&
      (currentPaymentMethod === "cash_on_delivery" ||
        currentPaymentMethod === "cash_after_service");
    if (
      currentPaymentMethod &&
      (paymentMethod === currentPaymentMethod || isSameCashMethod)
    ) {
      toast.error(t("This is already your selected payment method"));
      return;
    }
    handleFailedOrderPlace({
      paymentMethod,
      paymentFailedData,
      handlePayment,
      paymentMethodUpdateMutation,
      walletPaymentMutation,
      profileInfo,
      orderId: trackData?.id,
      baseUrl,
      router,
    });
  };
  console.log({ orderDetailsModal });
  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 12px 0px",
        sm: "30px 20px 0 25px",
        md: "30px 20px 0 25px",
      }}
      rowGap="10px"
      flexWrap="wrap"
    >
      {/* Back to order list */}
      <Stack
        direction="row"
        alignItems="center"
        gap="4px"
        onClick={() =>
          router.push({
            pathname: "/profile",
            query: isSubBooking
              ? {
                  page: "my-orders",
                  orderId: parentBookingId,
                  ...(router.query.orderTabModule
                    ? { orderTabModule: router.query.orderTabModule }
                    : {}),
                }
              : {
                  page: "my-orders",
                  ...(router.query.orderTabModule
                    ? { orderTabModule: router.query.orderTabModule }
                    : {}),
                },
          })
        }
        sx={{
          cursor: "pointer",
          width: "100%",
          display: { xs: "none", md: "flex" },
        }}
      >
        <IconButton
          size="small"
          sx={{ p: "2px", color: theme.palette.text.link }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "18px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 600,
            color: theme.palette.text.link,
            lineHeight: 1.2,
          }}
        >
          {isSubBooking ? t("Back To Main Booking") : t("Back to Main Orders")}
        </Typography>
      </Stack>

      <Stack
        direction={isSmall ? "column" : "row"}
        justifyContent="space-between"
        alignItems="flex-start"
        gap="8px"
        flexWrap="wrap"
        width="100%"
      >
        <Stack
          spacing={{ xs: 1, md: 1 }}
          flexGrow="1"
          sx={{ minWidth: 0, "@media (max-width: 385px)": { width: "100%" } }}
        >
          {/* <Typography
            fontSize={{ xs: "11px", md: "12px" }}
            fontWeight="500"
            color={theme.palette.neutral[500]}
          >
            {t("Order Date:")}
            <Typography
              component="span"
              fontSize={{ xs: "11px", md: "12px" }}
              fontWeight="600"
              marginLeft="5px"
              color={theme.palette.neutral[700]}
            >
              {moment(trackData?.created_at)?.format("DD MMM, YYYY h:mm A")}
            </Typography>
          </Typography> */}

          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="8px">
            <Typography fontSize={{ xs: "16px", md: "20px" }} fontWeight="700">
              {isSubBooking
                ? t("Sub Booking ID:")
                : isServiceBooking
                ? t("Booking ID:")
                : t("Order ID:")}
              <Typography
                component="span"
                fontSize={{ xs: "16px", md: "20px" }}
                fontWeight="700"
                marginLeft="5px"
              >
                {data?.display_id ??
                  data?.[0]?.order_id ??
                  data?.booking_id ??
                  data?.id}
              </Typography>
            </Typography>
            {isServiceBooking ? (
              <StatusBadge
                status={data?.booking_status}
                label={
                  data?.status_label ?? t(capitalizeText(data?.booking_status))
                }
              />
            ) : trackData?.order_status === "failed" ? (
              <StatusBadge status="failed" label={t("Payment Failed")} />
            ) : (
              <StatusBadge
                status={trackData?.order_status}
                label={t(capitalizeText(trackData?.order_status))}
              />
            )}
            {trackData?.order_type && (
              <StatusBadge
                status="completed"
                label={t(
                  capitalizeText(
                    trackData?.order_type === "delivery"
                      ? "home delivery"
                      : trackData?.order_type
                  )
                )}
              />
            )}
            {isServiceBooking &&
              otpForCompleteServiceEnabled &&
              hasServiceOtp &&
              isBookingOtpEligibleStatus && (
                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="700"
                  color={theme.palette.text.primary}
                >
                  {t("OTP")} :{" "}
                  <Typography
                    component="span"
                    fontSize={{ xs: "14px", md: "16px" }}
                    fontWeight="700"
                    color={theme.palette.primary.main}
                  >
                    {data?.otp}
                  </Typography>
                </Typography>
              )}
          </Stack>

          <Stack direction="column" alignItems="flex-start" spacing={0.5} sx={{ mt: 1 }}>
            <Typography
              fontSize={{ xs: "11px", md: "12px" }}
              fontWeight="500"
              color={theme.palette.neutral[500]}
            >
              {isServiceBooking ? t("Booking Date:") : t("Order Date:")}
              <Typography
                component="span"
                fontSize={{ xs: "11px", md: "12px" }}
                fontWeight="600"
                marginLeft="5px"
                color={theme.palette.neutral[700]}
              >
                {moment(
                  isServiceBooking
                    ? data?.created_at ?? trackData?.created_at
                    : trackData?.created_at
                )?.format("DD MMM, YYYY")}
              </Typography>
            </Typography>

            {isServiceBooking && data?.schedule_at && (
              <Stack spacing={1}>
                <Typography
                  fontSize={{ xs: "11px", md: "12px" }}
                  fontWeight="500"
                  color={theme.palette.neutral[500]}
                >
                  {t("Service Date:")}
                  <Typography
                    component="span"
                    fontSize={{ xs: "11px", md: "12px" }}
                    fontWeight="600"
                    marginLeft="5px"
                    color={theme.palette.neutral[700]}
                  >
                    <CustomFormatedTime date={data.schedule_at} />
                    {", "}
                    {moment(data.schedule_at).format("DD MMM YYYY")}
                  </Typography>
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack alignItems="flex-end">
          {/* Estimated Arrival - server-computed, hidden by the server for
              closed orders, which this renders as their outcome instead. */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <EstimatedArrival
              trackData={trackData}
              isLoading={trackDataIsLoading || trackDataIsFetching}
            />
          </Stack>
          {configData?.order_delivery_verification ? (
            <Typography
              fontSize={{ xs: "10px", md: "14px" }}
              fontWeight="600"
              color={theme.palette.primary.main}
            >
              <Typography
                fontSize={{ xs: "10px", md: "14px" }}
                fontWeight="600"
                color={theme.palette.neutral[500]}
                component="span"
              >
                {t("Order OTP")}:{" "}
              </Typography>
              {trackData?.otp}
            </Typography>
          ) : null}
          {!isServiceBooking &&
            (Boolean(trackData?.is_cross_border) ||
              Boolean(trackData?.is_wholesale) ||
              String(trackData?.module_id) === String(WHOLESALE_MODULE_ID) ||
              trackData?.order_type === "wholesale") && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={async () => {
                  const targetId =
                    trackData?.id ?? data?.[0]?.order_id ?? data?.id ?? id;
                  if (!targetId) return;
                  const preWin = window.open("", "_blank");
                  try {
                    const res = await MainApi.post(
                      `/api/v1/trade/orders/${targetId}/esperworks-invoice`
                    );
                    const payload = res?.data;
                    if (payload?.esperworks_url) {
                      if (preWin) {
                        preWin.location.href = payload.esperworks_url;
                      } else {
                        window.open(payload.esperworks_url, "_blank", "noopener");
                      }
                      return;
                    }
                    const inv = payload?.invoice;
                    if (inv) {
                      const print = buildPrintDoc(
                        `${payload.invoice_number || "Invoice"} - EsperWorks Proforma & Waybill`,
                        preWin
                      );
                      if (!print) {
                        toast.error(t("Please allow popups to view the Proforma & Waybill."));
                        return;
                      }
                      const { win, doc, body } = print;

                      const header = addEl(
                        doc,
                        body,
                        "div",
                        null,
                        "display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #2e5a27;padding-bottom:16px"
                      );
                      const brand = addEl(doc, header, "div");
                      addEl(
                        doc,
                        brand,
                        "h2",
                        "ADUANEFIE AGRO PROFORMA & WAYBILL",
                        "margin:0;color:#2e5a27"
                      );
                      addEl(
                        doc,
                        brand,
                        "p",
                        `Powered by EsperWorks (${inv.provider || ""})`,
                        MUTED
                      );
                      const meta = addEl(
                        doc,
                        header,
                        "div",
                        null,
                        "text-align:right"
                      );
                      addEl(doc, meta, "strong", payload.invoice_number);
                      addEl(doc, meta, "p", `Date: ${inv.issue_date || ""}`, MUTED);

                      const parties = addEl(
                        doc,
                        body,
                        "div",
                        null,
                        "display:flex;justify-content:space-between;margin:20px 0;font-size:14px"
                      );
                      const supplier = addEl(doc, parties, "div");
                      addEl(doc, supplier, "strong", "Supplier / Farm:");
                      addEl(doc, supplier, "div", inv.supplier?.name);
                      addEl(doc, supplier, "div", inv.supplier?.phone);
                      const client = addEl(
                        doc,
                        parties,
                        "div",
                        null,
                        "text-align:right"
                      );
                      addEl(doc, client, "strong", "Buyer / Consignee:");
                      addEl(doc, client, "div", inv.client?.name);
                      addEl(doc, client, "div", inv.client?.phone);
                      addEl(doc, client, "div", inv.client?.address);

                      const table = addEl(
                        doc,
                        body,
                        "table",
                        null,
                        "width:100%;border-collapse:collapse;font-size:14px"
                      );
                      const head = addEl(doc, table, "thead");
                      const headRow = addEl(doc, head, "tr", null, "background:#f4f6f3");
                      addEl(doc, headRow, "th", "Commodity", "padding:8px;text-align:left");
                      addEl(doc, headRow, "th", "Qty · Unit · Grade", "padding:8px;text-align:left");
                      addEl(doc, headRow, "th", "Weight", "padding:8px;text-align:left");
                      addEl(doc, headRow, "th", "Amount", "padding:8px;text-align:right");
                      const rows = addEl(doc, table, "tbody");
                      (Array.isArray(inv.items) ? inv.items : []).forEach((it) => {
                        const row = addEl(doc, rows, "tr");
                        addEl(doc, row, "td", it.name, CELL);
                        addEl(
                          doc,
                          row,
                          "td",
                          `${it.quantity} × ${it.unit} (${it.crop_grade})`,
                          CELL
                        );
                        addEl(doc, row, "td", `${it.line_weight_kg || 0} kg`, CELL);
                        addEl(
                          doc,
                          row,
                          "td",
                          `₵ ${Number(it.line_total || 0).toFixed(2)}`,
                          `${CELL};text-align:right`
                        );
                      });

                      const totals = addEl(
                        doc,
                        body,
                        "div",
                        null,
                        "margin-top:20px;text-align:right;font-size:14px"
                      );
                      const totalRow = (label, value, heading) => {
                        const line = addEl(doc, totals, heading || "p");
                        addEl(doc, line, "strong", label);
                        line.appendChild(doc.createTextNode(` ${value}`));
                      };
                      totalRow("Total Payload Weight:", `${inv.total_weight_kg} kg`);
                      totalRow(
                        "Delivery Charge:",
                        `₵ ${Number(inv.delivery_charge || 0).toFixed(2)}`
                      );
                      totalRow(
                        "Trade & Crop Insurance:",
                        `₵ ${Number(inv.insurance_fee || 0).toFixed(2)}`
                      );
                      totalRow(
                        "Total:",
                        `₵ ${Number(inv.total_amount || 0).toFixed(2)}`,
                        "h3"
                      );
                      const printButton = addEl(
                        doc,
                        body,
                        "button",
                        "Print / Save PDF",
                        "margin-top:24px;padding:8px 16px;background:#2e5a27;color:#fff;border:none;border-radius:6px;cursor:pointer"
                      );
                      printButton.addEventListener("click", () => win.print());
                    }
                  } catch (e) {
                    if (preWin && !preWin.closed) preWin.close();
                    toast.error(t("Unable to generate EsperWorks invoice"));
                  }
                }}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "12px" }}
              >
                {t("Proforma & Waybill")}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={async () => {
                  const targetId =
                    trackData?.id ?? data?.[0]?.order_id ?? data?.id ?? id;
                  if (!targetId) return;
                  const preWin = window.open("", "_blank");
                  try {
                    const res = await MainApi.post(
                      `/api/v1/trade/orders/${targetId}/esperworks-contract`
                    );
                    const payload = res?.data;
                    if (payload?.esperworks_signing_url) {
                      if (preWin) {
                        preWin.location.href = payload.esperworks_signing_url;
                      } else {
                        window.open(
                          payload.esperworks_signing_url,
                          "_blank",
                          "noopener"
                        );
                      }
                      return;
                    }
                    const ctr = payload?.contract;
                    if (ctr) {
                      const print = buildPrintDoc(
                        `${payload.contract_number || "Contract"} - EsperWorks Trade Contract`,
                        preWin
                      );
                      if (!print) {
                        toast.error(t("Please allow popups to view the Trade Contract."));
                        return;
                      }
                      const { win, doc, body } = print;

                      const header = addEl(
                        doc,
                        body,
                        "div",
                        null,
                        "border-bottom:2px solid #2e5a27;padding-bottom:12px"
                      );
                      addEl(doc, header, "h2", ctr.title, "margin:0;color:#2e5a27");
                      addEl(
                        doc,
                        header,
                        "p",
                        `Contract Ref: ${payload.contract_number || ""} · Date: ${ctr.effective_date || ""} · Powered by ${ctr.provider || ""}`,
                        MUTED
                      );

                      const parties = addEl(
                        doc,
                        body,
                        "p",
                        null,
                        "font-size:14px"
                      );
                      addEl(doc, parties, "strong", "Supplier / Farm:");
                      parties.appendChild(
                        doc.createTextNode(
                          ` ${ctr.supplier?.name || ""} (${ctr.supplier?.phone || ""}) `
                        )
                      );
                      addEl(doc, parties, "br");
                      addEl(doc, parties, "strong", "Buyer / Off-Taker:");
                      parties.appendChild(
                        doc.createTextNode(
                          ` ${ctr.buyer?.name || ""} (${ctr.buyer?.phone || ""}) - ${ctr.buyer?.delivery_address || ""}`
                        )
                      );

                      addEl(
                        doc,
                        body,
                        "h4",
                        "1. Contracted Produce & Specifications",
                        "margin-bottom:6px"
                      );
                      const items = addEl(
                        doc,
                        body,
                        "ul",
                        null,
                        "font-size:14px"
                      );
                      (Array.isArray(ctr.items) ? ctr.items : []).forEach((it) => {
                        const item = addEl(doc, items, "li");
                        addEl(doc, item, "strong", it.name);
                        item.appendChild(
                          doc.createTextNode(
                            ` - ${it.quantity} × ${it.unit} (${it.crop_grade}) · ${it.line_weight_kg || 0} kg · ₵ ${Number(it.line_total || 0).toFixed(2)}`
                          )
                        );
                      });

                      const value = addEl(doc, body, "p", null, "font-size:14px");
                      addEl(doc, value, "strong", "Total Contract Value:");
                      value.appendChild(
                        doc.createTextNode(
                          ` ₵ ${Number(ctr.total_amount || 0).toFixed(2)} · Total Payload: ${ctr.total_weight_kg} kg`
                        )
                      );

                      addEl(
                        doc,
                        body,
                        "h4",
                        "2. Quality, Escrow & Transit Assurance Terms",
                        "margin-bottom:6px"
                      );
                      const terms = addEl(
                        doc,
                        body,
                        "ul",
                        null,
                        "font-size:13px"
                      );
                      [
                        ["Quality Inspection:", ctr.terms?.quality_inspection],
                        ["Escrow Release:", ctr.terms?.escrow_release],
                        ["Transit Coverage:", ctr.terms?.transit_coverage],
                      ].forEach(([label, text]) => {
                        const term = addEl(doc, terms, "li");
                        addEl(doc, term, "strong", label);
                        term.appendChild(doc.createTextNode(` ${text || ""}`));
                      });

                      const sign = addEl(
                        doc,
                        body,
                        "div",
                        null,
                        "margin-top:24px;padding:16px;border:1px solid #ccc;border-radius:8px;background:#f9faf8"
                      );
                      addEl(
                        doc,
                        sign,
                        "label",
                        "Digital Signature (Full Legal Name):",
                        "display:block;font-size:13px;font-weight:bold;margin-bottom:6px"
                      );
                      const sigInput = addEl(
                        doc,
                        sign,
                        "input",
                        null,
                        "padding:8px;width:280px;margin-right:8px"
                      );
                      sigInput.setAttribute("type", "text");
                      sigInput.setAttribute("id", "sig");
                      sigInput.setAttribute(
                        "placeholder",
                        "Type full name to e-Sign via EsperWorks"
                      );
                      const signButton = addEl(
                        doc,
                        sign,
                        "button",
                        "e-Sign Contract",
                        "padding:8px 16px;background:#2e5a27;color:#fff;border:none;border-radius:6px;cursor:pointer"
                      );
                      const status = addEl(
                        doc,
                        sign,
                        "p",
                        "",
                        "margin-top:10px;color:#2e5a27;font-weight:bold;font-size:13px"
                      );
                      signButton.addEventListener("click", () => {
                        const name = (sigInput.value || "").trim();
                        if (!name) {
                          win.alert("Enter your name to sign");
                          return;
                        }
                        status.textContent = `Signed digitally by ${name} on ${new Date().toLocaleString()}`;
                      });
                      const printButton = addEl(
                        doc,
                        sign,
                        "button",
                        "Print / Save PDF",
                        "padding:8px 16px;margin-left:8px;border:1px solid #2e5a27;background:#fff;color:#2e5a27;border-radius:6px;cursor:pointer"
                      );
                      printButton.addEventListener("click", () => win.print());
                    }
                  } catch (e) {
                    if (preWin && !preWin.closed) preWin.close();
                    toast.error(t("Unable to load EsperWorks contract"));
                  }
                }}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "12px" }}
              >
                {t("Trade Contract & e-Sign")}
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      {!isServiceBooking && trackData?.order_status && (
        <Box
          sx={{
            width: "100%",
            mt: 1.5,
            p: 1.5,
            borderRadius: "10px",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            {[
              {
                key: "confirmed",
                label: t("1. Confirmed & Escrow Secured"),
                done: [
                  "pending",
                  "confirmed",
                  "processing",
                  "handover",
                  "picked_up",
                  "delivered",
                ].includes(trackData?.order_status),
              },
              {
                key: "packed",
                label: t("2. Harvested, Graded & Packed"),
                done: [
                  "processing",
                  "handover",
                  "picked_up",
                  "delivered",
                ].includes(trackData?.order_status),
              },
              {
                key: "transit",
                label: t("3. In Transit (Fleet Dispatched)"),
                done: ["picked_up", "delivered"].includes(
                  trackData?.order_status
                ),
              },
              {
                key: "delivered",
                label: t("4. Delivered & Inspected"),
                done: trackData?.order_status === "delivered",
              },
            ].map((step) => (
              <Box
                key={step.key}
                sx={{
                  px: 1.25,
                  py: 0.6,
                  borderRadius: "6px",
                  backgroundColor: step.done
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.text.secondary, 0.06),
                  color: step.done
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  fontSize: "11.5px",
                  fontWeight: step.done ? 700 : 500,
                }}
              >
                {step.label}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <CustomModal
        openModal={openModalOffline}
        handleClose={() => handleOfflineClose()}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={() => handleOfflineClose()}
            sx={{
              zIndex: "99",
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.neutral[100],
              borderRadius: "50%",
              [theme.breakpoints.down("md")]: {
                top: 10,
                right: 5,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
          </IconButton>
        </CustomStackFullWidth>
        <OfflineOrderDetailsModal
          trackData={trackData}
          trackDataIsLoading={trackDataIsLoading}
          trackDataIsFetching={trackDataIsFetching}
          handleOfflineClose={handleOfflineClose}
          page={page}
          setOpenPaymentMethod={setOpenPaymentMethod}
          setPaymentFailedData={setPaymentFailedData}
          refetchTrackData={refetchTrackData}
        />
      </CustomModal>

      <CustomModal
        openModal={openModalForPayment}
        setModalOpen={setModalOpenForPayment}
        handleClose={() => setModalOpenForPayment(false)}
      >
        <DigitalPaymentManage
          setModalOpenForPayment={setModalOpenForPayment}
          setModalOpen={setOpenModal}
          refetchOrderDetails={refetchOrderDetails}
          refetchTrackData={refetchTrackData}
          id={trackData?.id}
          moduleType={trackData?.module_type || trackData?.module?.module_type}
        />
      </CustomModal>

      <CustomModal
        openModal={openPaymentMethod}
        handleClose={() => setOpenPaymentMethod(false)}
      >
        <PaymentMethod
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          zoneData={zoneData}
          configData={configData}
          orderType={trackData?.order_type}
          usePartialPayment={false}
          setOpenModel={setOpenPaymentMethod}
          forprescription={trackData?.prescription_order}
          offlinePaymentOptions={offlinePaymentOptions}
          paymentMethodImage={null}
          setPaymentMethodImage={null}
          setSwitchToWallet={null}
          isZoneDigital={isZoneDigital}
          handlePartialPayment={() => setPaymentMethod("wallet")}
          walletBalance={profileInfo?.wallet_balance}
          removePartialPayment={null}
          switchToWallet={null}
          customerData={{ data: profileInfo }}
          failed
          payableAmount={trackData?.order_amount}
          failedOrderPlace={failedOrderPlace}
        />
      </CustomModal>

      <Drawer
        anchor="right"
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        variant="temporary"
        sx={{
          zIndex: 1300,
          "& .MuiDrawer-paper": {
            width: { xs: "300px", sm: "400px", md: "450px" },
            padding: "20px",
            boxSizing: "border-box",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: "10px" }}
        >
          <Typography fontSize="16px" fontWeight="700">
            {t("Give Review")}
          </Typography>
          <IconButton
            onClick={() => setOpenReviewModal(false)}
            sx={{
              backgroundColor: (theme) => theme.palette.neutral[200],
              borderRadius: "50%",
              padding: "5px",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.neutral[300],
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Stack>
        <CustomDivider border="1px" />
        <RateAndReview
          trackData={trackData}
          onAllItemsReviewed={() => {
            setOpenReviewModal(false);
            // Refresh order + track data so `is_reviewed` reflects the new
            // review and review CTAs update immediately.
            refetchTrackData?.();
            refetchOrderDetails?.();
          }}
          data={data}
          isServiceBooking={isServiceBooking}
        />
      </Drawer>
    </CustomStackFullWidth>
    // </HeadingBox>
  );
};

export default TopDetails;
