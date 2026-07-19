import { z } from "zod";

export const categorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or fewer"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or fewer"),
  type: z.enum(["tour", "activity"], {
    message: "Type is required",
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
