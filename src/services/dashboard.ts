import { apiFetchWrapper } from ".";
import { DashboardResponse } from "@/types/dashboard";

export const getDashboard = () =>
  apiFetchWrapper<DashboardResponse>({ endpoint: "dashboard" });
