import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
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
  SheetDescription,
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
import { tours as initialTours } from "@/mocks/mocks";
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import { StatusBadge } from "../../components/layout/AdminLayout";
import TourForm from "./components/ToursForm";
import { TourRow } from "./types";


export default function ToursPage() {
  const [rows, setRows] = useState<TourRow[]>(
    initialTours.map((t: any, i: any) => ({
      ...t,
      status: i % 5 === 0 ? "inactive" : "active",
    })),
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<TourRow | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) &&
          (category === "all" || r.category === category) &&
          (status === "all" || r.status === status),
      ),
    [rows, search, category, status],
  );
  const { paged, total, pageCount, safePage, start } = usePaginated(
    filtered,
    page,
    pageSize,
  );

  function openNew() {
    setEditing({
      id: `new-${Date.now()}`,
      title: "",
      description: "",
      longDescription: "",
      price: 0,
      duration: 1,
      difficulty: "Easy",
      category: "Adventure",
      images: [],
      capacity: 10,
      rating: 0,
      reviewCount: 0,
      popularity: 0,
      highlights: [],
      itinerary: [],
      reviews: [],
      status: "active",
    });
    setOpen(true);
  }

  function save(row: TourRow) {
    setRows((prev) => {
      const exists = prev.find((r) => r.id === row.id);
      if (exists) return prev.map((r) => (r.id === row.id ? row : r));
      return [row, ...prev];
    });
    toast.success(`Saved "${row.title || "Untitled tour"}"`);
    setOpen(false);
  }

  function del(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Tour deleted");
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tours…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Adventure">Adventure</SelectItem>
            <SelectItem value="Cultural">Cultural</SelectItem>
            <SelectItem value="Family">Family</SelectItem>
            <SelectItem value="Luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full bg-white sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={openNew}
          className="bg-teal-deep hover:bg-teal-deep/90"
        >
          <Plus className="h-4 w-4" /> Add New Tour
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <img
                    src={t.images[0]}
                    className="h-10 w-14 rounded object-cover"
                    alt=""
                  />
                </TableCell>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>${t.price}</TableCell>
                <TableCell>{t.duration}d</TableCell>
                <TableCell>{t.difficulty}</TableCell>
                <TableCell>{t.capacity}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={t.status === "active"}
                      onCheckedChange={(v) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === t.id
                              ? { ...r, status: v ? "active" : "inactive" }
                              : r,
                          ),
                        )
                      }
                    />
                    <StatusBadge status={t.status} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => del(t.id)}>
                    <Trash2 className="h-4 w-4 text-rose-600" />
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
          resetKey={`${search}|${category}|${status}`}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {editing?.title ? `Edit: ${editing.title}` : "Add new tour"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details and click save.
            </SheetDescription>
          </SheetHeader>
          {editing && (
            <TourForm
              value={editing}
              onCancel={() => setOpen(false)}
              onSave={save}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}