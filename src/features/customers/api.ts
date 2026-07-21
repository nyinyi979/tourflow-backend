import type { CustomerListResponse, CustomerQuery } from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const getCustomers = (queryParams: CustomerQuery) =>
  apiFetchWrapper<CustomerListResponse>({
    endpoint: "customer",
    queryParams,
  });
