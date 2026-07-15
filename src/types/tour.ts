import type { Review } from "./review";

export interface Tour {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number; // days
  difficulty: string;
  category: string;
  images: string[];
  capacity: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  highlights: string[];
  itinerary: ItineraryDay[];
  reviews: Review[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}
