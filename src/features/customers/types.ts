import type {
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "@/lib/api/types";

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
  sortBy?: "name" | "email" | "registeredAt" | "createdAt" | "updatedAt";
  orderBy?: SortOrder;
}

export type CustomerListResponse = PaginatedResponse<Customer, CustomerQuery>;
