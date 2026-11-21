import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import giftbox from "./assets/giftbox.gif";

import { useTranslation } from "react-i18next";
import { alpha, Chip, Stack } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import toast from "react-hot-toast";
import {
  CustomColouredTypography,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";

import { getNumberWithConvertedDecimalPoint } from "utils/CustomFunctions";
import { setCampaignItemList, setClearCart } from "redux/slices/cart";
import CustomImageContainer from "../CustomImageContainer";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useTheme } from "@emotion/react";
const SuccessCard = ({ configData, total, order_id }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setClearCart());
    dispatch(setCampaignItemList());
    if (total) {
      setTotalAmount(total);
    } else {
      if (localStorage.getItem("totalAmount")) {
        setTotalAmount(localStorage.getItem("totalAmount"));
      }
    }
  }, []);
  const handlePoints = () => {
    if (totalAmount && configData?.loyalty_point_status === 1) {
      return getNumberWithConvertedDecimalPoint(
        (totalAmount / 100) * configData?.loyalty_point_item_purchase_point,
        configData?.digit_after_decimal_point
      );
    }
  };
  const handleText = () => {
    if (getCurrentModuleType() === "food") {
      return "food";
    } else if (getCurrentModuleType() === "parcel") {
      return "parcel";
    } else {
      return "order";
    }
  };
  const colorId = () => {
    return <Typography color={theme.palette.primary.main}>234248</Typography>;
  };
  const cleanPhone = String(configData?.phone || "").replace(/\D/g, "");
  const supportWhatsApp =
    cleanPhone.startsWith("0") && cleanPhone.length === 10
      ? `233${cleanPhone.slice(1)}`
      : cleanPhone;

  const handleCopyOrderId = () => {
    if (!order_id || typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(String(order_id)).then(() => {
      toast.success(t("Order ID copied"));
    });
  };

  return (
    <CustomStackFullWidth
      height="100%"
      alignItems="center"
      justifyContent="center"
      spacing={2}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Typography
          align="center"
          sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700 }}
          color="text.primary"
          gutterBottom
        >
          {t("Order placed successfully!")}
        </Typography>
        <Typography align="center" sx={{ mb: 1.5, maxWidth: 440 }} color="text.secondary">
          {t(
            `Thank you for shopping with Aduanefie. We have started preparing your ${handleText()} for delivery.`
          )}
        </Typography>
        {order_id && (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
            <Typography align="center" fontWeight={600}>
              {t("Order ID:")}
            </Typography>
            <Chip
              label={`#${order_id}`}
              onClick={handleCopyOrderId}
              icon={<ContentCopyRoundedIcon sx={{ fontSize: 15 }} />}
              sx={{
                fontWeight: 700,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                cursor: "pointer",
              }}
            />
          </Stack>
        )}
        {configData?.loyalty_point_status === 1 && (
          <CustomStackFullWidth
            alignItems="center"
            // justifyContent="center"
          >
            <CustomImageContainer
              src={giftbox.src}
              width="140px"
              borderRadius=".6rem"
              objectfit="contain"
            />
            <CustomColouredTypography color="primary" variant="h3">
              {t("Congratulations!")}
            </CustomColouredTypography>
            {/*<Stack*/}
            {/*  width="100%"*/}
            {/*  alignItems="center"*/}
            {/*  justifyContent="center"*/}
            {/*  direction="row"*/}
            {/*  spacing={0.5}*/}
            {/*  flexWrap="wrap"*/}
            {/*>*/}
            {/*  <Typography align="center" variant="body2">*/}
            {/*    {t("You have earned")}*/}
            {/*  </Typography>*/}
            {/*  <CustomTypography align="center" variant="body2">*/}
            {/*    {handlePoints()}*/}
            {/*    /!*{()=>  localStorage.removeItem('totalAmount')}*!/*/}
            {/*  </CustomTypography>*/}
            {/*  <Typography align="center" variant="body2">*/}
            {/*    {t("point.")}*/}
            {/*  </Typography>*/}
            {/*  <Typography align="center" variant="body2">*/}
            {/*    {t("It will add to your balance when the order is delivered.")}*/}
            {/*  </Typography>*/}
            {/*</Stack>*/}
          </CustomStackFullWidth>
        )}
        <Stack pt="1.5rem" spacing={1.25} sx={{ width: "100%", maxWidth: 320 }}>
          <Button
            onClick={() =>
              router.push(
                order_id ? `/track-order/${order_id}` : "/track-order",
                undefined,
                {
                  shallow: true,
                }
              )
            }
            variant="contained"
            fullWidth
          >
            {t("Track your order")}
          </Button>
          {supportWhatsApp && (
            <Button
              component="a"
              href={`https://wa.me/${supportWhatsApp}?text=${encodeURIComponent(
                `Hi Aduanefie, I just placed Order #${order_id || ""} and would like to coordinate delivery.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              fullWidth
              startIcon={<WhatsAppIcon />}
              sx={{
                borderColor: "#25D366",
                color: "#128C7E",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#128C7E",
                  bgcolor: alpha("#25D366", 0.08),
                },
              }}
            >
              {t("Confirm / Help on WhatsApp")}
            </Button>
          )}
          <Typography
            onClick={() => router.push("/home", undefined, { shallow: true })}
            variant="contained"
            sx={{
              textDecoration: "underline",
              cursor: "pointer",
              textAlign: "center",
              pt: 0.5,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            {t("Continue shopping")}
          </Typography>
        </Stack>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};
export default SuccessCard;
