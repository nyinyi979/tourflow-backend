import {
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  ReviewStatus,
  SortOrder,
} from "@/lib/api/types";

export interface PublicReview {
  id: string;
  customerName: string;
  avatar: string | null;
  reviewedAt: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar: string | null;
  tour?: { id: string; title: string };
  tourId: string;
  rating: number;
  comment: string;
  reviewedAt: string;
  status: ReviewStatus;
}

export interface ReviewQuery extends PaginationQuery {
  query?: string;
  tourId?: string;
  status?: ReviewStatus;
  sortBy?: "rating" | "reviewedAt" | "status" | "createdAt";
  orderBy?: SortOrder;
}

export interface UpdateReviewRequest {
  id: string;
  rating?: number;
  comment?: string;
  status?: ReviewStatus;
}

export type ReviewListResponse = PaginatedResponse<Review, ReviewQuery>;
export type ReviewResponse = DataResponse<Review>;
