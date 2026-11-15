import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import { Router, useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { RouteLinksData } from "../demoLinks";
import { setAllData } from "redux/slices/storeRegistrationData";
import { useDispatch } from "react-redux";

const RouteLinks = (props) => {
  const dispatch = useDispatch();
  const { token, configData, centered, links } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const items = Array.isArray(links) && links.length > 0 ? links : RouteLinksData;

  const handleClick = (href, keyValue) => {
    if (keyValue === "loyalty_points" || keyValue === "my_wallet") {
      if (token) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must be login to access this page."));
      }
    } else if (keyValue === "campaigns") {
      const zoneId = localStorage.getItem("zoneid");
      if (zoneId) {
        Router.push(href, undefined, { shallow: true });
      } else {
        toast.error(t("You must pick a zone to access this page."));
      }
    } else if (keyValue === "restaurant_owner" || href === "/store-registration") {
      dispatch(setAllData(null));
      router.push(
        {
          pathname: href,
          query: { active: "active" },
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(href, undefined, { shallow: true });
    }
  };

  const linkSx = {
    fontSize: { xs: "13px", md: "14px" },
    fontWeight: 400,
    color: "neutral.1050",
    letterSpacing: "-0.25px",
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    py: { xs: "4px", md: "5px" },
    cursor: "pointer",
    textAlign: centered ? "center" : "left",
    "&:hover": { color: theme.palette.primary.main },
  };

  return (
    <CustomStackFullWidth
      direction={centered ? "row" : "column"}
      flexWrap={centered ? "wrap" : "nowrap"}
      justifyContent={centered ? "center" : "flex-start"}
      columnGap={centered ? "18px" : "0px"}
      rowGap={centered ? "4px" : "0px"}
      alignItems={centered ? "center" : "flex-start"}
    >
      {items.map((item, index) => {
        if (item?.active === false) return null;
        const keyValue = item?.key || item?.value;
        const href = item?.href || item?.link;
        const label = item?.label || item?.name;
        if (
          (!configData?.toggle_store_registration && keyValue === "restaurant_owner") ||
          (!configData?.toggle_dm_registration && keyValue === "delivery_man")
        ) {
          return null;
        }
        return (
          <Typography key={index} onClick={() => handleClick(href, keyValue)} sx={linkSx}>
            {t(label)}
          </Typography>
        );
      })}
    </CustomStackFullWidth>
  );
};

RouteLinks.propTypes = {};

export default RouteLinks;
