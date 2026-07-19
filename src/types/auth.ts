import { ApiSuccessResponse, DataResponse } from "./types";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: number;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export type AdminLoginResponse = ApiSuccessResponse & {
  user: {
    id: string;
    email: string;
    password: null;
  };
  token: string;
};

export type AdminResponse = DataResponse<AdminUser>;
