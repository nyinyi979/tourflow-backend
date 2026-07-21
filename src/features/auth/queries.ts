import { queryOptions } from "@tanstack/react-query";
import { getAdminMe } from "./api";

export const adminKeys = {
  all: ["admin"] as const,
  me: () => [...adminKeys.all, "me"] as const,
};

export const adminMeQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: adminKeys.me(),
    queryFn: getAdminMe,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
