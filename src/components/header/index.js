import { AppBarStyle } from "./NavBar.style";

import { NoSsr, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import NewNavBar from "./new-navbar/NewNavBar";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import { useEffect, useState } from "react";
import { MOBILE_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";

const HeaderComponent = ({ configData: propConfigData, position = "fixed" }) => {
  const { configData: reduxConfigData } = useSelector((state) => state.configData);
  const configData =
    propConfigData && Object.keys(propConfigData).length > 0
      ? propConfigData
      : reduxConfigData;

  const isSmall = useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY);

  const [currentLocation] = useState(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("currentLatLng");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const { data: zoneData } = useGetZoneId(currentLocation, !!currentLocation);

  // ✅ store zoneid when received
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (zoneData?.zone_id) {
      localStorage.setItem("zoneid", zoneData.zone_id);
    }
  }, [zoneData]);

  return (
    <AppBarStyle position={position} scrolling={false} isSmall={isSmall}>
      <Box sx={{ width: "100%" }}>
        <NoSsr>
          <NewNavBar configData={configData} />
        </NoSsr>
      </Box>
    </AppBarStyle>
  );
};

export default HeaderComponent;
