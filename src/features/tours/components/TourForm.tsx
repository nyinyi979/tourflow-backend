import { FormEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import ImagePicker, { type ImagePickerValue } from "@/components/ImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/features/categories/types";
import { MAX_FILE_SIZE, uploadTemporaryFile } from "@/features/files/api";
import type { CreateTourRequest } from "../types";

export type TourFormData = CreateTourRequest & { id?: string };

export default function TourForm({
  value,
  categories,
  onSave,
  onCancel,
}: {
  value: TourFormData;
  categories: Category[];
  onSave: (value: TourFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [tour, setTour] = useState(value);
  const originalImages = value.images ?? [];
  const [images, setImages] = useState<ImagePickerValue[]>(
    originalImages.map((image) => image.url),
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof TourFormData>(key: K, next: TourFormData[K]) =>
    setTour((current) => ({ ...current, [key]: next }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (!tour.slug.trim() || !tour.title.trim() || !tour.description.trim()) {
      setSubmitError("Slug, title, and description are required");
      return;
    }
    if (
      !tour.categoryId ||
      tour.price <= 0 ||
      tour.duration < 1 ||
      tour.capacity < 1
    ) {
      setSubmitError("Category, price, duration, and capacity are required");
      return;
    }
    if ((tour.highlights ?? []).some((highlight) => !highlight.label.trim())) {
      setSubmitError("Highlights cannot be empty");
      return;
    }
    if (
      (tour.itinerary ?? []).some(
        (day) => day.day < 1 || !day.title.trim() || !day.description.trim(),
      )
    ) {
      setSubmitError("Every itinerary day needs a day, title, and description");
      return;
    }

    setSubmitting(true);
    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (image instanceof File) {
            return { url: (await uploadTemporaryFile(image)).data.url };
          }
          return (
            originalImages.find((existing) => existing.url === image) ?? {
              url: image,
            }
          );
        }),
      );
      const retainedUrls = new Set(uploadedImages.map((image) => image.url));
      await onSave({
        ...tour,
        slug: tour.slug.trim(),
        title: tour.title.trim(),
        description: tour.description.trim(),
        images: uploadedImages,
        highlights: (tour.highlights ?? []).map((highlight) => ({
          ...highlight,
          label: highlight.label.trim(),
        })),
        itinerary: (tour.itinerary ?? []).map((day) => ({
          ...day,
          title: day.title.trim(),
          description: day.description.trim(),
        })),
        removedImageUrls: originalImages
          .filter((image) => !retainedUrls.has(image.url))
          .map((image) => image.url),
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to save tour",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-4 space-y-4 pb-6" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Title</Label>
          <Input
            value={tour.title}
            onChange={(event) => set("title", event.target.value)}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={tour.slug}
            onChange={(event) => set("slug", event.target.value)}
          />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={tour.description}
          onChange={(event) => set("description", event.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            min={0}
            value={tour.price}
            onChange={(event) => set("price", +event.target.value)}
          />
        </div>
        <div>
          <Label>Duration (days)</Label>
          <Input
            type="number"
            min={1}
            value={tour.duration}
            onChange={(event) => set("duration", +event.target.value)}
          />
        </div>
        <div>
          <Label>Difficulty</Label>
          <Select
            value={tour.difficulty}
            onValueChange={(next) => set("difficulty", next)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Challenging">Challenging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={tour.categoryId}
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
        <div>
          <Label>Capacity</Label>
          <Input
            type="number"
            min={1}
            value={tour.capacity}
            onChange={(event) => set("capacity", +event.target.value)}
          />
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

      <div>
        <div className="flex items-center justify-between">
          <Label>Itinerary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("itinerary", [
                ...(tour.itinerary ?? []),
                {
                  day: (tour.itinerary?.length ?? 0) + 1,
                  title: "",
                  description: "",
                },
              ])
            }
          >
            <Plus className="h-3 w-3" /> Add day
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {(tour.itinerary ?? []).map((day, index) => (
            <div
              key={day.id ?? index}
              className="grid grid-cols-[4rem_1fr_auto] gap-2"
            >
              <Input
                type="number"
                min={1}
                value={day.day}
                onChange={(event) =>
                  set(
                    "itinerary",
                    (tour.itinerary ?? []).map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, day: +event.target.value }
                        : item,
                    ),
                  )
                }
              />
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={day.title}
                  onChange={(event) =>
                    set(
                      "itinerary",
                      (tour.itinerary ?? []).map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
                <Textarea
                  rows={2}
                  placeholder="Description"
                  value={day.description}
                  onChange={(event) =>
                    set(
                      "itinerary",
                      (tour.itinerary ?? []).map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, description: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove itinerary day"
                onClick={() =>
                  set(
                    "itinerary",
                    (tour.itinerary ?? []).filter(
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

      <div>
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("highlights", [...(tour.highlights ?? []), { label: "" }])
            }
          >
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {(tour.highlights ?? []).map((highlight, index) => (
            <div key={highlight.id ?? index} className="flex gap-2">
              <Input
                value={highlight.label}
                onChange={(event) =>
                  set(
                    "highlights",
                    (tour.highlights ?? []).map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, label: event.target.value }
                        : item,
                    ),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remove highlight"
                onClick={() =>
                  set(
                    "highlights",
                    (tour.highlights ?? []).filter(
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

      {submitError && <p className="text-xs text-rose-600">{submitError}</p>}
      <div className="flex justify-end gap-2 pt-2">
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
