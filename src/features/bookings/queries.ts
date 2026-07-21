import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getBookings } from "./api";
import type { BookingQuery } from "./types";

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (params: BookingQuery) => [...bookingKeys.lists(), params] as const,
};

export const bookingListQueryOptions = (params: BookingQuery) =>
  queryOptions({
    queryKey: bookingKeys.list(params),
    queryFn: () => getBookings(params),
    placeholderData: keepPreviousData,
  });
