import {
  CategoryType,
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "@/lib/api/types";

export interface Category {
  id: string;
  slug: string;
  label: string;
  image: string | null;
  type: CategoryType;
}

export interface CategoryQuery extends PaginationQuery {
  query?: string;
  type?: CategoryType;
  sortBy?: "slug" | "label" | "type";
  orderBy?: SortOrder;
}

export interface CreateCategoryRequest {
  slug: string;
  label: string;
  image?: string | null;
  type: CategoryType;
  removedImageUrls?: Array<string | null>;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & {
  id: string;
};

export type CategoryListResponse = PaginatedResponse<Category, CategoryQuery>;
export type CategoryResponse = DataResponse<Category>;
