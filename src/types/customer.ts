import { PaginatedResponse, PaginationQuery, SortOrder } from "./types";

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  registeredAt: string;
  totalBookings: number;
  totalSpent: number;
}

export interface CustomerQuery extends PaginationQuery {
  query?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export type CustomerListResponse = PaginatedResponse<Customer, CustomerQuery>;
