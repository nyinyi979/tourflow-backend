import { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import {
  deleteBooking,
  getBookings,
  updateBooking,
} from "@/services/bookings";
import type { Booking } from "@/types/booking";
import { BookingItemType, BookingStatus } from "@/types/types";
import BookingDetails from "./components/BookingDetails";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [itemType, setItemType] = useState<BookingItemType | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const bookingsQuery = useQuery({
    queryKey: ["bookings", debouncedSearch, status, itemType, page, perPage],
    queryFn: () =>
      getBookings({
        page: page - 1,
        perPage,
        query: debouncedSearch || undefined,
        status: status === "all" ? undefined : status,
        itemType: itemType === "all" ? undefined : itemType,
      }),
    placeholderData: (previous) => previous,
  });
  const { total, pageCount, safePage, start } = usePaginated(
    bookingsQuery.data?.total ?? 0,
    page,
    perPage,
  );

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status: nextStatus,
    }: {
      id: string;
      status: BookingStatus;
    }) => updateBooking(id, { status: nextStatus }),
    onSuccess: async (response) => {
      setSelected(response.data);
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Status updated to ${response.data.status}`);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Update failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Booking deleted");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  const exportCsv = () => {
    const rows = bookingsQuery.data?.data ?? [];
    const header =
      "bookingNumber,customer,email,item,travelDate,guests,total,status\n";
    const body = rows
      .map(
        (booking) =>
          `${booking.bookingNumber},"${booking.customer?.name ?? ""}",${booking.customer?.email ?? ""},"${booking.tour.name}",${booking.travelDate},${booking.guests.adults + booking.guests.children},${booking.totalPrice},${booking.status}`,
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([header + body], { type: "text/csv" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bookings.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Exported the current page");
  };
  const confirmDelete = (booking: Booking) => {
    if (window.confirm(`Delete booking "${booking.bookingNumber}"?`))
      deleteMutation.mutate(booking.id);
  };

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="bg-white pl-9"
            placeholder="Search by booking number…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(next) => setStatus(next as BookingStatus | "all")}
        >
          <SelectTrigger className="w-full bg-white lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={itemType}
          onValueChange={(next) => setItemType(next as BookingItemType | "all")}
        >
          <SelectTrigger className="w-full bg-white lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All item types</SelectItem>
            <SelectItem value="tour">Tours</SelectItem>
            <SelectItem value="activity">Activities</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={exportCsv}
          disabled={!bookingsQuery.data?.data.length}
          className="bg-white"
        >
          <Download className="h-4 w-4" /> Export page
        </Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Booked</TableHead>
              <TableHead>Travel</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-slate-500"
                >
                  Loading bookings…
                </TableCell>
              </TableRow>
            )}
            {bookingsQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load bookings.
                </TableCell>
              </TableRow>
            )}
            {bookingsQuery.data?.data.map((booking) => (
              <TableRow
                key={booking.id}
                className="cursor-pointer"
                onClick={() => setSelected(booking)}
              >
                <TableCell className="font-mono text-xs">
                  {booking.bookingNumber}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {booking.customer?.name ?? "Deleted customer"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {booking.customer?.email}
                  </div>
                </TableCell>
                <TableCell>{booking.tour.name}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.travelDate}</TableCell>
                <TableCell>
                  {booking.guests.adults}A / {booking.guests.children}C
                </TableCell>
                <TableCell>${booking.totalPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelected(booking);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${booking.bookingNumber}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      confirmDelete(booking);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!bookingsQuery.isLoading &&
              !bookingsQuery.isError &&
              !bookingsQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-slate-500"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <Pagination
          page={safePage}
          pageSize={perPage}
          total={total}
          pageCount={pageCount}
          start={start}
          onPageChange={setPage}
          onPageSizeChange={setPerPage}
          resetKey={`${search}|${status}|${itemType}`}
        />
      </div>
      <Sheet
        open={!!selected}
        onOpenChange={(nextOpen) => !nextOpen && setSelected(null)}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono">
                  {selected.bookingNumber}
                </SheetTitle>
              </SheetHeader>
              <BookingDetails
                booking={selected}
                updating={updateMutation.isPending}
                updateStatus={(id, nextStatus) =>
                  updateMutation
                    .mutateAsync({ id, status: nextStatus })
                    .then(() => undefined)
                }
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
