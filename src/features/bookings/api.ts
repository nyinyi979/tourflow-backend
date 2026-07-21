import type { DataResponse } from "@/lib/api/types";
import {
  Booking,
  BookingListResponse,
  BookingQuery,
  UpdateBookingRequest,
} from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const getBookings = (queryParams: BookingQuery) =>
  apiFetchWrapper<BookingListResponse>({
    endpoint: "booking",
    queryParams,
  });

export const updateBooking = (id: string, body: UpdateBookingRequest) =>
  apiFetchWrapper<DataResponse<Booking>>({
    endpoint: `booking/${id}`,
    method: "PUT",
    body,
  });

export const deleteBooking = (id: string) =>
  apiFetchWrapper<DataResponse<Booking>>({
    endpoint: `booking/${id}`,
    method: "DELETE",
  });
