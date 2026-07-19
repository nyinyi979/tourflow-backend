import { DataResponse } from "@/types/types";
import {
  Review,
  ReviewListResponse,
  ReviewQuery,
  UpdateReviewRequest,
} from "@/types/review";
import { apiFetchWrapper } from ".";

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
