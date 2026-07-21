import type { Booking } from "./types";

const escapeCsvValue = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`;

export const buildBookingsCsv = (bookings: Booking[]) => {
  const columns = [
    "bookingNumber",
    "customer",
    "email",
    "item",
    "travelDate",
    "guests",
    "total",
    "status",
  ];
  const rows = bookings.map((booking) =>
    [
      booking.bookingNumber,
      booking.customer?.name ?? "",
      booking.customer?.email ?? "",
      booking.tour.name,
      booking.travelDate,
      booking.guests.adults + booking.guests.children,
      booking.totalPrice,
      booking.status,
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  return [columns.join(","), ...rows].join("\n");
};

export const downloadCsv = (filename: string, contents: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
