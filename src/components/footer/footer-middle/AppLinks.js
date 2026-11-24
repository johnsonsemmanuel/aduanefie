import { useTheme } from "@emotion/react";
import {
  Button,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import appleicon from "../../../../public/static/footer/apple.svg";
import playstoreicon from "../../../../public/static/footer/playstore.svg";
import CustomImageContainer from "../../CustomImageContainer";
import NextImage from "components/NextImage";

export const CustomButton = styled(Button)(({ theme, graybackground }) => ({
  height: "38px",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor:
    graybackground === "true"
      ? theme.palette.footer.appDownloadButtonBgGray
      : theme.palette.footer.appDownloadButtonBg,
  "&:hover": {
    backgroundColor: theme.palette.footer.appDownloadButtonBgHover,
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: "140px",
    height: "36px",
    padding: "4px 12px",
  },
}));
const AppLinks = (props) => {
  const { graybackground, landingPageData, align = "center" } = props;
  const theme = useTheme();

  let language_direction;
  if (typeof window !== "undefined") {
    language_direction = window.localStorage.getItem("direction");
  }
  const goToApp = (href) => {
    window.open(href);
  };
  const playstoreSrc =
    typeof playstoreicon === "string"
      ? playstoreicon
      : playstoreicon?.src || "/static/footer/playstore.svg";
  const appleSrc =
    typeof appleicon === "string"
      ? appleicon
      : appleicon?.src || "/static/footer/apple.svg";
  const { t } = useTranslation();
  const showPlayStore = Number(landingPageData?.play_status) === 1 && Boolean(landingPageData?.play_store_link);
  const showAppStore = Number(landingPageData?.app_status) === 1 && Boolean(landingPageData?.app_store_link);

  const googlePlay = () => (
    <CustomButton
      onClick={() => {
        if (showPlayStore) goToApp(landingPageData?.play_store_link);
      }}
      variant="contained"
      graybackground={graybackground ? "true" : "false"}
      sx={{ cursor: showPlayStore ? "pointer" : "default" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0.5}
      >
        <NextImage
          src={playstoreSrc}
          alt="GooglePlay"
          objectFit="cover"
          height={20}
          width={20}
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography
            sx={{
              fontSize: { xs: "8px", sm: "10px", md: "10px" },
              color: theme.palette.whiteContainer.main,
              lineHeight: { xs: "10px", sm: "13px", md: "10px" },
            }}
          >
            {showPlayStore ? t("GET IT ON") : t("COMING SOON")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "10px", sm: "13px", md: "12px" },
            }}
            color={theme.palette.whiteContainer.main}
          >
            Google Play
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );
  const appleStore = () => (
    <CustomButton
      onClick={() => {
        if (showAppStore) goToApp(landingPageData?.app_store_link);
      }}
      variant="contained"
      graybackground={graybackground ? "true" : "false"}
      sx={{ cursor: showAppStore ? "pointer" : "default" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0.5}
      >
        <NextImage
          src={appleSrc}
          alt="AppStore"
          objectFit="cover"
          height={20}
          width={20}
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography
            sx={{
              fontSize: { xs: "8px", sm: "10px", md: "10px" },
              color: theme.palette.whiteContainer.main,
              lineHeight: { xs: "10px", sm: "13px", md: "10px" },
            }}
          >
            {showAppStore ? t("Download ON") : t("COMING SOON")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "10px", sm: "12px", md: "12px" },
            }}
            color={theme.palette.whiteContainer.main}
          >
            {t("App Store")}
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );

  return (
    <Stack
      direction="row"
      spacing={2}
      gap={language_direction === "rtl" && "10px"}
      justifyContent={align}
    >
      {googlePlay()}
      {appleStore()}
    </Stack>
  );
};

AppLinks.propTypes = {};

export default AppLinks;
