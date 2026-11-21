import { LoadingButton } from "@mui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import useBookingRelation from "api-manage/hooks/custom-hooks/useBookingRelation";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetAutomatedMessage";
import BookingInfo from "components/home/module-wise-components/service/components/my-bookings/booking-details/BookingInfo";
import useCancelServiceBooking from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useCancelServiceBooking";
import ChatWithAdmin from "components/my-orders/order-details/other-order/ChatWithAdmin";
import { getToken } from "helper-functions/getToken";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import MainApi from "api-manage/MainApi";
import "simplebar-react/dist/simplebar.min.css";
import adminImage from "../../../../../public/static/profile/fi_4460756 (1).png";
import CustomImageContainer from "../../../CustomImageContainer";
import CustomModal from "../../../modal";
import ParcelOrderSummery from "../ParcelOrderSummery";
import PrescriptionOrderCalculation from "../prescription-order/PerscriptionOrderCalculation";
import InstructionBox from "./InstructionBox";
import OrderActionActions from "./OrderActionActions";
import OrderCalculation from "./OrderCalculation";
import OrderInfo from "./OrderInfo";
import PaymentSummaryCard from "./PaymentSummaryCard";
import BookingCalculation from "components/home/module-wise-components/service/components/my-bookings/booking-details/BookingCalculation";

const mapBookingOfflinePayment = (offlinePayment) => {
  if (!offlinePayment) return null;
  const { payment_info, method_fields, status, customer_note, note } =
    offlinePayment;

  let parsedMethodFields = [];
  try {
    parsedMethodFields =
      typeof method_fields === "string"
        ? JSON.parse(method_fields)
        : method_fields ?? [];
  } catch {
    parsedMethodFields = [];
  }

  const input = Object.entries(payment_info ?? {})
    .filter(([key]) => key !== "method_id" && key !== "method_name")
    .map(([key, value]) => ({ user_input: key, user_data: value }));

  return {
    data: {
      status,
      customer_note,
      admin_note: note,
      method_name: payment_info?.method_name,
      method_id: payment_info?.method_id,
    },
    method_fields: parsedMethodFields,
    input,
  };
};

const OrderSummery = (props) => {
  const {
    trackOrderData,
    configData,
    t,
    data,
    isLoading,
    dataIsLoading,
    refetchTrackOrder,
    setOpenPaymentMethod,
    handlePayment,
    repayOrderLoading,
    id,
    refetchOrderDetails,
    setOpenModal,
    isBooking,
  } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { isParentRepeatBooking, isSubBooking } = useBookingRelation({
    isBooking,
    data,
  });
  const [openModal, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [cancelBookingModalOpen, setCancelBookingModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimReason, setClaimReason] = useState("Spoilage in transit");
  const [claimDescription, setClaimDescription] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);

  const handleClaimSubmit = async () => {
    if (!claimDescription.trim() || claimDescription.trim().length < 10) {
      toast.error(t("Please describe the issue (at least 10 characters)."));
      return;
    }
    setSubmittingClaim(true);
    try {
      const { data: res } = await MainApi.post("/api/v1/customer/order/insurance-claim", {
        order_id: summaryData?.id,
        reason: claimReason,
        description: claimDescription.trim(),
      });
      toast.success(res?.message || t("Insurance claim submitted!"));
      setClaimModalOpen(false);
      setClaimDescription("");
    } catch (err) {
      toast.error(err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || t("Could not submit insurance claim."));
    } finally {
      setSubmittingClaim(false);
    }
  };
  const { data: automateMessageData } = useGetOrderCancelReason();
  const { mutate: cancelBookingMutate, isLoading: isCancellingBooking } =
    useCancelServiceBooking();

  const closeCancelBookingModal = () => {
    setCancelBookingModalOpen(false);
    setCancelReason("");
    setCancelReasonError(false);
  };

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      setCancelReasonError(true);
      return;
    }
    cancelBookingMutate(
      {
        booking_id: data?.id,
        guest_id: getGuestId(),
        reason: cancelReason.trim(),
      },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message ?? t("Booking cancelled successfully"),
          );
          closeCancelBookingModal();
          refetchTrackOrder?.();
        },
      },
    );
  };

  const summaryData = isBooking
    ? {
        id: data?.id,
        order_status: data?.booking_status,
        payment_status: data?.payment_status,
        payment_method: data?.payment_method,
        offline_payment: mapBookingOfflinePayment(data?.offline_payment),
        // Per-installment breakdown for partial payments (method, status,
        // amount). BookingCalculation reads payments[1] for the non-wallet
        // "Paid By (…)" row; PaymentSummaryCard lists every entry.
        payments: data?.partial_payments ?? [],
        delivery_address: {
          address: data?.service_location?.address,
        },
        order_amount: data?.amount?.booking_amount,
        store_discount_amount: data?.amount?.discount_amount ?? 0,
        flash_admin_discount_amount: 0,
        flash_store_discount_amount: 0,
        coupon_discount_amount: data?.amount?.coupon_discount_amount ?? 0,
        pro_discount: data?.amount?.pro_discount ?? 0,
        ref_bonus_amount: data?.amount?.ref_bonus_amount ?? 0,
        tax_status: data?.amount?.tax_status,
        total_tax_amount: data?.amount?.tax_amount ?? 0,
        additional_charge: data?.amount?.additional_charge ?? 0,
        delivery_charge: 0,
        partially_paid_amount: data?.amount?.partially_paid_amount ?? 0,
        bring_change_amount: data?.bring_change_amount ?? 0,
        delivery_instruction: data?.booking_note,
        cancellation_note: data?.cancellation_reason,
      }
    : trackOrderData;

  const items = isBooking
    ? (data?.booking_details ?? data?.details ?? []).map((detail) => {
        const service = detail?.service ?? {};
        const price =
          detail?.price ?? service?.discounted_price ?? service?.price;
        const calculatedPrice = detail?.calculated_price ?? price;
        return {
          id: detail?.id,
          quantity: detail?.quantity ?? 1,
          price: calculatedPrice,
          add_ons: detail?.add_ons ?? [],
          image_full_url: detail?.image_full_url ?? service?.thumbnail_full_url,
          bundle_details: detail?.bundle_details ?? null,
          item_details: {
            name: detail?.service_name ?? service?.name ?? detail?.name,
            price,
            calculated_price: calculatedPrice,
            variations: detail?.variation ?? detail?.variations ?? [],
          },
        };
      })
    : data;

  const handleImageOnClick = (value) => {
    setModalImage(value);
    setModalOpen(true);
  };
  const handleModalClose = (value) => {
    setModalOpen(value);
    setModalImage(null);
  };

  const REPEAT_PAYMENT_EDITABLE_STATUSES = ["confirmed", "ongoing"];
  const isPaymentFailed = () => {
    const baseFailed =
      (summaryData?.order_status === "failed" ||
        !summaryData?.offline_payment) &&
      (summaryData?.payment_status === "unpaid" ||
        (summaryData?.payments?.[1]?.payment_status === "unpaid" &&
          summaryData?.payments?.[1]?.payment_method !== "cash_on_delivery")) &&
      summaryData?.payment_method !== "cash_on_delivery" &&
      summaryData?.payment_method !== "wallet" &&
      summaryData?.order_status !== "canceled";

    if (!isBooking) return baseFailed;

    if (
      !isSubBooking ||
      !REPEAT_PAYMENT_EDITABLE_STATUSES.includes(data?.booking_status)
    ) {
      return false;
    }

    return baseFailed;
  };

  return (
    <>
      {data && data.module_type === "parcel" ? (
        <ParcelOrderSummery
          data={data}
          trackOrderData={summaryData}
          configData={configData}
          refetchTrackOrder={refetchTrackOrder}
          isPaymentFailed={isPaymentFailed}
          repayOrderLoading={repayOrderLoading}
          setOpenPaymentMethod={setOpenPaymentMethod}
          handlePayment={handlePayment}
          id={id}
          refetchOrderDetails={refetchOrderDetails}
          setOpenModal={setOpenModal}
        />
      ) : (
        <Grid container pr={{ xs: "0px", sm: "0px", md: "40px" }}>
          <Grid container item md={8} xs={12}>
            {isBooking ? (
              <BookingInfo
                data={data}
                summaryData={summaryData}
                configData={configData}
                items={items}
                t={t}
                isSmall={isSmall}
              />
            ) : (
              <OrderInfo
                data={data}
                summaryData={summaryData}
                configData={configData}
                items={items}
                t={t}
                isSmall={isSmall}
              />
            )}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              pl={{ xs: "0px", sm: "20px", md: "25px" }}
              mt="8px"
            >
              {/* Address + Payment + Cutlery - 2-column grid on sm+ */}
              <Box
                sx={{
                  border: (t) =>
                    `1px solid ${alpha(t.palette.neutral[400], 0.2)}`,
                  borderRadius: "14px",
                  padding: { xs: "14px", md: "16px" },
                }}
              >
                {/* Left column: Address + Cutlery stacked */}
                <Stack gap="20px">
                  <Stack>
                    {/* Address card */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      flexWrap="wrap"
                      gap="8px"
                      mb={1}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                          textTransform: "capitalize",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {t("Address")}
                      </Typography>
                      {isBooking && data?.service_location?.get_service_at && (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            px: 1,
                            py: 0.4,
                            borderRadius: "8px",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.12,
                            ),
                            color: theme.palette.primary.main,
                            whiteSpace: "normal",
                            lineHeight: 1.3,
                          }}
                        >
                          {data.service_location.get_service_at === "provider"
                            ? t("Please visit provider location")
                            : t("Provider will come to your location")}
                        </Typography>
                      )}
                    </Stack>
                    {summaryData?.delivery_address?.contact_person_name && (
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          textTransform: "capitalize",
                        }}
                      >
                        {summaryData.delivery_address.contact_person_name}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        lineHeight: 1.55,
                        wordBreak: "break-word",
                      }}
                    >
                      {summaryData?.delivery_address?.address || "-"}
                    </Typography>
                  </Stack>
                  {/* Cutlery card (inside left column) - food orders only */}
                  {summaryData?.module_type === "food" &&
                    summaryData?.cutlery && (
                      <Stack>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "capitalize",
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          {t("Cutlery")}
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignSelf: "flex-start",
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "999px",
                            backgroundColor: alpha(
                              theme.palette.success.main,
                              0.12,
                            ),
                            color: theme.palette.success.main,
                            border: `1px solid ${alpha(
                              theme.palette.success.main,
                              0.25,
                            )}`,
                            fontSize: "14px",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            lineHeight: 1.4,
                          }}
                        >
                          {t("Included")}
                        </Box>
                      </Stack>
                    )}
                  {summaryData?.is_pre_order && (
                    <Stack>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                          textTransform: "capitalize",
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        {t("Pre-Order Reservation")}
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignSelf: "flex-start",
                          px: 1.25,
                          py: 0.5,
                          borderRadius: "999px",
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          color: theme.palette.primary.main,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                          fontSize: "13px",
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {summaryData?.expected_harvest_date
                          ? `${t("Expected Harvest")}: ${summaryData.expected_harvest_date}`
                          : t("Reserved for Harvest")}
                      </Box>
                    </Stack>
                  )}
                  {(summaryData?.is_insured || Number(summaryData?.insurance_fee) > 0) && (
                    <Stack>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          letterSpacing: "0.5px",
                          textTransform: "capitalize",
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        {t("Trade & Crop Insurance")}
                      </Typography>
                      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignSelf: "flex-start",
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "999px",
                            backgroundColor: alpha(theme.palette.success.main, 0.12),
                            color: theme.palette.success.main,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                            fontSize: "13px",
                            fontWeight: 700,
                            lineHeight: 1.4,
                          }}
                        >
                          {Number(summaryData?.insurance_fee) > 0
                            ? `${t("Covered")} · ${getAmountWithSign(summaryData.insurance_fee)}`
                            : t("Covered")}
                        </Box>
                        {getToken() && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setClaimModalOpen(true)}
                            sx={{
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              py: "2px",
                              px: 1.5,
                              textTransform: "none",
                            }}
                          >
                            {t("File Insurance Claim")}
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  )}
                  {!isParentRepeatBooking && (
                    <PaymentSummaryCard
                      {...{
                        t,
                        summaryData,
                        data,
                        isBooking,
                        isPaymentFailed,
                        setOpenPaymentMethod,
                        handlePayment,
                        repayOrderLoading,
                        refetchTrackOrder,
                        configData,
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              pl={{ xs: "0px", sm: "20px", md: "25px" }}
            >
              {summaryData?.unavailable_item_note && (
                <InstructionBox
                  title="Unavailable item Note"
                  note={summaryData?.unavailable_item_note}
                />
              )}
              {summaryData?.delivery_instruction && (
                <InstructionBox
                  title="delivery instruction"
                  note={summaryData?.delivery_instruction}
                />
              )}
              {summaryData?.order_status === "refund_requested" && (
                <InstructionBox
                  title="refund reason"
                  cxxx
                  note={summaryData?.refund?.customer_reason}
                />
              )}
              {summaryData?.order_status === "refund_request_canceled" && (
                <InstructionBox
                  title="refund cancellation note"
                  note={summaryData?.refund_cancellation_note}
                />
              )}
              {summaryData?.order_status === "canceled" &&
                summaryData?.cancellation_note && (
                  <InstructionBox
                    title="cancellation note"
                    note={summaryData?.cancellation_note}
                  />
                )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4} pl={{ xs: "0px", sm: "15px", md: "20px" }}>
            {data?.prescription_order ? (
              <PrescriptionOrderCalculation
                data={data}
                t={t}
                trackOrderData={summaryData}
                configData={configData}
              />
            ) : isBooking ? (
              <BookingCalculation
                data={data}
                t={t}
                trackOrderData={summaryData}
              />
            ) : (
              <OrderCalculation
                data={items}
                t={t}
                trackOrderData={summaryData}
                configData={configData}
              />
            )}
            {!data?.prescription_order && (
              <Box mt="14px">
                <OrderActionActions
                  trackData={summaryData}
                  data={data}
                  configData={configData}
                  id={id}
                  refetchOrderDetails={refetchOrderDetails}
                  refetchTrackData={refetchTrackOrder}
                  setOpenModal={setOpenModal}
                  isBooking={isBooking}
                />
              </Box>
            )}
            {isBooking &&
              (data?.booking_status ?? "").toLowerCase() === "pending" && (
                <Box mt="14px">
                  <Box
                    onClick={() => setCancelBookingModalOpen(true)}
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    <Typography
                      fontWeight="700"
                      fontSize="16px"
                      color={theme.palette.error.main}
                    >
                      {t("Cancel Booking")}
                    </Typography>
                  </Box>
                </Box>
              )}
            {getToken() && !data?.prescription_order && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                mt="1.4rem"
                alignItems="center"
              >
                <CustomImageContainer
                  src={adminImage.src}
                  width="35px"
                  height="35px"
                />

                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="500"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setOpenAdmin(true)}
                >
                  {t(`Massage to `)}
                  <Typography
                    component="span"
                    fontSize={{ xs: "14px", md: "16px" }}
                    fontWeight="500"
                    color="primary"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {configData?.business_name}
                  </Typography>
                </Typography>
              </Stack>
            )}
          </Grid>
        </Grid>
      )}
      <CustomModal
        openModal={claimModalOpen}
        handleClose={() => setClaimModalOpen(false)}
        closeButton
        maxWidth="460px"
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography fontWeight={700} fontSize="18px">
            {t("File Insurance Claim")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              size="small"
              label={t("Reason")}
              value={claimReason}
              onChange={(e) => setClaimReason(e.target.value)}
            >
              {[
                "Spoilage in transit",
                "Damaged goods / equipment",
                "Short delivery / missing items",
                "Harvest failure / unfulfilled pre-order",
              ].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {t(opt)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              minRows={3}
              size="small"
              label={t("Description")}
              placeholder={t("Describe what happened with your order...")}
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setClaimModalOpen(false)} color="inherit">
            {t("Cancel")}
          </Button>
          <LoadingButton
            loading={submittingClaim}
            variant="contained"
            onClick={handleClaimSubmit}
          >
            {t("Submit")}
          </LoadingButton>
        </DialogActions>
      </CustomModal>
      <CustomModal
        openModal={openAdmin}
        handleClose={() => setOpenAdmin(false)}
        closeButton
      >
        <ChatWithAdmin
          automateMessageData={automateMessageData?.data}
          orderID={summaryData?.id}
          isBooking={isBooking}
        />
      </CustomModal>
      <CustomModal
        openModal={cancelBookingModalOpen}
        handleClose={closeCancelBookingModal}
        closeButton
        maxWidth="460px"
      >
        <DialogTitle sx={{ pb: 0, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Cancel Booking")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "14px",
              color: theme.palette.text.secondary,
              textAlign: "center",
              mb: 2,
            }}
          >
            {t("Are you sure you want to cancel this booking?")}
          </Typography>
          <TextField
            label={t("Reason for Cancellation")}
            required
            multiline
            rows={3}
            fullWidth
            value={cancelReason}
            onChange={(e) => {
              setCancelReason(e.target.value);
              if (cancelReasonError) setCancelReasonError(false);
            }}
            error={cancelReasonError}
            helperText={cancelReasonError ? t("Please provide a reason") : ""}
            placeholder={t("Tell us why you're cancelling this booking")}
          />
        </DialogContent>
        <DialogActions sx={{ px: "24px", pb: "20px", gap: "10px" }}>
          <Button
            onClick={closeCancelBookingModal}
            variant="outlined"
            sx={{ flex: 1 }}
          >
            {t("Back")}
          </Button>
          <LoadingButton
            onClick={handleCancelBooking}
            loading={isCancellingBooking}
            variant="contained"
            color="error"
            sx={{ flex: 1 }}
          >
            {t("Cancel Booking")}
          </LoadingButton>
        </DialogActions>
      </CustomModal>
    </>
  );
};

OrderSummery.propTypes = {};

export default memo(OrderSummery);
