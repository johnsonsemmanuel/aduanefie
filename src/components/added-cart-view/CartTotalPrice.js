import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { t } from "i18next";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { cartItemsTotalAmount } from "../../utils/CustomFunctions";

const CartTotalPrice = ({ cartList }) => {
  const totalWeightKg = (cartList || []).reduce((sum, item) => {
    const unitKg = Number(item?.unit_weight_kg || 0);
    const qty = Number(item?.quantity || 1);
    return sum + unitKg * qty;
  }, 0);
  const hasInsuredItem = (cartList || []).some((item) => Boolean(item?.is_insured));

  return (
    <>
      {totalWeightKg > 0 && (
        <CustomStackFullWidth
          justifyContent="space-between"
          direction="row"
          sx={{ padding: "0.75rem 1.4rem 0" }}
        >
          <Typography fontSize="12px" color="text.secondary">
            {t("Est. Payload Weight")}
          </Typography>
          <Typography fontSize="13px" fontWeight="600" color="text.primary">
            {totalWeightKg.toFixed(1).replace(/\.0$/, "")} kg
          </Typography>
        </CustomStackFullWidth>
      )}
      {cartList?.length > 0 && (
        <CustomStackFullWidth
          justifyContent="space-between"
          direction="row"
          sx={{ padding: "0.45rem 1.4rem 0" }}
        >
          <Typography fontSize="12px" color="text.secondary">
            {t("Est. Delivery")}
          </Typography>
          <Typography fontSize="12px" fontWeight="500" color="text.primary">
            {totalWeightKg > 100
              ? t("1–3 days · Heavy Cargo Fleet")
              : t("Same / Next day · Standard Fleet")}
          </Typography>
        </CustomStackFullWidth>
      )}
      {hasInsuredItem && (
        <CustomStackFullWidth
          justifyContent="space-between"
          direction="row"
          sx={{ padding: "0.35rem 1.4rem 0" }}
        >
          <Typography fontSize="11px" color="primary.main" fontWeight="600">
            {t("Includes Trade & Crop Insured items")}
          </Typography>
        </CustomStackFullWidth>
      )}
      <CustomStackFullWidth
        justifyContent="space-between"
        direction="row"
        sx={{ padding: cartList?.length > 0 ? "0.6rem 1.4rem 1.4rem" : "1.4rem" }}
      >
        <Typography fontSize="14px" fontWeight="500">
          {t("Subtotal")}
        </Typography>
        <Typography fontSize="15px" fontWeight="700">
          {getAmountWithSign(cartItemsTotalAmount(cartList))}
        </Typography>
      </CustomStackFullWidth>
    </>
  );
};

export default CartTotalPrice;
