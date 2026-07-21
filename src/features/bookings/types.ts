import {
  BookingItemType,
  BookingStatus,
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "@/lib/api/types";

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: { name: string; email: string; avatar: string | null } | null;
  itemType: BookingItemType;
  tour: { title: string } | null;
  activity: { title: string } | null;
  tourId: string | null;
  activityId: string | null;
  customerId: string;
  travelDate: string;
  createdAt: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "card" | "wallet" | null;
  paymentReference: string | null;
  paidAt: string | null;
  events: Array<{ occurredAt: string; label: string }>;
}

export interface BookingQuery extends PaginationQuery {
  query?: string;
  status?: BookingStatus;
  itemType?: BookingItemType;
  sortBy?:
    | "bookingNumber"
    | "travelDate"
    | "totalPrice"
    | "status"
    | "createdAt";
  orderBy?: SortOrder;
}

export interface UpdateBookingRequest {
  travelDate?: string;
  adults?: number;
  children?: number;
  status?: BookingStatus;
}

export type BookingListResponse = PaginatedResponse<Booking, BookingQuery>;
export type BookingResponse = DataResponse<Booking>;
