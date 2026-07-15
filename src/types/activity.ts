export interface Activity {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: number;
  duration: number; // hours
  category: string;
  images: string[];
  rating: number;
  highlights?: string[];
  included?: string[];
  meetingPoint?: string;
}
