import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination, usePaginated } from "@/components/ui/Pagination";
import CategoryForm, { CategoryFormData } from "./components/CategoryForm";
import {
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "@/services/categories";
import useDebouncedValue from "@/hooks/useDebouncedValue";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [editing, setEditing] = useState<CategoryFormData | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const categoriesQuery = useQuery({
    queryKey: ["categories", debouncedSearch, page, perPage],
    queryFn: () =>
      getCategories({
        // The table UI is one-based, while the API uses a zero-based offset.
        page: page - 1,
        perPage,
        query: debouncedSearch || undefined,
      }),
    placeholderData: (previous) => previous,
  });

  const { total, pageCount, safePage, start } = usePaginated(
    categoriesQuery.data?.total || 0,
    page,
    perPage,
  );
  function openNew() {
    setEditing({
      label: "",
      image: null,
      slug: "",
      removedImageUrls: [],
      type: "tour",
    });
    setOpen(true);
  }

  const saveCategoryMutation = useMutation({
    mutationFn: async (category: CategoryFormData) => {
      const { id, ...categoryData } = category;

      return id
        ? updateCategory({ ...categoryData, id })
        : createCategory(categoryData);
    },
    onSuccess: async (_response, category) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Saved "${category.label}"`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Save failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    },
  });

  const save = (category: CategoryFormData) =>
    saveCategoryMutation.mutateAsync(category).then(() => undefined);

  const confirmDelete = (category: CategoryFormData & { id: string }) => {
    if (!window.confirm(`Delete "${category.label}"?`)) return;
    deleteMutation.mutate(category.id);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Button
          onClick={openNew}
          disabled={saveCategoryMutation.isPending}
          className="bg-teal-deep hover:bg-teal-deep/90"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Label</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriesQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >
                  Loading categories…
                </TableCell>
              </TableRow>
            )}
            {categoriesQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load categories.
                </TableCell>
              </TableRow>
            )}
            {categoriesQuery.data?.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <img
                    src={category.image ?? "https://via.placeholder.com/150"}
                    className="h-10 w-14 rounded object-cover"
                    alt={category.label}
                  />
                </TableCell>
                <TableCell className="font-medium">{category.label}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="capitalize">{category.type}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${category.label}`}
                    disabled={
                      saveCategoryMutation.isPending || deleteMutation.isPending
                    }
                    onClick={() => {
                      setEditing({ ...category, removedImageUrls: [] });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${category.label}`}
                    disabled={
                      saveCategoryMutation.isPending || deleteMutation.isPending
                    }
                    onClick={() => confirmDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!categoriesQuery.isLoading &&
              !categoriesQuery.isError &&
              !categoriesQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    No categories found.
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
          resetKey={`${search}`}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {editing?.label ? `Edit: ${editing.label}` : "Add new category"}
            </SheetTitle>
            <SheetDescription>
              Fill in the details and click save.
            </SheetDescription>
          </SheetHeader>
          {editing && (
            <CategoryForm
              key={"id" in editing ? editing.id : "new-category"}
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
