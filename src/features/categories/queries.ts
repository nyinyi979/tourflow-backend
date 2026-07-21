import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { CategoryType } from "@/lib/api/types";
import { getAllCategories, getCategories } from "./api";
import type { CategoryQuery } from "./types";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params: CategoryQuery) => [...categoryKeys.lists(), params] as const,
  options: (type: CategoryType) =>
    [...categoryKeys.all, "options", type] as const,
};

export const categoryListQueryOptions = (params: CategoryQuery) =>
  queryOptions({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
  });

export const categoryOptionsQueryOptions = (type: CategoryType) =>
  queryOptions({
    queryKey: categoryKeys.options(type),
    queryFn: () => getAllCategories(type),
  });
