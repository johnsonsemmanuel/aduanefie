import { useMemo, useState } from "react";
import { Alert, Box, Skeleton, Typography } from "@mui/material";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const NearbyGoogleMap = ({ points, center }) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  const selected = useMemo(
    () => points.find((point) => point.id === selectedId) ?? null,
    [points, selectedId],
  );

  if (loadError) {
    return (
      <Alert severity="warning" icon={false}>
        {t("The map could not load. Use List view instead.")}
      </Alert>
    );
  }

  if (!isLoaded) {
    return <Skeleton variant="rounded" height={320} />;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "320px", borderRadius: "10px" }}
      center={center}
      zoom={13}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {points.map((point) => (
        <Marker
          key={point.id}
          position={{ lat: point.lat, lng: point.lng }}
          title={point.label}
          onClick={() => setSelectedId(point.id)}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelectedId(null)}
        >
          <Box sx={{ maxWidth: 220 }}>
            <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>
              {selected.label}
            </Typography>
            {selected.detail && (
              <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                {selected.detail}
              </Typography>
            )}
          </Box>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default NearbyGoogleMap;
