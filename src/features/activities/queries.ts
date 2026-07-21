import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getActivities } from "./api";
import type { ActivityQuery } from "./types";

export const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (params: ActivityQuery) => [...activityKeys.lists(), params] as const,
};

export const activityListQueryOptions = (params: ActivityQuery) =>
  queryOptions({
    queryKey: activityKeys.list(params),
    queryFn: () => getActivities(params),
    placeholderData: keepPreviousData,
  });
