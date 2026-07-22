import { alpha, Grid, InputAdornment } from "@mui/material";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useTheme } from "@emotion/react";

const MOBILE_MONEY_NETWORKS = [
  { label: "MTN MoMo", value: "mtn" },
  { label: "Vodafone Cash", value: "vodafone" },
  { label: "AirtelTigo Money", value: "airteltigo" },
];

/**
 * Reusable Formik-compatible Mobile Money selector.
 * Captures the mobile money network and account number.
 *
 * Props:
 *   formik          — Formik instance
 *   networkField    — string, formik field name for network selection
 *   accountField    — string, formik field name for account number
 *   handleFieldChange — setter function (fieldName, value) => void
 */
const MobileMoneySelector = ({
  formik,
  networkField,
  accountField,
  handleFieldChange,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const networkOptions = MOBILE_MONEY_NETWORKS.map((network) => ({
    label: t(network.label),
    value: network.value,
  }));

  return (
    <Grid container columnSpacing={3}>
      <Grid item xs={12} sm={6} sx={{ minHeight: "5rem" }}>
        <CustomSelectWithFormik
          required
          selectFieldData={networkOptions}
          inputLabel={t("Mobile Money Network")}
          passSelectedValue={(value) => {
            handleFieldChange(networkField, value);
          }}
          touched={formik.touched[networkField]}
          errors={formik.errors[networkField]}
          fieldProps={formik.getFieldProps(networkField)}
          placeholder={t("Select Network")}
          startIcon={
            <AccountBalanceWalletIcon
              sx={{
                color:
                  formik.touched[networkField] && !formik.errors[networkField]
                    ? theme.palette.primary.main
                    : alpha(theme.palette.neutral[400], 0.7),
                fontSize: "18px",
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ minHeight: "5rem" }}>
        <CustomTextFieldWithFormik
          required
          placeholder={t("Mobile Money Account Number")}
          name={accountField}
          type="text"
          label={t("Account Number")}
          onChangeHandler={(value) => {
            handleFieldChange(accountField, value);
          }}
          touched={formik.touched[accountField]}
          errors={formik.errors[accountField]}
          fieldProps={formik.getFieldProps(accountField)}
          value={formik.values[accountField]}
          fontSize="12px"
          startIcon={
            <InputAdornment position="start">
              <PhoneAndroidIcon
                sx={{
                  color:
                    formik.touched[accountField] && !formik.errors[accountField]
                      ? theme.palette.primary.main
                      : alpha(theme.palette.neutral[400], 0.7),
                  fontSize: "18px",
                }}
              />
            </InputAdornment>
          }
        />
      </Grid>
    </Grid>
  );
};

export default MobileMoneySelector;
