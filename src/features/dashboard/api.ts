import { apiFetchWrapper } from "@/lib/api/client";
import type { DashboardResponse } from "./types";

export const getDashboard = () =>
  apiFetchWrapper<DashboardResponse>({ endpoint: "dashboard" });
