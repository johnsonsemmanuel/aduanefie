import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { community_delivery_check_api } from "api-manage/ApiRoutes";

const checkCommunityDelivery = async (payload) => {
  const { data } = await MainApi.post(community_delivery_check_api, payload);
  return data;
};

export default function usePostCommunityDeliveryCheck() {
  return useMutation((payload) => checkCommunityDelivery(payload), {
    onError: (err) => {
      return err;
    },
  });
}
