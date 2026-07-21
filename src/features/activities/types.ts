import {
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "@/lib/api/types";

export interface ActivityImageInput {
  id?: string;
  url: string;
}

export interface ActivityLabelInput {
  id?: string;
  label: string;
}

export interface CreateActivityRequest {
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  price: number;
  duration: number;
  categoryId: string;
  rating?: number;
  meetingPoint?: string | null;
  images?: ActivityImageInput[];
  highlights?: ActivityLabelInput[];
  included?: ActivityLabelInput[];
  removedImageUrls?: Array<string | null>;
}

export interface Activity extends CreateActivityRequest {
  id: string;
  category: string;
  rating: number;
  images: Array<ActivityImageInput & { id: string }>;
  highlights: Array<ActivityLabelInput & { id: string }>;
  included: Array<ActivityLabelInput & { id: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityQuery extends PaginationQuery {
  query?: string;
  categoryId?: string;
  sortBy?: "title" | "price" | "duration" | "rating" | "createdAt";
  orderBy?: SortOrder;
}

export type UpdateActivityRequest = Partial<CreateActivityRequest> & {
  id: string;
};

export type ActivityListResponse = PaginatedResponse<Activity, ActivityQuery>;
export type ActivityResponse = DataResponse<Activity>;
