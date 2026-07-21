import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function usePaginated(total: number, page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  return { total, pageCount, safePage, start };
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  start: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
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
}: PaginationProps) {
  useEffect(() => {
    onPageChange(1);
  }, [onPageChange, resetKey]);

  const end = Math.min(start + pageSize, total);
  const pageNumbers: Array<number | "…"> = [];
  for (let current = 1; current <= pageCount; current += 1) {
    if (
      current === 1 ||
      current === pageCount ||
      Math.abs(current - page) <= 1
    ) {
      pageNumbers.push(current);
    } else if (pageNumbers.at(-1) !== "…") {
      pageNumbers.push("…");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row">
      <div className="flex items-center gap-3 text-slate-600">
        <span>
          {total === 0 ? "0" : `${start + 1}–${end}`} of {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "…" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <Button
              key={pageNumber}
              size="sm"
              variant={pageNumber === page ? "default" : "outline"}
              className={
                pageNumber === page
                  ? "bg-teal-deep hover:bg-teal-deep/90"
                  : ""
              }
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
