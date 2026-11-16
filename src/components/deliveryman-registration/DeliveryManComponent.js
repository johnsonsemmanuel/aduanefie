import { alpha, Box } from "@mui/material";
import H1 from "components/typographies/H1";
import { CustomButton } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import UserInfo from "./UserInfo";
import IdentityInfo from "./IdentityInfo";
import AccountInfo from "./AccountInfo";
import DeliverymanFormWrapper from "./DeliverymanFormWrapper";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
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

const FLEET_REG_DRAFT_KEY = "aduanefie_fleet_reg_draft_v1";

const DeliveryManComponent = ({
  configData,
  applicationTitle = "Logistics Registration",
}) => {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation();
  const [image, setImage] = useState("");
  const [identityImage, setIdentityImage] = useState("");
  const { mutate: registerDeliveryman, isLoading } =
    usePostDeliveryManRegisterInfo();
  const deliveryManFormik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      email: "",
      earning: "",
      referral_code: "",
      zone_id: "",
      vehicle_id: "",
      delivery_scope: "local_farm",
      region: "",
      district: "",
      sub_district: "",
      payload_capacity_kg: "",
      is_cold_chain: "0",
      identity_type: "",
      identity_number: "",
      phone: "",
      password: "",
      confirm_password: "",
      type: "is_delivery",
    },
    validationSchema: deliveryManValidationSchema(),
    validationOptions: {
      abortEarly: false, // ✅ THIS IS THE KEY
    },
    onSubmit: async (values, helpers) => {
      
      try {
        const { confirm_password, ...modifiedValues } = values;
        registerDeliveryman(objectToFormData(modifiedValues), {
          onSuccess: (res) => {
            toast.success(res.message, {
              id: res.message,
            });
            try {
              sessionStorage.removeItem(FLEET_REG_DRAFT_KEY);
            } catch (e) {}
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
  const fleetDraftLoadedRef = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(FLEET_REG_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          deliveryManFormik.setValues((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
    } catch (e) {}
    fleetDraftLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!fleetDraftLoadedRef.current) return;
    try {
      const v = deliveryManFormik.values;
      const draftPayload = {
        f_name: v.f_name,
        l_name: v.l_name,
        email: v.email,
        earning: v.earning,
        referral_code: v.referral_code,
        zone_id: v.zone_id,
        vehicle_id: v.vehicle_id,
        delivery_scope: v.delivery_scope,
        region: v.region,
        district: v.district,
        sub_district: v.sub_district,
        payload_capacity_kg: v.payload_capacity_kg,
        is_cold_chain: v.is_cold_chain,
        identity_type: v.identity_type,
        identity_number: v.identity_number,
        phone: v.phone,
      };
      sessionStorage.setItem(FLEET_REG_DRAFT_KEY, JSON.stringify(draftPayload));
    } catch (e) {}
  }, [deliveryManFormik.values]);
  const handleFieldChange = (field, value) => {
    deliveryManFormik.setFieldValue(field, value);
  };

  const handleReset = () => {
    try {
      sessionStorage.removeItem(FLEET_REG_DRAFT_KEY);
    } catch (e) {}
    deliveryManFormik.resetForm();
    setImage("");
    setIdentityImage("");
  };

  useEffect(() => {
    if (deliveryManFormik.submitCount > 0 && !deliveryManFormik.isValid) {
      const firstErrorEl = document.querySelector('.Mui-error, [aria-invalid="true"]');
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [deliveryManFormik.submitCount, deliveryManFormik.isValid]);
  return (
    <>
      <TitleTopSection>
        <H1
          text={t(applicationTitle)}
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
                />
              }
            />
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
                  background: (theme) => theme.palette.primary.dark, // set hover color here
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
