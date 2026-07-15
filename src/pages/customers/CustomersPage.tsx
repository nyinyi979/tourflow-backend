import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import { adminBookings, adminCustomers } from "@/mocks/admin-mocks";
import { Pagination, usePaginated } from "../../components/ui/Pagination";
import { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      adminCustomers.filter((c) => {
        const q = search.toLowerCase();
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q);
        const matchDate = !from || c.registeredAt >= from;
        return matchQ && matchDate;
      }),
    [search, from],
  );
  const { paged, total, pageCount, safePage, start } = usePaginated(
    filtered,
    page,
    pageSize,
  );

  const custBookings = selected
    ? adminBookings.filter((b) => b.customer.email === selected.email)
    : [];

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9 bg-white"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-white sm:w-52"
          placeholder="Registered after"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Total spent</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <img
                    src={c.avatar}
                    className="h-9 w-9 rounded-full object-cover"
                    alt=""
                  />
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-slate-600">{c.email}</TableCell>
                <TableCell>{c.totalBookings}</TableCell>
                <TableCell>${c.totalSpent.toLocaleString()}</TableCell>
                <TableCell>{c.registeredAt}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(c)}
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
          resetKey={`${search}|${from}`}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Customer profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <div className="flex items-center gap-4">
                  <img
                    src={selected.avatar}
                    className="h-16 w-16 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <div className="font-display text-lg">{selected.name}</div>
                    <div className="text-sm text-slate-500">
                      {selected.email}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Since {selected.registeredAt}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-slate-500">
                      Bookings
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {selected.totalBookings}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wider text-slate-500">
                      Total spent
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      ${selected.totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bookings
                  </h4>
                  <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Tour</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {custBookings.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-sm text-slate-500"
                            >
                              No bookings yet
                            </TableCell>
                          </TableRow>
                        )}
                        {custBookings.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-mono text-xs">
                              {b.id}
                            </TableCell>
                            <TableCell>{b.tour.name}</TableCell>
                            <TableCell>{b.travelDate}</TableCell>
                            <TableCell>
                              ${b.totalPrice.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
