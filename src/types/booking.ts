import {
  BookingItemType,
  BookingStatus,
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "./types";

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: { name: string; email: string; avatar: string | null } | null;
  tour: { name: string; type: BookingItemType };
  tourId: string | null;
  activityId: string | null;
  customerId: string;
  travelDate: string;
  createdAt: string;
  guests: { adults: number; children: number };
  totalPrice: number;
  status: BookingStatus;
  activity: Array<{ at: string; label: string }>;
}

export interface BookingQuery extends PaginationQuery {
  query?: string;
  status?: BookingStatus;
  itemType?: BookingItemType;
  sortBy?: string;
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
