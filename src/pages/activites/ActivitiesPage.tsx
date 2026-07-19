import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { getAllCategories } from "@/services/categories";
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "@/services/activities";
import type { Activity } from "@/types/activity";
import ActivityForm, { ActivityFormData } from "./components/ActivityForm";

export default function ActivitiesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [categoryId, setCategoryId] = useState("all");
  const [editing, setEditing] = useState<ActivityFormData | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const categoriesQuery = useQuery({
    queryKey: ["categories", "all", "activity"],
    queryFn: () => getAllCategories("activity"),
  });
  const activitiesQuery = useQuery({
    queryKey: ["activities", debouncedSearch, categoryId, page, perPage],
    queryFn: () =>
      getActivities({
        page: page - 1,
        perPage,
        query: debouncedSearch || undefined,
        categoryId: categoryId === "all" ? undefined : categoryId,
      }),
    placeholderData: (previous) => previous,
  });
  const { total, pageCount, safePage, start } = usePaginated(
    activitiesQuery.data?.total ?? 0,
    page,
    perPage,
  );

  const saveMutation = useMutation({
    mutationFn: (activity: ActivityFormData) => {
      const { id, ...body } = activity;
      return id ? updateActivity({ ...body, id }) : createActivity(body);
    },
    onSuccess: async (_response, activity) => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success(`Saved "${activity.title}"`);
      setOpen(false);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Save failed"),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity deleted");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  const openNew = () => {
    setEditing({
      slug: "",
      title: "",
      description: "",
      longDescription: "",
      meetingPoint: "",
      price: 0,
      duration: 1,
      categoryId: "",
      rating: 0,
      images: [],
      highlights: [],
      included: [],
      removedImageUrls: [],
    });
    setOpen(true);
  };
  const confirmDelete = (activity: Activity) => {
    if (window.confirm(`Delete "${activity.title}"?`))
      deleteMutation.mutate(activity.id);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search activities…"
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesQuery.isLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-slate-500"
                >
                  Loading activities…
                </TableCell>
              </TableRow>
            )}
            {activitiesQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-rose-600"
                >
                  Unable to load activities.
                </TableCell>
              </TableRow>
            )}
            {activitiesQuery.data?.data.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  {activity.images[0] ? (
                    <img
                      src={activity.images[0].url}
                      className="h-10 w-14 rounded object-cover"
                      alt={activity.title}
                    />
                  ) : (
                    <div className="h-10 w-14 rounded bg-slate-100" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell>{activity.category}</TableCell>
                <TableCell>${activity.price.toLocaleString()}</TableCell>
                <TableCell>{activity.duration}h</TableCell>
                <TableCell>{activity.rating}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${activity.title}`}
                    onClick={() => {
                      setEditing(activity);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${activity.title}`}
                    onClick={() => confirmDelete(activity)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!activitiesQuery.isLoading &&
              !activitiesQuery.isError &&
              !activitiesQuery.data?.data.length && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-slate-500"
                  >
                    No activities found.
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
          resetKey={`${search}|${categoryId}`}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {editing?.title ? `Edit: ${editing.title}` : "Add new activity"}
            </SheetTitle>
          </SheetHeader>
          {editing && (
            <ActivityForm
              key={editing.id ?? "new-activity"}
              value={editing}
              categories={categoriesQuery.data?.data ?? []}
              onCancel={() => setOpen(false)}
              onSave={(activity) =>
                saveMutation.mutateAsync(activity).then(() => undefined)
              }
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
