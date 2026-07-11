import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export function usePaginated<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { paged, total, pageCount, safePage, start };
}

interface Props {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  start: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  resetKey?: unknown;
}

export function Pagination({
  page,
  pageSize,
  total,
  pageCount,
  start,
  onPageChange,
  onPageSizeChange,
  resetKey,
}: Props) {
  useEffect(() => {
    onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const end = Math.min(start + pageSize, total);
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row">
      <div className="flex items-center gap-3 text-slate-600">
        <span>
          {total === 0 ? "0" : `${start + 1}–${end}`} of {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Rows</span>
          <Select value={String(pageSize)} onValueChange={(v) => { onPageSizeChange(+v); onPageChange(1); }}>
            <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={`e-${i}`} className="px-2 text-slate-400">…</span>
          ) : (
            <Button
              key={n}
              size="sm"
              variant={n === page ? "default" : "outline"}
              className={n === page ? "bg-teal-deep hover:bg-teal-deep/90" : ""}
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
