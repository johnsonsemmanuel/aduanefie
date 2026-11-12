import {
  alpha,
  Box,
  Button,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../../container";
import LargerScreen from "./LargerScreen";
import SmallerScreen from "./SmallerScreen";

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  width: "100%",
  position: "relative",
}));
export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  gap: "10px",
  padding: "12px 15px",
  fontSize: "16px",
  fontWeight: 700,
  maxWidth: "400px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.whiteContainer.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  [theme.breakpoints.down("md")]: {
    padding: "12px 15px",
    fontSize: "14px",
    gap: "8px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
    fontSize: "12px",
    gap: "5px",
  },
}));

const AppDownloadSection = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const goToApp = (s) => {
    window.open(s);
  };

  return (
    <CustomContainer>
      <Wrapper>
        <CustomStackFullWidth>
          {isSmall ? (
            <SmallerScreen
              theme={theme}
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          ) : (
            <LargerScreen
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          )}
        </CustomStackFullWidth>
      </Wrapper>
    </CustomContainer>
  );
};

AppDownloadSection.propTypes = {};

export default AppDownloadSection;
