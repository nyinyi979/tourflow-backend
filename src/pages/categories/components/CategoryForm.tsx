import { useState } from "react";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { CreateCategoryRequest } from "@/types/category";
import { Controller, useForm } from "react-hook-form";
import { CategoryFormValues, categorySchema } from "../form/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_FILE_SIZE, uploadTemporaryFile } from "@/services/file";
import ImagePicker, { ImagePickerValue } from "@/components/ImagePicker";

export type CategoryFormData = CreateCategoryRequest & { id?: string };

export default function CategoryForm({
  value,
  onSave,
  onCancel,
}: {
  value: CategoryFormData;
  onSave: (value: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      label: value.label,
      slug: value.slug,
      type: value.type,
    },
  });
  const [file, setFile] = useState<File | string | null>(value.image ?? null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const submit = form.handleSubmit(async (formValues) => {
    setUploadError(null);
    let image = file;

    if (file instanceof File) {
      try {
        // The API moves this temporary path to S3 when it saves the category.
        image = (await uploadTemporaryFile(file)).data.url;
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Image upload failed",
        );
        return;
      }
    }

    await onSave({ ...value, ...formValues, image: image as string });
  });

  return (
    <form className="mt-4 space-y-4 pb-6" onSubmit={submit} noValidate>
      <div>
        <Label>Label</Label>
        <Input
          {...form.register("label")}
          aria-invalid={!!form.formState.errors.label}
        />
        {form.formState.errors.label && (
          <p className="mt-1 text-xs text-rose-600">
            {form.formState.errors.label.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <Input
            {...form.register("slug")}
            aria-invalid={!!form.formState.errors.slug}
          />
          {form.formState.errors.slug && (
            <p className="mt-1 text-xs text-rose-600">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
        <div>
          <Label>Type</Label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Tour", "Activity"].map((n) => (
                    <SelectItem key={n.toLowerCase()} value={n.toLowerCase()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.type && (
            <p className="mt-1 text-xs text-rose-600">
              {form.formState.errors.type.message}
            </p>
          )}
        </div>
      </div>
      <ImagePicker
        label="Image"
        helperText="Maximum file size: 5 MB"
        value={file}
        maxSize={MAX_FILE_SIZE}
        disabled={form.formState.isSubmitting}
        onChange={(image: ImagePickerValue | null) => {
          setFile(image);
          setUploadError(null);
        }}
        onErrorChange={setFileError}
      />
      {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !!fileError}
          className="bg-teal-deep hover:bg-teal-deep/90"
        >
          {form.formState.isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
