export type SortOrder = "asc" | "desc";
export type CategoryType = "tour" | "activity";
export type BookingItemType = "tour" | "activity";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type ReviewStatus = "published" | "hidden";

export interface PaginationQuery {
  page: number;
  perPage: number;
}

export interface ApiSuccessResponse {
  statusCode: number;
  message: string;
}

export type DataResponse<T> = ApiSuccessResponse & { data: T };

export type PaginatedResponse<
  T,
  TQuery extends PaginationQuery = PaginationQuery,
> = ApiSuccessResponse &
  TQuery & {
    data: T[];
    total: number;
  };
