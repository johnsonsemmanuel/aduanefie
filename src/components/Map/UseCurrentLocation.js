import React, { useCallback, useEffect, useRef, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AllowLocationDialog from "./AllowLocationDialog";
import { IconButton } from "@mui/material";
import { isValidLocation } from "helper-functions/validLocation";

const UseCurrentLocation = ({
  isLoadingCurrentLocation,
  setLoadingCurrentLocation,
  setLocationEnabled,
  setLocation,
  zoneId,
  refetchCurrentLocation,
  setRerenderMap,
  isGeolocationEnabled,
  isGeolocationAvailable,
  positionError,
  coords,
  fromMapModal,
  onZoomRequest,
  getPosition,
}) => {
  const [openLocation, setOpenLocation] = useState(false);
  const locationRequestPending = useRef(false);

  const handleCloseLocation = useCallback(() => {
    locationRequestPending.current = false;
    setOpenLocation(false);
    setLoadingCurrentLocation(false);
  }, [setLoadingCurrentLocation]);

  const applyCoords = useCallback(
    async (nextCoords) => {
      const next = {
        lat: nextCoords?.latitude,
        lng: nextCoords?.longitude,
      };
      if (!isValidLocation(next)) {
        locationRequestPending.current = false;
        setLoadingCurrentLocation(false);
        setOpenLocation(true);
        return;
      }

      setLoadingCurrentLocation(true);
      setLocationEnabled(true);
      setLocation(next);
      onZoomRequest?.();

      if (!fromMapModal && zoneId) {
        localStorage.setItem("zoneid", zoneId);
      }

      try {
        await refetchCurrentLocation?.();
        setRerenderMap?.((prevState) => !prevState);
      } finally {
        locationRequestPending.current = false;
        setLoadingCurrentLocation(false);
        setOpenLocation(false);
      }
    },
    [
      fromMapModal,
      onZoomRequest,
      refetchCurrentLocation,
      setLoadingCurrentLocation,
      setLocation,
      setLocationEnabled,
      setRerenderMap,
      zoneId,
    ],
  );

  // The map button may be pressed before the browser has answered. Apply the
  // coordinate as soon as it arrives instead of requiring a second press.
  useEffect(() => {
    if (!openLocation || !locationRequestPending.current || !coords) return;
    applyCoords(coords);
  }, [applyCoords, coords, openLocation]);

  useEffect(() => {
    if (!positionError) return;
    locationRequestPending.current = false;
    setLoadingCurrentLocation(false);
    setOpenLocation(true);
  }, [positionError, setLoadingCurrentLocation]);

  const handleUseCurrentLocation = async (event) => {
    event.preventDefault();

    const current = { lat: coords?.latitude, lng: coords?.longitude };
    if (isValidLocation(current)) {
      await applyCoords(coords);
      return;
    }

    setOpenLocation(true);
    if (!isGeolocationAvailable || typeof getPosition !== "function") {
      setLoadingCurrentLocation(false);
      return;
    }

    locationRequestPending.current = true;
    setLoadingCurrentLocation(true);
    getPosition();
  };

  return (
    <>
      <IconButton
        disabled={isLoadingCurrentLocation}
        sx={{
          borderRadius: "50%",
          color: (theme) => theme.palette.primary.main,
          backgroundColor: "background.paper",
          boxShadow: "0px 4.48276px 11.2069px rgba(0, 0, 0, 0.1)",
          width: { xs: "28px", md: "35px" },
          height: { xs: "28px", md: "35px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleUseCurrentLocation}
      >
        <GpsFixedIcon sx={{ fontSize: { xs: "18px", md: "24px" } }} />
      </IconButton>
      {openLocation && (
        <AllowLocationDialog
          handleCloseLocation={handleCloseLocation}
          openLocation={openLocation}
          isGeolocationEnabled={isGeolocationEnabled}
          isGeolocationAvailable={isGeolocationAvailable}
          positionError={positionError}
          isLoadingCurrentLocation={isLoadingCurrentLocation}
        />
      )}
    </>
  );
};

export default UseCurrentLocation;
