import type { CategoryType, DataResponse } from "@/lib/api/types";
import {
  Category,
  CategoryListResponse,
  CategoryQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const getCategories = (queryParams: CategoryQuery) =>
  apiFetchWrapper<CategoryListResponse>({
    endpoint: "category",
    queryParams,
  });

export const getAllCategories = (type: CategoryType) =>
  apiFetchWrapper<DataResponse<Category[]>>({
    endpoint: "category/all",
    queryParams: { type },
  });

export const createCategory = (data: CreateCategoryRequest) =>
  apiFetchWrapper<DataResponse<Category>>({
    endpoint: "category",
    method: "POST",
    body: data,
  });

export const updateCategory = (data: UpdateCategoryRequest) =>
  apiFetchWrapper<DataResponse<Category>>({
    endpoint: "category",
    method: "PUT",
    body: data,
  });

export const deleteCategory = (id: string) =>
  apiFetchWrapper<DataResponse<Category>>({
    endpoint: `category/${id}`,
    method: "DELETE",
  });
