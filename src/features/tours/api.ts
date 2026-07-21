import type { DataResponse } from "@/lib/api/types";
import {
  CreateTourRequest,
  Tour,
  TourListResponse,
  TourQuery,
  UpdateTourRequest,
} from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const getTours = (queryParams: TourQuery) =>
  apiFetchWrapper<TourListResponse>({
    endpoint: "tour",
    queryParams,
  });

export const createTour = (data: CreateTourRequest) =>
  apiFetchWrapper<DataResponse<Tour>>({
    endpoint: "tour",
    method: "POST",
    body: data,
  });

export const updateTour = (data: UpdateTourRequest) =>
  apiFetchWrapper<DataResponse<Tour>>({
    endpoint: "tour",
    method: "PUT",
    body: data,
  });

export const deleteTour = (id: string) =>
  apiFetchWrapper<DataResponse<Tour>>({
    endpoint: `tour/${id}`,
    method: "DELETE",
  });
