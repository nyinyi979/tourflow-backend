import { DataResponse } from "@/types/types";
import {
  CreateTourRequest,
  Tour,
  TourListResponse,
  TourQuery,
  UpdateTourRequest,
} from "@/types/tour";
import { apiFetchWrapper } from ".";

export const getTours = async (queryParams: TourQuery) => {
  const result = await apiFetchWrapper<TourListResponse>({
    endpoint: "tour",
    queryParams,
  });
  return result;
};

export const createTour = async (data: CreateTourRequest) => {
  const result = await apiFetchWrapper<DataResponse<Tour>>({
    endpoint: "tour",
    method: "POST",
    body: data,
  });
  return result;
};

export const updateTour = async (data: UpdateTourRequest) => {
  const result = await apiFetchWrapper<DataResponse<Tour>>({
    endpoint: "tour",
    method: "PUT",
    body: data,
  });
  return result;
};

export const deleteTour = async (id: string) => {
  const result = await apiFetchWrapper<DataResponse<Tour>>({
    endpoint: `tour/${id}`,
    method: "DELETE",
  });
  return result;
};
