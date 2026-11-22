import axios from "axios";
import { safeJsonParse } from "utils/safeJsonParse";
import { readCurrentLocation } from "helper-functions/validLocation";
import { getActiveCountry } from "helper-functions/marketZone";
// NEXT_PUBLIC_BASE_URL may or may not carry a trailing slash. Axios normalises
// that when joining baseURL + path, but every server-side `${baseUrl}${path}`
// template does not - it yields `host//api/v1/...`, which the API answers with
// a 404. Strip it once here so both styles are safe.
export const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(
  /\/+$/,
  "",
);
const MainApi = axios.create({
  baseURL: baseUrl,
});
MainApi.interceptors.request.use(function (config) {
  let zoneid = undefined;
  let token = undefined;
  let language = undefined;
  let currentLocation = null;
  let software_id = 33571750;
  let hostname = process.env.NEXT_CLIENT_HOST_URL;
  let moduleid = undefined;

  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
    token = localStorage.getItem("token");
    language = safeJsonParse(localStorage.getItem("language-setting"), null);
    currentLocation = readCurrentLocation(
      localStorage.getItem("currentLatLng"),
    );
    moduleid = safeJsonParse(localStorage.getItem("module"), null)?.id;
  }
  if (currentLocation) {
    config.headers.latitude = currentLocation.lat;
    config.headers.longitude = currentLocation.lng;
  } else {
    // Never invent a coordinate. Nearby endpoints fail closed when these
    // headers are absent, and list-first views can explain that no location
    // has been set yet.
    delete config.headers.latitude;
    delete config.headers.longitude;
  }
  const zoneidIsValid =
    zoneid &&
    zoneid !== "undefined" &&
    zoneid !== "null" &&
    !/nan/i.test(zoneid) &&
    (() => {
      try {
        const parsed = JSON.parse(zoneid);
        return (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((id) => !Number.isNaN(Number(id)))
        );
      } catch {
        return false;
      }
    })();
  // A zone is only meaningful together with a supported market. Sending the
  // old Ghana [1] fallback would scope Nigerian, Togolese and unknown-market
  // visitors to Ghana, so omit the header and let the API/UI ask for location.
  const activeCountry = getActiveCountry();
  if (zoneidIsValid && activeCountry) {
    config.headers.zoneid = zoneid;
  } else {
    delete config.headers.zoneid;
  }
  if (moduleid && !config.headers.moduleId) config.headers.moduleId = moduleid;
  if (token) config.headers.authorization = `Bearer ${token}`;
  if (language) config.headers["X-localization"] = language;
  if (hostname) config.headers["origin"] = hostname;
  config.headers["X-software-id"] = software_id;
  config.headers["Accept"] = "application/json";
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});
MainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl = String(error?.config?.url || "");
    const isAuthEndpoint = /\/auth\/(login|sign-up|register|verify|forgot-password|reset-password)/i.test(
      reqUrl,
    );
    if (
      typeof window !== "undefined" &&
      status === 401 &&
      !isAuthEndpoint &&
      localStorage.getItem("token")
    ) {
      // Stale or revoked session token: clear it and notify app state so Redux
      // user/cart state resets cleanly without waiting for a full reload.
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("aduanefie:session-expired"));
    }
    return Promise.reject(error);
  },
);

export default MainApi;
