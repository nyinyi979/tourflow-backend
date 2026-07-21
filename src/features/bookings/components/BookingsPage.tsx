import { useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, usePaginated } from "@/components/ui/pagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import {
  deleteBooking,
  updateBooking,
} from "../api";
import { bookingKeys, bookingListQueryOptions } from "../queries";
import type { Booking } from "../types";
import type { BookingItemType, BookingStatus } from "@/lib/api/types";
import BookingDetails from "./BookingDetails";
import { dashboardKeys } from "@/features/dashboard/queries";
import { buildBookingsCsv, downloadCsv } from "../utils";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [itemType, setItemType] = useState<BookingItemType | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const bookingsQuery = useQuery(
    bookingListQueryOptions({
      page: page - 1,
      perPage,
      query: debouncedSearch || undefined,
      status: status === "all" ? undefined : status,
      itemType: itemType === "all" ? undefined : itemType,
    }),
  );
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
      await queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      await queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success(`Status updated to ${response.data.status}`);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Update failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: async () => {
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      await queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("Booking deleted");
      setDeleting(null);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  const exportCsv = () => {
    const rows = bookingsQuery.data?.data ?? [];
    downloadCsv("bookings.csv", buildBookingsCsv(rows));
    toast.success("Exported the current page");
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
                <TableCell>
                  {booking.tour?.title ??
                    booking.activity?.title ??
                    "Deleted item"}
                </TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{booking.travelDate}</TableCell>
                <TableCell>
                  {booking.adults}A / {booking.children}C
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
                    disabled={deleteMutation.isPending}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDeleting(booking);
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
      <DeleteConfirmDialog
        open={!!deleting}
        title={`Delete booking “${deleting?.bookingNumber ?? ""}”?`}
        description="This permanently removes the booking record. This action cannot be undone."
        pending={deleteMutation.isPending}
        error={
          deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : undefined
        }
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setDeleting(null);
            deleteMutation.reset();
          }
        }}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </>
  );
}
