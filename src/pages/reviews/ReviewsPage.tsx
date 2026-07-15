import { useMemo, useState } from "react";
import { Eye, EyeOff, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { adminReviews } from "@/mocks/admin-mocks";
import { tours } from "@/mocks/mocks";
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import { StatusBadge } from "../../components/layout/AdminLayout";
import { AdminReview } from "@/types/review";

export default function ReviewsPage() {
  const [rows, setRows] = useState<AdminReview[]>(adminReviews);
  const [tour, setTour] = useState("all");
  const [rating, setRating] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (tour === "all" || r.tour === tour) &&
          (rating === "all" || r.rating === +rating) &&
          (status === "all" || r.status === status),
      ),
    [rows, tour, rating, status],
  );
  const { paged, total, pageCount, safePage, start } = usePaginated(
    filtered,
    page,
    pageSize,
  );

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={tour} onValueChange={setTour}>
          <SelectTrigger className="w-full bg-white sm:w-64">
            <SelectValue placeholder="Tour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tours</SelectItem>
            {tours.map((t) => (
              <SelectItem key={t.id} value={t.title}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger className="w-full bg-white sm:w-36">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={r.avatar}
                      className="h-8 w-8 rounded-full object-cover"
                      alt=""
                    />
                    <span className="font-medium">{r.customer}</span>
                  </div>
                </TableCell>
                <TableCell>{r.tour}</TableCell>
                <TableCell>
                  <div className="flex text-amber-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-slate-600">
                  {r.comment}
                </TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-right">
                  {r.status === "hidden" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRows((p) =>
                          p.map((x) =>
                            x.id === r.id ? { ...x, status: "published" } : x,
                          ),
                        );
                        toast.success("Review published");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRows((p) =>
                          p.map((x) =>
                            x.id === r.id ? { ...x, status: "hidden" } : x,
                          ),
                        );
                        toast.success("Review hidden");
                      }}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRows((p) => p.filter((x) => x.id !== r.id));
                      toast.success("Review deleted");
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
          resetKey={`${tour}|${rating}|${status}`}
        />
      </div>
    </>
  );
}
