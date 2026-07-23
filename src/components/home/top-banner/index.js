import { alpha, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import banner from "../assets/banner.webp";
import { BannerCityIcon } from "components/home/module-wise-components/rental/RentalIcons";
import LeftCar from "/public/static/rental/left_car.png";
import RightCar from "/public/static/rental/right_car.png";
import { useEffect, useState } from "react";
import Image from 'next/image'


const TopBanner = () => {
  const [moduleType, setModuleType] = useState(null);
  const theme = useTheme();
  // Ensure moduleType is set on the client
  useEffect(() => {
    setModuleType(getCurrentModuleType());
  }, []);

  const getBGColor = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return alpha(theme.palette.primary.main, 0.2);
      case ModuleTypes.RENTAL:
        return alpha(theme.palette.primary.main, 0.05);
      default:
        return null;
    }
  };
  const getBGImage = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return banner?.src;
      default:
        return null;
    }
  };
  // if (!moduleType) return null;

  return (
    <CustomBoxFullWidth
   sx={{
        display: { xs: "none", md: "block" },
        width: "100%",
        borderRadius: "12px",
        backgroundColor: "background.paper",
        boxShadow: (theme) => theme.shadows[1],
        position: "relative",
        py: { xs: 4, md: 6 },
        px: { xs: 3, md: 8 },
        mb: 1,
      }}
    >
      {moduleType === "rental" ? (
        <Box
          sx={{
            svg: { position: "absolute" },
            ".left_img": (theme) => ({
              position: "absolute",
              left: "-150px",
              bottom: 0,
              [theme.breakpoints.up("sm")]: {
                left: "-60px",
              },
            }),
            ".right_img": (theme) => ({
              position: "absolute",
              left: "auto",
              right: "-150px",
              bottom: 0,
              [theme.breakpoints.up("sm")]: {
                right: "-50px",
              },
            }),
          }}
        >
       
        </Box>
      ) : (
        <Box sx={{ position: "absolute", height: "100%", width: "100%", "img": { objectFit: "cover", width: "100%", height: "100%" } }}>
          {getBGImage() && <Image width={1917} height={270} src={getBGImage()} alt="banner" priority={true} />}
        </Box>
      )}
    </CustomBoxFullWidth>
  );
};

export default TopBanner;