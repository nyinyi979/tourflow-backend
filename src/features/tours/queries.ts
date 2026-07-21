import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getTours } from "./api";
import type { TourQuery } from "./types";

export const tourKeys = {
  all: ["tours"] as const,
  lists: () => [...tourKeys.all, "list"] as const,
  list: (params: TourQuery) => [...tourKeys.lists(), params] as const,
};

export const tourListQueryOptions = (params: TourQuery) =>
  queryOptions({
    queryKey: tourKeys.list(params),
    queryFn: () => getTours(params),
    placeholderData: keepPreviousData,
  });
