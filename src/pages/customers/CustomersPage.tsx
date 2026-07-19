import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { getCustomers } from "@/services/customers";
import type { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const customersQuery = useQuery({
    queryKey: ["customers", debouncedSearch, page, perPage],
    queryFn: () =>
      getCustomers({
        page: page - 1,
        perPage,
        query: debouncedSearch || undefined,
      }),
    placeholderData: (previous) => previous,
  });
  const { total, pageCount, safePage, start } = usePaginated(
    customersQuery.data?.total ?? 0,
    page,
    perPage,
  );

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="bg-white pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
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
            {customersQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-slate-500"
                >
                  Loading customers…
                </TableCell>
              </TableRow>
            )}
            {customersQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load customers.
                </TableCell>
              </TableRow>
            )}
            {customersQuery.data?.data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      className="h-9 w-9 rounded-full object-cover"
                      alt={customer.name}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-slate-100" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-slate-600">
                  {customer.email}
                </TableCell>
                <TableCell>{customer.totalBookings}</TableCell>
                <TableCell>${customer.totalSpent.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(customer.registeredAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(customer)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!customersQuery.isLoading &&
              !customersQuery.isError &&
              !customersQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-slate-500"
                  >
                    No customers found.
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
          resetKey={search}
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
                <SheetTitle>Customer profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <div className="flex items-center gap-4">
                  {selected.avatar ? (
                    <img
                      src={selected.avatar}
                      className="h-16 w-16 rounded-full object-cover"
                      alt={selected.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-slate-100" />
                  )}
                  <div>
                    <div className="font-display text-lg">{selected.name}</div>
                    <div className="text-sm text-slate-500">
                      {selected.email}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Since{" "}
                      {new Date(selected.registeredAt).toLocaleDateString()}
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
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
