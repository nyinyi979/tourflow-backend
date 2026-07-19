import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import ImagePicker, { ImagePickerValue } from "@/components/ImagePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { CreateActivityRequest } from "@/types/activity";
import type { Category } from "@/types/category";
import { MAX_FILE_SIZE, uploadTemporaryFile } from "@/services/file";

export type ActivityFormData = CreateActivityRequest & { id?: string };

export default function ActivityForm({
  value,
  categories,
  onCancel,
  onSave,
}: {
  value: ActivityFormData;
  categories: Category[];
  onCancel: () => void;
  onSave: (value: ActivityFormData) => Promise<void>;
}) {
  const [activity, setActivity] = useState(value);
  const originalImages = value.images ?? [];
  const [images, setImages] = useState<ImagePickerValue[]>(
    originalImages.map((image) => image.url),
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const set = <K extends keyof ActivityFormData>(
    key: K,
    next: ActivityFormData[K],
  ) => setActivity((current) => ({ ...current, [key]: next }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (
      !activity.slug.trim() ||
      !activity.title.trim() ||
      !activity.description.trim()
    )
      return setSubmitError("Slug, title, and description are required");
    if (!activity.categoryId || activity.price <= 0 || activity.duration < 1)
      return setSubmitError("Category, price, and duration are required");
    if (
      [...(activity.highlights ?? []), ...(activity.included ?? [])].some(
        (item) => !item.label.trim(),
      )
    )
      return setSubmitError("Highlights and included items cannot be empty");
    setSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) =>
          image instanceof File
            ? { url: (await uploadTemporaryFile(image)).data.url }
            : (originalImages.find((existing) => existing.url === image) ?? {
                url: image,
              }),
        ),
      );
      const retainedUrls = new Set(uploadedImages.map((image) => image.url));
      await onSave({
        ...activity,
        slug: activity.slug.trim(),
        title: activity.title.trim(),
        description: activity.description.trim(),
        images: uploadedImages,
        highlights: (activity.highlights ?? []).map((item) => ({
          ...item,
          label: item.label.trim(),
        })),
        included: (activity.included ?? []).map((item) => ({
          ...item,
          label: item.label.trim(),
        })),
        removedImageUrls: originalImages
          .filter((image) => !retainedUrls.has(image.url))
          .map((image) => image.url),
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save activity",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const labelSection = (key: "highlights" | "included", label: string) => (
    <div>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => set(key, [...(activity[key] ?? []), { label: "" }])}
        >
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        {(activity[key] ?? []).map((item, index) => (
          <div key={item.id ?? index} className="flex gap-2">
            <Input
              value={item.label}
              onChange={(event) =>
                set(
                  key,
                  (activity[key] ?? []).map((current, itemIndex) =>
                    itemIndex === index
                      ? { ...current, label: event.target.value }
                      : current,
                  ),
                )
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Remove ${label.toLowerCase()} item`}
              onClick={() =>
                set(
                  key,
                  (activity[key] ?? []).filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                )
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form className="mt-4 space-y-4 pb-6" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Title</Label>
          <Input
            value={activity.title}
            onChange={(event) => set("title", event.target.value)}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={activity.slug}
            onChange={(event) => set("slug", event.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Short description</Label>
        <Textarea
          rows={2}
          value={activity.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </div>
      <div>
        <Label>Long description</Label>
        <Textarea
          rows={5}
          value={activity.longDescription ?? ""}
          onChange={(event) =>
            set("longDescription", event.target.value || null)
          }
        />
      </div>
      <div>
        <Label>Meeting point</Label>
        <Input
          value={activity.meetingPoint ?? ""}
          onChange={(event) => set("meetingPoint", event.target.value || null)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            min={0}
            value={activity.price}
            onChange={(event) => set("price", +event.target.value)}
          />
        </div>
        <div>
          <Label>Duration (hours)</Label>
          <Input
            type="number"
            min={1}
            value={activity.duration}
            onChange={(event) => set("duration", +event.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={activity.categoryId}
            onValueChange={(next) => set("categoryId", next)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ImagePicker
        multiple
        label="Images"
        helperText="Each image can be up to 5 MB"
        value={images}
        maxSize={MAX_FILE_SIZE}
        disabled={submitting}
        onChange={(next) => {
          setImages(next);
          setSubmitError(null);
        }}
        onErrorChange={setImageError}
      />
      {labelSection("highlights", "Highlights")}
      {labelSection("included", "Included items")}
      {submitError && <p className="text-xs text-rose-600">{submitError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !!imageError}
          className="bg-teal-deep hover:bg-teal-deep/90"
        >
          {submitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
