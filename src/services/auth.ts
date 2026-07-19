import {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminResponse,
} from "@/types/auth";
import { apiFetchWrapper } from ".";

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
