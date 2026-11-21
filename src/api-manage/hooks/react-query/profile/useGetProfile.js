import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { profile_info } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";
import { getToken } from "helper-functions/getToken";

const getUserProfile = async () => {
  // Guard at the query boundary too: refetch() bypasses `enabled`.
  if (!getToken()) return undefined;
  const { data } = await MainApi.get(profile_info);
  return getApiContent(data);
};

export default function useGetProfile(userOnSuccessHandler) {
  return useQuery(["user-profile", getToken()], getUserProfile, {
    enabled: false,
    onSuccess: userOnSuccessHandler,
    onError: onSingleErrorResponse,
  });
}
