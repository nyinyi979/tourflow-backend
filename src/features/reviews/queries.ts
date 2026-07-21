import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAdminReviews } from "./api";
import type { ReviewQuery } from "./types";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params: ReviewQuery) => [...reviewKeys.lists(), params] as const,
};

export const reviewListQueryOptions = (params: ReviewQuery) =>
  queryOptions({
    queryKey: reviewKeys.list(params),
    queryFn: () => getAdminReviews(params),
    placeholderData: keepPreviousData,
  });
