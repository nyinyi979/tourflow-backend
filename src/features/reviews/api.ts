import type { DataResponse } from "@/lib/api/types";
import {
  Review,
  ReviewListResponse,
  ReviewQuery,
  UpdateReviewRequest,
} from "./types";
import { apiFetchWrapper } from "@/lib/api/client";

export const getAdminReviews = (queryParams: ReviewQuery) =>
  apiFetchWrapper<ReviewListResponse>({
    endpoint: "review/admin",
    queryParams,
  });

export const updateReview = (body: UpdateReviewRequest) =>
  apiFetchWrapper<DataResponse<Review>>({
    endpoint: "review",
    method: "PUT",
    body,
  });

export const deleteReview = (id: string) =>
  apiFetchWrapper<DataResponse<Review>>({
    endpoint: `review/${id}`,
    method: "DELETE",
  });
