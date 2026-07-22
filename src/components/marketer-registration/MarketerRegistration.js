import { useState } from "react";
import { alpha, Box } from "@mui/material";
import H1 from "components/typographies/H1";
import { CustomButton } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { TitleTopSection } from "components/deliveryman-registration/CustomStylesDeliveryman";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import usePostMarketerRegister from "api-manage/hooks/react-query/marketer/usePostMarketerRegister";
import toast from "react-hot-toast";
import * as Yup from "yup";

const getFile = (value) => {
  if (!value) return null;
  if (value instanceof File) return value;
  if (Array.isArray(value)) return value[0] || null;
  if (value?.length) return value[0] || null;
  return null;
};

const validationSchema = () => {
  return Yup.object().shape({
    f_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name can't exceed 50 characters"),
    l_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name can't exceed 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    nid_number: Yup.string().required("NID number is required"),
    nid_image: Yup.mixed()
      .required("NID image is required")
      .test("fileType", "Only JPG, JPEG, PNG, and WEBP images are allowed", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
      })
      .test("fileSize", "Image must be less than 1MB", (value) => {
        const file = getFile(value);
        if (!file) return false;
        return file.size <= 1024 * 1024;
      }),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: Yup.string()
      .required("Confirm Password required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    referral_code: Yup.string().optional(),
  });
};

const MarketerRegistration = ({ configData }) => {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation();
  const [nidImage, setNidImage] = useState("");
  const { mutate: registerMarketer, isLoading } = usePostMarketerRegister();

  const formik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      email: "",
      phone: "",
      nid_number: "",
      nid_image: null,
      password: "",
      confirm_password: "",
      referral_code: "",
    },
    validationSchema: validationSchema(),
    validationOptions: {
      abortEarly: false,
    },
    onSubmit: async (values, helpers) => {
      try {
        const { confirm_password, ...modifiedValues } = values;
        registerMarketer(modifiedValues, {
          onSuccess: (res) => {
            toast.success(res.message);
            helpers.resetForm();
            setNidImage("");
            router.push("/home");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleFieldChange = (field, value) => {
    formik.setFieldValue(field, value);
  };

  const handleReset = () => {
    formik.resetForm();
    setNidImage("");
  };

  const singleFileUploadHandler = (e) => {
    const file = e.currentTarget.files[0];
    if (file && file.size > 1024 * 1024) {
      toast.error(t("Image size must be less than 1MB"));
      return;
    }
    setNidImage(file);
    handleFieldChange("nid_image", file);
  };

  return (
    <>
      <TitleTopSection>
        <H1
          text={t("Marketer Application")}
          sx={{
            fontWeight: "700",
            fontSize: { xs: "26px", md: "36px" },
            mt: "20px",
            lineHeight: "36px",
          }}
        />
      </TitleTopSection>

      <form onSubmit={formik.handleSubmit}>
        <Box mt={4}>
          <CustomStackFullWidth spacing={3}>
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.neutral[100],
                borderRadius: "10px",
                p: { xs: 2, md: 3 },
              }}
            >
              <TitleTopSection
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                  padding: "1rem",
                  mb: 2,
                }}
              >
                <H4 text={t("Personal Information")} sx={{ fontWeight: "500", fontSize: "18px" }} />
              </TitleTopSection>
              <CustomStackFullWidth spacing={2}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("First name")}
                  type="text"
                  label={t("First name")}
                  touched={formik.touched.f_name}
                  errors={formik.errors.f_name}
                  fieldProps={formik.getFieldProps("f_name")}
                  onChangeHandler={(value) => handleFieldChange("f_name", value)}
                  value={formik.values.f_name}
                  fontSize="12px"
                />
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Last name")}
                  type="text"
                  label={t("Last name")}
                  touched={formik.touched.l_name}
                  errors={formik.errors.l_name}
                  fieldProps={formik.getFieldProps("l_name")}
                  onChangeHandler={(value) => handleFieldChange("l_name", value)}
                  value={formik.values.l_name}
                  fontSize="12px"
                />
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Email")}
                  type="email"
                  label={t("Email")}
                  touched={formik.touched.email}
                  errors={formik.errors.email}
                  fieldProps={formik.getFieldProps("email")}
                  onChangeHandler={(value) => handleFieldChange("email", value)}
                  value={formik.values.email}
                  fontSize="12px"
                />
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Phone Number")}
                  type="tel"
                  label={t("Phone Number")}
                  touched={formik.touched.phone}
                  errors={formik.errors.phone}
                  fieldProps={formik.getFieldProps("phone")}
                  onChangeHandler={(value) => handleFieldChange("phone", value)}
                  value={formik.values.phone}
                  fontSize="12px"
                />
              </CustomStackFullWidth>
            </Box>

            <Box
              sx={{
                bgcolor: (theme) => theme.palette.neutral[100],
                borderRadius: "10px",
                p: { xs: 2, md: 3 },
              }}
            >
              <TitleTopSection
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                  padding: "1rem",
                  mb: 2,
                }}
              >
                <H4 text={t("Identity Verification")} sx={{ fontWeight: "500", fontSize: "18px" }} />
              </TitleTopSection>
              <CustomStackFullWidth spacing={2}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("NID Number")}
                  type="text"
                  label={t("NID Number")}
                  touched={formik.touched.nid_number}
                  errors={formik.errors.nid_number}
                  fieldProps={formik.getFieldProps("nid_number")}
                  onChangeHandler={(value) => handleFieldChange("nid_number", value)}
                  value={formik.values.nid_number}
                  fontSize="12px"
                />
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={singleFileUploadHandler}
                    style={{ display: "none" }}
                    id="nid-image-upload"
                  />
                  <label htmlFor="nid-image-upload">
                    <CustomButton
                      component="span"
                      sx={{
                        background: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.whiteContainer.main,
                        px: "30px",
                        borderRadius: "5px",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                    >
                      {nidImage ? t("Change NID Image") : t("Upload NID Image")}
                    </CustomButton>
                  </label>
                  {nidImage && (
                    <span style={{ marginLeft: "12px", fontSize: "12px", color: "text.secondary" }}>
                      {nidImage.name}
                    </span>
                  )}
                  {formik.errors.nid_image && (
                    <span style={{ color: "error.main", fontSize: "12px", display: "block", marginTop: "4px" }}>
                      {formik.errors.nid_image}
                    </span>
                  )}
                </Box>
              </CustomStackFullWidth>
            </Box>

            <Box
              sx={{
                bgcolor: (theme) => theme.palette.neutral[100],
                borderRadius: "10px",
                p: { xs: 2, md: 3 },
              }}
            >
              <TitleTopSection
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                  padding: "1rem",
                  mb: 2,
                }}
              >
                <H4 text={t("Security")} sx={{ fontWeight: "500", fontSize: "18px" }} />
              </TitleTopSection>
              <CustomStackFullWidth spacing={2}>
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Password")}
                  type="password"
                  label={t("Password")}
                  touched={formik.touched.password}
                  errors={formik.errors.password}
                  fieldProps={formik.getFieldProps("password")}
                  onChangeHandler={(value) => handleFieldChange("password", value)}
                  value={formik.values.password}
                  fontSize="12px"
                />
                <CustomTextFieldWithFormik
                  required
                  placeholder={t("Confirm Password")}
                  type="password"
                  label={t("Confirm Password")}
                  touched={formik.touched.confirm_password}
                  errors={formik.errors.confirm_password}
                  fieldProps={formik.getFieldProps("confirm_password")}
                  onChangeHandler={(value) => handleFieldChange("confirm_password", value)}
                  value={formik.values.confirm_password}
                  fontSize="12px"
                />
              </CustomStackFullWidth>
            </Box>

            <Box
              sx={{
                bgcolor: (theme) => theme.palette.neutral[100],
                borderRadius: "10px",
                p: { xs: 2, md: 3 },
              }}
            >
              <TitleTopSection
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.neutral[200]}`,
                  padding: "1rem",
                  mb: 2,
                }}
              >
                <H4 text={t("Referral")} sx={{ fontWeight: "500", fontSize: "18px" }} />
              </TitleTopSection>
              <CustomTextFieldWithFormik
                placeholder={t("Referral Code (optional)")}
                type="text"
                label={t("Referral Code")}
                touched={formik.touched.referral_code}
                errors={formik.errors.referral_code}
                fieldProps={formik.getFieldProps("referral_code")}
                onChangeHandler={(value) => handleFieldChange("referral_code", value)}
                value={formik.values.referral_code}
                fontSize="12px"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
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
                {t(isLoading ? "Submitting..." : "Submit Application")}
              </CustomButton>
            </Box>
          </CustomStackFullWidth>
        </Box>
      </form>
    </>
  );
};

export default MarketerRegistration;
