import { useMutation } from "react-query";

import MainApi from "../../../MainApi";
import { marketer_registration_api } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import toast from "react-hot-toast";

const marketerRegister = async (payload) => {
  const { data } = await MainApi.post(marketer_registration_api, payload);
  return data;
};

export default function usePostMarketerRegister() {
  return useMutation((payload) => marketerRegister(payload), {
    onError: (err) => {
      onErrorResponse(err);
    },
  });
}
