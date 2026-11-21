import { useQuery } from "react-query";
import { cashback_list } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";
import { getToken } from "helper-functions/getToken";

const getData = async () => {
	// Cashback is customer-scoped: guests must never hit this endpoint.
	if (!getToken()) return [];
	const { data } = await MainApi.get(cashback_list);
	return getApiCollection(data);
};

export default function useGetCashbackList(handleSuccess) {
	return useQuery(["cashback", getToken()], () => getData(), {
		enabled: false,
		staleTime: 10000,
		cacheTime: 5000,
		onSuccess: handleSuccess,
		onError: onSingleErrorResponse,
	});
}
