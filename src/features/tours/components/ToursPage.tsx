import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  SheetDescription,
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
import { categoryOptionsQueryOptions } from "@/features/categories/queries";
import {
  createTour,
  deleteTour,
  updateTour,
} from "../api";
import { tourKeys, tourListQueryOptions } from "../queries";
import type { Tour } from "../types";
import TourForm, { type TourFormData } from "./TourForm";

export default function ToursPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [categoryId, setCategoryId] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [editing, setEditing] = useState<TourFormData | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const categoriesQuery = useQuery(categoryOptionsQueryOptions("tour"));
  const toursQuery = useQuery(
    tourListQueryOptions({
      page: page - 1,
      perPage,
      query: debouncedSearch || undefined,
      categoryId: categoryId === "all" ? undefined : categoryId,
      difficulty: difficulty === "all" ? undefined : difficulty,
    }),
  );
  const { total, pageCount, safePage, start } = usePaginated(
    toursQuery.data?.total ?? 0,
    page,
    perPage,
  );

  const saveMutation = useMutation({
    mutationFn: (tour: TourFormData) => {
      const { id, ...body } = tour;
      return id ? updateTour({ ...body, id }) : createTour(body);
    },
    onSuccess: async (_response, tour) => {
      await queryClient.invalidateQueries({ queryKey: tourKeys.all });
      toast.success(`Saved "${tour.title}"`);
      setOpen(false);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Save failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTour,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tourKeys.all });
      toast.success("Tour deleted");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  const openNew = () => {
    setEditing({
      slug: "",
      title: "",
      description: "",
      price: 0,
      duration: 1,
      difficulty: "Easy",
      categoryId: "",
      capacity: 1,
      rating: 0,
      reviewCount: 0,
      popularity: 0,
      images: [],
      highlights: [],
      itinerary: [],
      removedImageUrls: [],
    });
    setOpen(true);
  };

  const confirmDelete = (tour: Tour) => {
    if (window.confirm(`Delete "${tour.title}"?`))
      deleteMutation.mutate(tour.id);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tours…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-white pl-9"
          />
        </div>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full bg-white sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoriesQuery.data?.data.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full bg-white sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Challenging">Challenging</SelectItem>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toursQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-slate-500"
                >
                  Loading tours…
                </TableCell>
              </TableRow>
            )}
            {toursQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load tours.
                </TableCell>
              </TableRow>
            )}
            {toursQuery.data?.data.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  {tour.images[0] ? (
                    <img
                      src={tour.images[0].url}
                      className="h-10 w-14 rounded object-cover"
                      alt={tour.title}
                    />
                  ) : (
                    <div className="h-10 w-14 rounded bg-slate-100" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{tour.title}</TableCell>
                <TableCell>{tour.category}</TableCell>
                <TableCell>${tour.price.toLocaleString()}</TableCell>
                <TableCell>{tour.duration}d</TableCell>
                <TableCell>{tour.difficulty}</TableCell>
                <TableCell>{tour.capacity}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${tour.title}`}
                    onClick={() => {
                      setEditing(tour);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${tour.title}`}
                    onClick={() => confirmDelete(tour)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!toursQuery.isLoading &&
              !toursQuery.isError &&
              !toursQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-slate-500"
                  >
                    No tours found.
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
          resetKey={`${search}|${categoryId}|${difficulty}`}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
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
              key={editing.id ?? "new-tour"}
              value={editing}
              categories={categoriesQuery.data?.data ?? []}
              onCancel={() => setOpen(false)}
              onSave={(tour) =>
                saveMutation.mutateAsync(tour).then(() => undefined)
              }
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
