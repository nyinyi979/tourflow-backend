import { DataResponse } from "@/types/types";
import {
  Activity,
  ActivityListResponse,
  ActivityQuery,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "@/types/activity";
import { apiFetchWrapper } from ".";

export const getActivities = (queryParams: ActivityQuery) =>
  apiFetchWrapper<ActivityListResponse>({
    endpoint: "activity",
    queryParams,
  });

export const createActivity = (body: CreateActivityRequest) =>
  apiFetchWrapper<DataResponse<Activity>>({
    endpoint: "activity",
    method: "POST",
    body,
  });

export const updateActivity = (body: UpdateActivityRequest) =>
  apiFetchWrapper<DataResponse<Activity>>({
    endpoint: "activity",
    method: "PUT",
    body,
  });

export const deleteActivity = (id: string) =>
  apiFetchWrapper<DataResponse<Activity>>({
    endpoint: `activity/${id}`,
    method: "DELETE",
  });
