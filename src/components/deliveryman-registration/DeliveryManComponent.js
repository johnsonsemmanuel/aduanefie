import { alpha, Box } from "@mui/material";
import H1 from "components/typographies/H1";
import { CustomButton } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import UserInfo from "./UserInfo";
import IdentityInfo from "./IdentityInfo";
import AccountInfo from "./AccountInfo";
import DeliverymanFormWrapper from "./DeliverymanFormWrapper";
import { useFormik } from "formik";
import { useState } from "react";
import { usePostDeliveryManRegisterInfo } from "api-manage/hooks/react-query/deliveryman-registration/useRegisterDeliveryMan";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";
import deliveryManValidationSchema from "./validation/delivery-validation-schema";
import { useRouter } from "next/router";
import {
  ActonButtonsSection,
  FormSection,
  RegistrationCardWrapper,
  TitleTopSection,
} from "./CustomStylesDeliveryman";
import { objectToFormData } from "helper-functions/objectToFormData";
import { FORM_TITLE } from "./constants";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import CommunityZoneInfo from "./CommunityZoneInfo";
import MobileMoneySelector from "components/common/MobileMoneySelector";

const DeliveryManComponent = ({
  configData,
  applicationTitle = "Deliveryman Application",
  registrationType = "delivery_man",
}) => {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation();
  const [image, setImage] = useState("");
  const [identityImage, setIdentityImage] = useState("");
  const { mutate: registerDeliveryman, isLoading } =
    usePostDeliveryManRegisterInfo();
  const isCommunityAgent = registrationType === "community_agent";
  const deliveryManFormik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      email: "",
      earning: "",
      referral_code: "",
      zone_id: "",
      vehicle_id: "",
      identity_type: "",
      identity_number: "",
      phone: "",
      password: "",
      confirm_password: "",
      type: isCommunityAgent ? "community_agent" : "is_delivery",
      region: "",
      community_zone_id: "",
      momo_network: "",
      momo_number: "",
    },
    validationSchema: deliveryManValidationSchema(),
    validationOptions: {
      abortEarly: false,
    },
    onSubmit: async (values, helpers) => {
      try {
        const { confirm_password, ...modifiedValues } = values;
        registerDeliveryman(objectToFormData(modifiedValues), {
          onSuccess: (res) => {
            toast.success(res.message, {
              id: res.message,
            });
            helpers.resetForm();
            setImage("");
            setIdentityImage("");
            router.push("/home");
          },
          onError: onErrorResponse,
        });
      } catch (err) {
        console.error(err);
      }
    },
  });
  const handleFieldChange = (field, value) => {
    deliveryManFormik.setFieldValue(field, value);
  };

  const handleReset = () => {
    deliveryManFormik.resetForm();
    setImage("");
    setIdentityImage("");
  };
  return (
    <>
      <TitleTopSection>
        <H1
          text={t(isCommunityAgent ? "Community Agent Application" : applicationTitle)}
          sx={{
            fontWeight: "700",
            fontSize: { xs: "26px", md: "36px" },
            mt: "20px",
            lineHeight: "36px",
          }}
        />
      </TitleTopSection>

      <form onSubmit={deliveryManFormik.handleSubmit}>
        <Box mt={4}>
          <FormSection>
            <DeliverymanFormWrapper
              title={FORM_TITLE.userInfo}
              component={
                <UserInfo
                  {...{
                    deliveryManFormik,
                    image,
                    setImage,
                  }}
                  handleFieldChange={handleFieldChange}
                  hideVehicle={isCommunityAgent}
                />
              }
            />
            {isCommunityAgent && (
              <DeliverymanFormWrapper
                title={t("Community Zone Information")}
                component={
                  <CommunityZoneInfo
                    handleFieldChange={handleFieldChange}
                    values={deliveryManFormik.values}
                    touched={deliveryManFormik.touched}
                    errors={deliveryManFormik.errors}
                  />
                }
              />
            )}
            <DeliverymanFormWrapper
              title={FORM_TITLE.identityInfo}
              component={
                <IdentityInfo
                  {...{
                    deliveryManFormik,
                    identityImage,
                    setIdentityImage,
                  }}
                  handleFieldChange={handleFieldChange}
                />
              }
            />
            {isCommunityAgent && (
              <DeliverymanFormWrapper
                title={t("Payout Details")}
                component={
                  <MobileMoneySelector
                    formik={deliveryManFormik}
                    networkField="momo_network"
                    accountField="momo_number"
                    handleFieldChange={handleFieldChange}
                  />
                }
              />
            )}
            <DeliverymanFormWrapper
              title={FORM_TITLE.accountInfo}
              component={
                <AccountInfo
                  configData={configData}
                  {...{
                    deliveryManFormik,
                  }}
                  handleFieldChange={handleFieldChange}
                />
              }
            />
          </FormSection>

          <ActonButtonsSection>
            <CustomButton
              onClick={handleReset}
              disabled={isLoading}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.neutral[200], 0.4),
                color: (theme) => theme.palette.primary.dark,
                px: "30px",

                borderRadius: "5px",
              }}
            >
              {t("Reset")}
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={isLoading}
              sx={{
                background: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.whiteContainer.main,
                px: "30px",
                borderRadius: "5px",
                fontWeight: "500",
                fontSize: "14px",
                "&:hover": {
                  background: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {t(isLoading ? "Submitting..." : "Submit Information")}
            </CustomButton>
          </ActonButtonsSection>
        </Box>
      </form>
    </>
  );
};
export default DeliveryManComponent;
