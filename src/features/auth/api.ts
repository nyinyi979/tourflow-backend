import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminResponse,
} from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const loginAdmin = (body: AdminLoginRequest) =>
  apiFetchWrapper<AdminLoginResponse>({
    endpoint: "admin/login",
    method: "POST",
    body,
  });

export const getAdminMe = () =>
  apiFetchWrapper<AdminResponse>({
    endpoint: "admin/me",
    method: "POST",
  });
