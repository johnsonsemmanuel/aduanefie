import { useState } from "react";
import { alpha, Button, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import MainApi from "api-manage/MainApi";
import toast from "react-hot-toast";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import RoomIcon from "@mui/icons-material/Room";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";
import HttpsIcon from "@mui/icons-material/Https";
import { useTheme } from "@emotion/react";
import { formatPhoneNumber } from "utils/CustomFunctions";
const AccountInfo = ({
  configData,
  deliveryManFormik,
  handleFieldChange,
}) => {
  const theme = useTheme();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");

  const handleVerifyRiderPhone = async () => {
    const raw = String(deliveryManFormik.values.phone || "").trim();
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
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}  sx={{ minHeight: "5rem" }}>
          <CustomPhoneInput
            required
            value={deliveryManFormik.values.phone}
            onHandleChange={(value) => {
              setVerifiedName("");
              handleFieldChange("phone", formatPhoneNumber(value));
            }}
            initCountry={configData?.country}
            touched={deliveryManFormik.touched.phone}
            errors={deliveryManFormik.errors.phone}
            rtlChange="true"
            lanDirection={lanDirection}
            height="45px"
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mt: 0.75 }}>
            <Typography variant="caption" color={verifiedName ? "success.main" : "text.secondary"} sx={{ fontWeight: verifiedName ? 700 : 400 }}>
              {verifiedName ? `${t("Verified")}: ${verifiedName}` : t("Verify MoMo payout name via Paystack")}
            </Typography>
            <Button
              type="button"
              size="small"
              variant="outlined"
              disabled={verifyingPhone || String(deliveryManFormik.values.phone || "").trim().length < 9}
              onClick={handleVerifyRiderPhone}
              sx={{ whiteSpace: "nowrap", fontSize: "11px", py: "2px" }}
            >
              {verifyingPhone ? t("Verifying...") : t("Verify Name")}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} lg={4}>
          <CustomTextFieldWithFormik
            required
            placeholder={t("Password")}
            name="password"
            type="password"
            label={t("Password")}
            onChangeHandler={(value) => {
              handleFieldChange("password", value);
            }}
            touched={deliveryManFormik.touched.password}
            errors={deliveryManFormik.errors.password}
            fieldProps={deliveryManFormik.getFieldProps("password")}
            // onChangeHandler={restaurantNameHandler}

            value={deliveryManFormik.values.password}            
            startIcon={
              <InputAdornment position="start">
                <HttpsIcon
                  sx={{
                    color:
                      deliveryManFormik.touched.password &&
                      !deliveryManFormik.errors.password
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <CustomTextFieldWithFormik
            required
            placeholder={t("Confirm Password")}
            name="confirm_password"
            type="password"
            label={t("Confirm Password")}
            onChangeHandler={(value) => {
              handleFieldChange("confirm_password", value);
            }}
            touched={deliveryManFormik.touched.confirm_password}
            errors={deliveryManFormik.errors.confirm_password}
            fieldProps={deliveryManFormik.getFieldProps("confirm_password")}
            value={deliveryManFormik.values.confirm_password}            
            startIcon={
              <InputAdornment position="start">
                <HttpsIcon
                  sx={{


                    fontSize: "18px",
                  }}
                />
              </InputAdornment>
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AccountInfo;
