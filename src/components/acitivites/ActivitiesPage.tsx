import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
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
import { activities as initial, type Activity } from "@/lib/mocks";
import { Pagination, usePaginated } from "../ui/Pagination";

type Row = Activity & {
  status: "active" | "inactive";
  description: string;
  longDescription: string;
  meetingPoint: string;
};

const CATS = ["Aerial", "Culinary", "Water", "Cultural", "Outdoor"];

export default function ActivitiesPage() {
  const [rows, setRows] = useState<Row[]>(
    initial.map((a, i) => ({
      ...a,
      longDescription: a.longDescription ?? "",
      meetingPoint: a.meetingPoint ?? "",
      status: i % 4 === 0 ? "inactive" : "active",
    })),
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Row | null>(null);
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
      meetingPoint: "",
      price: 0,
      duration: 1,
      category: "Aerial",
      images: [],
      rating: 0,
      status: "active",
    });

    setOpen(true);
  }

  function save(row: Row) {
    setRows((prev) => {
      const exists = prev.find((r) => r.id === row.id);
      if (exists) return prev.map((r) => (r.id === row.id ? row : r));
      return [row, ...prev];
    });
    toast.success("Activity saved");
    setOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search activities…"
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
            {CATS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
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
          <Plus className="h-4 w-4" /> Add New Activity
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
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <img
                    src={a.images[0]}
                    className="h-10 w-14 rounded object-cover"
                    alt=""
                  />
                </TableCell>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell>${a.price}</TableCell>
                <TableCell>{a.duration}h</TableCell>
                <TableCell>{a.rating}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={a.status === "active"}
                      onCheckedChange={(v) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === a.id
                              ? { ...r, status: v ? "active" : "inactive" }
                              : r,
                          ),
                        )
                      }
                    />
                    <StatusBadge status={a.status} />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRows((p) => p.filter((r) => r.id !== a.id));
                      toast.success("Deleted");
                    }}
                  >
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
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editing?.title ? `Edit: ${editing.title}` : "Add new activity"}
            </SheetTitle>
          </SheetHeader>
          {editing && (
            <ActivityForm
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

function ActivityForm({
  value,
  onCancel,
  onSave,
}: {
  value: Row;
  onCancel: () => void;
  onSave: (v: Row) => void;
}) {
  const [v, setV] = useState<Row>(value);
  const set = <K extends keyof Row>(k: K, val: Row[K]) =>
    setV((p) => ({ ...p, [k]: val }));
  return (
    <div className="mt-4 space-y-4 pb-6">
      <div>
        <Label>Title</Label>
        <Input value={v.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div>
        <Label>Short description</Label>
        <Textarea
          rows={2}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div>
        <Label>Long description</Label>
        <Textarea
          rows={5}
          placeholder="Full experience details shown on the activity page"
          value={v.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
        />
      </div>
      <div>
        <Label>Meeting point</Label>
        <Input
          value={v.meetingPoint}
          placeholder="Where guests meet the guide"
          onChange={(e) => set("meetingPoint", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            value={v.price}
            onChange={(e) => set("price", +e.target.value)}
          />
        </div>
        <div>
          <Label>Duration (hours)</Label>
          <Input
            type="number"
            value={v.duration}
            onChange={(e) => set("duration", +e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={v.category} onValueChange={(x) => set("category", x)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Switch
            checked={v.status === "active"}
            onCheckedChange={(x) => set("status", x ? "active" : "inactive")}
          />
          <Label>Active</Label>
        </div>
      </div>
      <div>
        <Label>Images</Label>
        <div className="mt-1 flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          <Upload className="mb-1 h-5 w-5" />
          Drag & drop or click to upload (mock)
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-teal-deep hover:bg-teal-deep/90"
          onClick={() => onSave(v)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
