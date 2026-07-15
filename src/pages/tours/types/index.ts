import { Tour } from "@/types/tour";

export interface TourRow extends Tour {
  status: "active" | "inactive";
}
