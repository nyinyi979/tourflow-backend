import {
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  ReviewStatus,
  SortOrder,
} from "./types";

export interface PublicReview {
  id: string;
  name: string;
  avatar: string | null;
  date: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  customer: string;
  name: string;
  avatar: string | null;
  tour?: string;
  tourId: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

export interface ReviewQuery extends PaginationQuery {
  query?: string;
  tourId?: string;
  status?: ReviewStatus;
  sortBy?: string;
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
