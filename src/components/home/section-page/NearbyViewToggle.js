import { useEffect, useState } from "react";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getActiveCountry } from "helper-functions/marketZone";
import { readCurrentLocation } from "helper-functions/validLocation";

const NearbyViewToggle = ({ value, onChange, lowBandwidth, locationKey }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [canShowMap, setCanShowMap] = useState(false);

  useEffect(() => {
    setCanShowMap(
      Boolean(
        getActiveCountry() &&
          readCurrentLocation(
            typeof window === "undefined"
              ? null
              : window.localStorage.getItem("currentLatLng"),
          ),
      ),
    );
    setMounted(true);
  }, [locationKey]);

  if (!mounted) return null;

  const mapDisabled = lowBandwidth || !canShowMap;

  return (
    <Stack spacing={0.5} sx={{ px: { xs: "16px", md: 0 } }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value}
        onChange={(_, next) => {
          if (next) onChange(next);
        }}
        sx={{ alignSelf: "flex-start" }}
      >
        <ToggleButton value="list">{t("List")}</ToggleButton>
        <ToggleButton value="map" disabled={mapDisabled}>
          {t("Map")}
        </ToggleButton>
      </ToggleButtonGroup>

      {lowBandwidth && (
        <Typography variant="caption" color="text.secondary">
          {t("Map view is hidden on slow connections. List view keeps working.")}
        </Typography>
      )}
      {!lowBandwidth && !canShowMap && (
        <Typography variant="caption" color="text.secondary">
          {t("Turn on location to unlock map view.")}
        </Typography>
      )}
    </Stack>
  );
};

export default NearbyViewToggle;
