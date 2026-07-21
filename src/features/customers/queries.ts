import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getCustomers } from "./api";
import type { CustomerQuery } from "./types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params: CustomerQuery) => [...customerKeys.lists(), params] as const,
};

export const customerListQueryOptions = (params: CustomerQuery) =>
  queryOptions({
    queryKey: customerKeys.list(params),
    queryFn: () => getCustomers(params),
    placeholderData: keepPreviousData,
  });
