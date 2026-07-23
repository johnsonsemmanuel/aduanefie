import React, {useEffect} from "react";
import { Stack } from "@mui/system";
import MapComponent from "components/Map/location-view/MapComponent";
import { IconButton } from "@mui/material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const TrackOrderMap = ({
  trackOrderData,
  userLocation,
  getCurrentLocation,
}) => {
  const [dLat, setDLat] = React.useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (trackOrderData?.delivery_man) {
      setDLat({
        lat: trackOrderData.delivery_man.lat,
        lng: trackOrderData.delivery_man.lng,
      });
    }
  }, [trackOrderData?.delivery_man?.lat]);
  return (
    <Stack
      paddingInline={{ xs: "0px", md: "25px" }}
      position="relative"
      width="100%"

    >
      <MapComponent
        latitude={userLocation.lat}
        longitude={userLocation?.lng}
        deliveryManLat={
          trackOrderData?.delivery_man!==null
            ? dLat?.lat
            : trackOrderData?.store?.latitude
        }
        deliveryManLng={
          trackOrderData?.delivery_man!==null
            ? dLat?.lng
            : trackOrderData?.store?.longitude
        }
        isStore={trackOrderData?.order_status === "picked_up" || trackOrderData?.order_status === "handover" ? false : true}
        store={trackOrderData?.store}
        deliveryMan={trackOrderData?.delivery_man}
        receiver={trackOrderData?.delivery_address}
      />

    </Stack>
  );
};

export default TrackOrderMap;
