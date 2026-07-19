import { PublicReview } from "./review";
import {
  DataResponse,
  PaginatedResponse,
  PaginationQuery,
  SortOrder,
} from "./types";

export interface TourImageInput {
  id?: string;
  url: string;
}

export interface TourHighlightInput {
  id?: string;
  label: string;
}

export interface ItineraryDayInput {
  id?: string;
  day: number;
  title: string;
  description: string;
}

export interface CreateTourRequest {
  slug: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  difficulty: string;
  categoryId: string;
  capacity: number;
  rating?: number;
  reviewCount?: number;
  popularity?: number;
  images?: TourImageInput[];
  highlights?: TourHighlightInput[];
  itinerary?: ItineraryDayInput[];
  removedImageUrls?: Array<string | null>;
}

export interface Tour extends CreateTourRequest {
  id: string;
  category: string;
  rating: number;
  reviewCount: number;
  popularity: number;
  images: Array<TourImageInput & { id: string }>;
  highlights: TourHighlightInput[];
  itinerary: ItineraryDayInput[];
  reviews: PublicReview[];
  createdAt: string;
  updatedAt: string;
}

export interface TourQuery extends PaginationQuery {
  query?: string;
  categoryId?: string;
  difficulty?: string;
  sortBy?: string;
  orderBy?: SortOrder;
}

export type UpdateTourRequest = Partial<CreateTourRequest> & { id: string };
export type TourListResponse = PaginatedResponse<Tour, TourQuery>;
export type TourResponse = DataResponse<Tour>;
