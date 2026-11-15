import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { vehicle_list } from "api-manage/ApiRoutes";

const fetchParcelVehicles = async () => {
  const { data } = await MainApi.get(vehicle_list);
  return Array.isArray(data) ? data : [];
};

export const useGetParcelVehicles = () =>
  useQuery(["parcel-vehicles"], fetchParcelVehicles, {
    staleTime: 1000 * 60 * 5,
  });
