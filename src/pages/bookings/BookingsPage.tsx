import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";
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
import {
  adminBookings,
} from "@/mocks/admin-mocks";
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import BookingDetails from "./components/BookingDetails";
import { Booking } from "@/types/booking";

export default function BookingsPage() {
  const [rows, setRows] = useState<Booking[]>(adminBookings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      rows.filter((b) => {
        const q = search.toLowerCase();
        const matchQ =
          !q ||
          b.id.toLowerCase().includes(q) ||
          b.customer.name.toLowerCase().includes(q);
        const matchS = status === "all" || b.status === status;
        const matchFrom = !from || b.travelDate >= from;
        const matchTo = !to || b.travelDate <= to;
        return matchQ && matchS && matchFrom && matchTo;
      }),
    [rows, search, status, from, to],
  );
  const { paged, total, pageCount, safePage, start } = usePaginated(
    filtered,
    page,
    pageSize,
  );

  function exportCsv() {
    const header = "id,customer,email,tour,travelDate,guests,total,status\n";
    const body = filtered
      .map(
        (b) =>
          `${b.id},"${b.customer.name}",${b.customer.email},"${b.tour.name}",${b.travelDate},${
            b.guests.adults + b.guests.children
          },${b.totalPrice},${b.status}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  }

  function updateStatus(id: string, next: string) {
    setRows((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: next } : b)),
    );
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
    toast.success(`Status updated to ${next}`);
  }

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9 bg-white"
            placeholder="Search by ID or customer name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
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
        <div className="flex gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-white"
          />
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-white"
          />
        </div>
        <Button variant="outline" onClick={exportCsv} className="bg-white">
          <Download className="h-4 w-4" /> Export CSV
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
            {paged.map((b) => (
              <TableRow
                key={b.id}
                className="cursor-pointer"
                onClick={() => setSelected(b)}
              >
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{b.customer.name}</div>
                  <div className="text-xs text-slate-500">
                    {b.customer.email}
                  </div>
                </TableCell>
                <TableCell>{b.tour.name}</TableCell>
                <TableCell>{b.createdAt}</TableCell>
                <TableCell>{b.travelDate}</TableCell>
                <TableCell>
                  {b.guests.adults}A / {b.guests.children}C
                </TableCell>
                <TableCell>${b.totalPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(b);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={safePage}
          pageSize={pageSize}
          total={total}
          pageCount={pageCount}
          start={start}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          resetKey={`${search}|${status}|${from}|${to}`}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono">{selected.id}</SheetTitle>
              </SheetHeader>
              <BookingDetails {...selected} updateStatus={updateStatus} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
