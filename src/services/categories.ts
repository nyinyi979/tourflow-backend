import { CategoryType, DataResponse } from "@/types/types";
import {
  Category,
  CategoryListResponse,
  CategoryQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";
import { apiFetchWrapper } from ".";

export const getCategories = async (queryParams: CategoryQuery) => {
  return apiFetchWrapper<CategoryListResponse>({
    endpoint: "category",
    queryParams,
  });
};

export const getAllCategories = async (type: CategoryType) => {
  return apiFetchWrapper<DataResponse<Category[]>>({
    endpoint: "category/all",
    queryParams: { type },
  });
};

export const createCategory = async (data: CreateCategoryRequest) => {
  return apiFetchWrapper<DataResponse<Category>>({
    endpoint: "category",
    method: "POST",
    body: data,
  });
};

export const updateCategory = async (data: UpdateCategoryRequest) => {
  return apiFetchWrapper<DataResponse<Category>>({
    endpoint: "category",
    method: "PUT",
    body: data,
  });
};

export const deleteCategory = async (id: string) => {
  return apiFetchWrapper<DataResponse<Category>>({
    endpoint: `category/${id}`,
    method: "DELETE",
  });
};
