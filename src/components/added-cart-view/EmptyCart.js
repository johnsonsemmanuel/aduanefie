import React from "react";
import { Stack } from "@mui/system";

import { CustomTypographyBold } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import CartIcon from "./assets/CartIcon";
import { EmptyCartBox } from "./Cart.style";
import { Button, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import CartActions from "./CartActions";

const EmptyCart = ({ setSideDrawerOpen, cartList, text, icon, subTitle }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const goTo = (path) => {
    setSideDrawerOpen?.(false);
    router.push(path);
  };
  return (
    <Stack height="614px" width="100%">
      <Stack
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingBlockEnd: "2.3rem",
          px: 2,
        }}
        container="true"
        spacing={2.5}
      >
        <EmptyCartBox>
          {icon ? (
            icon
          ) : (
            <CartIcon
              width="28px"
              height="30px"
              color={theme.palette.primary.main}
            />
          )}
        </EmptyCartBox>
        <CustomTypographyBold align="center">
          {t("Your cart is empty")}
        </CustomTypographyBold>
        <Typography fontSize="14px" width="300px" align="center" color="text.secondary">
          {subTitle ??
            t(
              "Start filling your basket with fresh produce, live farm harvests, or shared group buys."
            )}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center" sx={{ maxWidth: 320 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => goTo("/home")}
            sx={{ textTransform: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 600 }}
          >
            {t("Fresh Produce")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => goTo("/group-buys")}
            sx={{ textTransform: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 600 }}
          >
            {t("Group Buys")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => goTo("/live-farming")}
            sx={{ textTransform: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 600 }}
          >
            {t("Live Farm")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => goTo("/market-prices")}
            sx={{ textTransform: "none", borderRadius: "8px", fontSize: "12.5px", fontWeight: 600 }}
          >
            {t("Market Prices")}
          </Button>
        </Stack>
      </Stack>
      <CartActions
        setSideDrawerOpen={setSideDrawerOpen}
        text={text}
        cartList={cartList}
      />
    </Stack>
  );
};

export default EmptyCart;
