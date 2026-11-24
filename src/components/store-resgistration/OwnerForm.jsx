import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  alpha,
  Button,
  Grid,
  InputAdornment,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import MainApi from "api-manage/MainApi";
import toast from "react-hot-toast";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getLanguage } from "helper-functions/getLanguage";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const OwnerForm = ({
  RestaurantJoinFormik,
  fNameHandler,
  lNameHandler,
  phoneHandler,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");

  const handleVerifyOwnerPhone = async () => {
    const raw = String(RestaurantJoinFormik.values.phone || "").trim();
    if (raw.length < 9) {
      toast.error(t("Enter a valid mobile number first."));
      return;
    }
    setVerifyingPhone(true);
    setVerifiedName("");
    try {
      const { data } = await MainApi.post("/api/v1/marketer-applications/verify-payout", {
        account_number: raw,
        momo_network: "MTN",
      });
      if (data?.verified && data?.account_name) {
        setVerifiedName(data.account_name);
        const parts = String(data.account_name).trim().split(/\s+/);
        if (!RestaurantJoinFormik.values.f_name && parts[0]) {
          fNameHandler?.(parts[0]);
        }
        if (!RestaurantJoinFormik.values.l_name && parts.length > 1) {
          lNameHandler?.(parts.slice(1).join(" "));
        }
        toast.success(`${t("Paystack verified")}: ${data.account_name}`);
      } else {
        toast.error(data?.message || t("Could not verify this number."));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || t("Could not verify number via Paystack."));
    } finally {
      setVerifyingPhone(false);
    }
  };

  return (
    <CustomStackFullWidth>
      <Typography fontSize={{xs: "16px", sm: "18px"}} fontWeight="500" textAlign="left" p={{xs: 1.2, sm: 2}} sx={{
          borderBottom: `1px solid ${alpha(
            theme.palette.neutral[400],
            0.2
          )}`,
        }}
      >
        {t("Owner Information")}
      </Typography>
      <Stack p={2} pb={2} mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
              <CustomTextFieldWithFormik
              labelColor={alpha(theme.palette.neutral[1000], 0.8)}
              placeholder={t("First name")}
              required="true"
              type="text"
              label={t("First Name")}
              touched={RestaurantJoinFormik.touched.f_name}
              errors={RestaurantJoinFormik.errors.f_name}
              fieldProps={RestaurantJoinFormik.getFieldProps("f_name")}
              onChangeHandler={fNameHandler}
              value={RestaurantJoinFormik.values.f_name}              
              startIcon={
                <InputAdornment position="start">
                  <AccountCircleIcon
                    sx={{
                      color:
                        RestaurantJoinFormik.touched.restaurant_name &&
                        !RestaurantJoinFormik.errors.restaurant_name
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextFieldWithFormik
            labelColor={alpha(theme.palette.neutral[1000],0.8)}
              required="true"
              type="text"
              placeholder={t("Last name")}
              label={t("Last Name")}
              touched={RestaurantJoinFormik.touched.l_name}
              errors={RestaurantJoinFormik.errors.l_name}
              fieldProps={RestaurantJoinFormik.getFieldProps("l_name")}
              onChangeHandler={lNameHandler}
              value={RestaurantJoinFormik.values.l_name}              
              startIcon={
                <InputAdornment position="start">
                  <AccountCircleIcon
                    sx={{
                      color:
                        RestaurantJoinFormik.touched.restaurant_name &&
                        !RestaurantJoinFormik.errors.restaurant_name
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomPhoneInput
              initCountry={configData?.country}
              value={RestaurantJoinFormik.values.phone}
              onHandleChange={(val) => {
                setVerifiedName("");
                phoneHandler(val);
              }}
              touched={RestaurantJoinFormik.touched.phone}
              errors={RestaurantJoinFormik.errors.phone}
              lanDirection={lanDirection}
              height="45px"
              borderRadius="10px"
              required="true"
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mt: 0.75 }}>
              <Typography variant="caption" color={verifiedName ? "success.main" : "text.secondary"} sx={{ fontWeight: verifiedName ? 700 : 400 }}>
                {verifiedName ? `${t("Verified")}: ${verifiedName}` : t("Verify MoMo payout name via Paystack")}
              </Typography>
              <Button
                type="button"
                size="small"
                variant="outlined"
                disabled={verifyingPhone || String(RestaurantJoinFormik.values.phone || "").trim().length < 9}
                onClick={handleVerifyOwnerPhone}
                sx={{ whiteSpace: "nowrap", fontSize: "11px", py: "2px" }}
              >
                {verifyingPhone ? t("Verifying...") : t("Verify Name")}
              </Button>
            </Stack>
          </Grid>
          </Grid>
      </Stack>
    </CustomStackFullWidth>
  );
};
export default OwnerForm;
