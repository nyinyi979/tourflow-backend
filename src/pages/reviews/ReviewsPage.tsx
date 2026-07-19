import { useState } from "react";
import { Eye, EyeOff, Search, Star, Trash2 } from "lucide-react";
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
  deleteReview,
  getAdminReviews,
  updateReview,
} from "@/services/reviews";
import { getTours } from "@/services/tours";
import type { Review } from "@/types/review";
import { ReviewStatus } from "@/types/types";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [tourId, setTourId] = useState("all");
  const [status, setStatus] = useState<ReviewStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const toursQuery = useQuery({
    queryKey: ["tours", "review-filter"],
    queryFn: () =>
      getTours({ page: 0, perPage: 100, sortBy: "title", orderBy: "asc" }),
  });
  const reviewsQuery = useQuery({
    queryKey: ["reviews", debouncedSearch, tourId, status, page, perPage],
    queryFn: () =>
      getAdminReviews({
        page: page - 1,
        perPage,
        query: debouncedSearch || undefined,
        tourId: tourId === "all" ? undefined : tourId,
        status: status === "all" ? undefined : status,
      }),
    placeholderData: (previous) => previous,
  });
  const { total, pageCount, safePage, start } = usePaginated(
    reviewsQuery.data?.total ?? 0,
    page,
    perPage,
  );

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status: nextStatus,
    }: {
      id: string;
      status: ReviewStatus;
    }) => updateReview({ id, status: nextStatus }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success(`Review ${response.data.status}`);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Update failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success("Review deleted");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });
  const confirmDelete = (review: Review) => {
    if (window.confirm(`Delete ${review.customer}'s review?`))
      deleteMutation.mutate(review.id);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="bg-white pl-9"
            placeholder="Search review comments…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={tourId} onValueChange={setTourId}>
          <SelectTrigger className="w-full bg-white sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tours</SelectItem>
            {toursQuery.data?.data.map((tour) => (
              <SelectItem key={tour.id} value={tour.id}>
                {tour.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(next) => setStatus(next as ReviewStatus | "all")}
        >
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue />
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
            {reviewsQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-slate-500"
                >
                  Loading reviews…
                </TableCell>
              </TableRow>
            )}
            {reviewsQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load reviews.
                </TableCell>
              </TableRow>
            )}
            {reviewsQuery.data?.data.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        className="h-8 w-8 rounded-full object-cover"
                        alt={review.customer}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-100" />
                    )}
                    <span className="font-medium">{review.customer}</span>
                  </div>
                </TableCell>
                <TableCell>{review.tour ?? "Deleted tour"}</TableCell>
                <TableCell>
                  <div className="flex text-amber-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-slate-600">
                  {review.comment}
                </TableCell>
                <TableCell>
                  {new Date(review.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={updateMutation.isPending}
                    aria-label={
                      review.status === "hidden"
                        ? "Publish review"
                        : "Hide review"
                    }
                    onClick={() =>
                      updateMutation.mutate({
                        id: review.id,
                        status:
                          review.status === "hidden" ? "published" : "hidden",
                      })
                    }
                  >
                    {review.status === "hidden" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Delete review"
                    onClick={() => confirmDelete(review)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!reviewsQuery.isLoading &&
              !reviewsQuery.isError &&
              !reviewsQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-slate-500"
                  >
                    No reviews found.
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
          resetKey={`${search}|${tourId}|${status}`}
        />
      </div>
    </>
  );
}
