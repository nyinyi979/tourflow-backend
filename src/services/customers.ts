import { CustomerListResponse, CustomerQuery } from "@/types/customer";
import { apiFetchWrapper } from ".";

export const getCustomers = (queryParams: CustomerQuery) =>
  apiFetchWrapper<CustomerListResponse>({
    endpoint: "customer",
    queryParams,
  });
