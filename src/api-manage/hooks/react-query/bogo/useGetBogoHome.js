import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import MainApi from "../../../MainApi";
import { bogo_home_api } from "api-manage/ApiRoutes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";
import { getApiContent } from "../../../getApiContent";
import { isBackgroundQueryEnabled } from "utils/featureFlags";

const getData = async () => {
  const query = new URLSearchParams({
    guest_id: getGuestId() || "",
  });

  const { data } = await MainApi.get(`${bogo_home_api}?${query}`);
  return getApiContent(data);
};

const useGetBogoHome = (enabled = true) => {
  const configData = useSelector((state) => state.configData?.configData);
  const featureAllowed = isBackgroundQueryEnabled(
    configData,
    "bogo_deals",
    process.env.NEXT_PUBLIC_ENABLE_BOGO === "true"
  );
  const finalEnabled = enabled && featureAllowed;
  return useQuery(["bogo-home", getCurrentModuleType()], getData, {
    enabled: finalEnabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
    onError: () => {},
  });
};

export default useGetBogoHome;
