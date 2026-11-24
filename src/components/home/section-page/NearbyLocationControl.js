import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import { getActiveCountry } from "helper-functions/marketZone";
import {
  isValidLocation,
  readCurrentLocation,
} from "helper-functions/validLocation";

const STATUS = {
  IDLE: "idle",
  REQUESTING: "requesting",
  CHECKING: "checking",
  READY: "ready",
  DENIED: "denied",
  UNAVAILABLE: "unavailable",
  OUTSIDE: "outside",
  UNSUPPORTED: "unsupported",
};

const readSavedLocation = () =>
  typeof window === "undefined"
    ? null
    : readCurrentLocation(window.localStorage.getItem("currentLatLng"));

const NearbyLocationControl = ({ onLocationStored }) => {
  const { t } = useTranslation();
  const countryCodeFromStore = useSelector(
    (state) => state.configData?.countryCode,
  );
  const activeCountry = useMemo(
    () => getActiveCountry(),
    [countryCodeFromStore],
  );

  const [candidate, setCandidate] = useState(null);
  const [status, setStatus] = useState(() => {
    if (!activeCountry) return STATUS.UNSUPPORTED;
    return readSavedLocation() ? STATUS.READY : STATUS.IDLE;
  });
  const requestIdRef = useRef(0);
  const previousCountryRef = useRef(activeCountry);

  useEffect(() => {
    if (previousCountryRef.current === activeCountry) return;
    previousCountryRef.current = activeCountry;
    setCandidate(null);
    setStatus(
      activeCountry
        ? readSavedLocation()
          ? STATUS.READY
          : STATUS.IDLE
        : STATUS.UNSUPPORTED,
    );
  }, [activeCountry]);

  const {
    data: zoneData,
    error: zoneError,
    isFetching: zoneFetching,
  } = useGetZoneId(candidate, !!candidate);

  const requestLocation = useCallback(() => {
    if (!activeCountry) {
      setStatus(STATUS.UNSUPPORTED);
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus(STATUS.UNAVAILABLE);
      return;
    }

    setStatus(STATUS.REQUESTING);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
        };
        if (!isValidLocation(next)) {
          setStatus(STATUS.UNAVAILABLE);
          return;
        }

        // A new id makes the zone lookup a fresh query even when the browser
        // returns exactly the same coordinates on a retry.
        requestIdRef.current += 1;
        setCandidate({
          ...next,
          requestId: requestIdRef.current,
          country: activeCountry,
        });
        setStatus(STATUS.CHECKING);
      },
      (error) => {
        setStatus(error?.code === 1 ? STATUS.DENIED : STATUS.UNAVAILABLE);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60 * 1000,
        timeout: 10 * 1000,
      },
    );
  }, [activeCountry]);

  useEffect(() => {
    if (!candidate || candidate.country !== activeCountry) return;

    if (zoneFetching || (!zoneData && !zoneError)) {
      setStatus(STATUS.CHECKING);
      return;
    }

    if (zoneError) {
      const code = zoneError?.response?.data?.errors?.[0]?.code;
      const responseStatus = zoneError?.response?.status;
      setStatus(
        code === "coordinates" ||
          responseStatus === 403 ||
          responseStatus === 404
          ? STATUS.OUTSIDE
          : STATUS.UNAVAILABLE,
      );
      return;
    }

    const zoneId = zoneData?.zone_id;
    if (!zoneId) {
      setStatus(STATUS.OUTSIDE);
      return;
    }
    if (typeof window === "undefined") return;

    const location = { lat: candidate.lat, lng: candidate.lng };
    window.localStorage.setItem("zoneid", zoneId);
    window.localStorage.setItem("currentLatLng", JSON.stringify(location));
    // The old formatted address belongs to the previous coordinates. Remove
    // it rather than showing a stale address with a freshly detected point.
    window.localStorage.removeItem("location");

    setCandidate(null);
    setStatus(STATUS.READY);
    onLocationStored?.(location);
  }, [
    activeCountry,
    candidate,
    zoneData,
    zoneError,
    zoneFetching,
    onLocationStored,
  ]);

  const message = useMemo(() => {
    switch (status) {
      case STATUS.REQUESTING:
        return t("Getting your location. Please wait...");
      case STATUS.CHECKING:
        return t("Checking if we serve this area...");
      case STATUS.READY:
        return t("Location saved. Showing results near you.");
      case STATUS.DENIED:
        return t(
          "Location permission denied. Enable location access in your browser settings, then try again.",
        );
      case STATUS.OUTSIDE:
        return t("Sorry, we are not available in this area yet.");
      case STATUS.UNAVAILABLE:
        return t("We could not get your location. Please try again.");
      case STATUS.UNSUPPORTED:
        return `${t("Not available in your country")}. ${t("Coming soon")}.`;
      default:
        return t("Turn on location to see results near you.");
    }
  }, [status, t]);

  const severity =
    status === STATUS.READY
      ? "success"
      : status === STATUS.DENIED ||
        status === STATUS.OUTSIDE ||
        status === STATUS.UNAVAILABLE ||
        status === STATUS.UNSUPPORTED
      ? "warning"
      : "info";

  const showAction =
    status !== STATUS.REQUESTING &&
    status !== STATUS.CHECKING &&
    status !== STATUS.UNSUPPORTED;

  return (
    <Stack sx={{ px: { xs: "16px", md: 0 } }}>
      <Alert
        severity={severity}
        icon={false}
        action={
          showAction ? (
            <Button
              color="inherit"
              size="small"
              onClick={requestLocation}
              disabled={!activeCountry}
            >
              {status === STATUS.READY ? t("Use my location") : t("Try again")}
            </Button>
          ) : null
        }
        sx={{
          alignItems: "center",
          "& .MuiAlert-message": {
            width: "100%",
            py: "2px",
          },
          "& .MuiAlert-action": {
            alignItems: "center",
            pt: 0,
          },
        }}
      >
        <Typography sx={{ fontSize: { xs: "12px", md: "14px" } }}>
          <i
            className="fi fi-rr-marker"
            style={{ marginRight: 6, lineHeight: 1 }}
          />
          {message}
        </Typography>
      </Alert>
    </Stack>
  );
};

export default NearbyLocationControl;
