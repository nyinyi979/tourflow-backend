import type { ApiSuccessResponse } from "@/lib/api/types";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeTours: number;
  newCustomers: number;
  trends: {
    revenue: number;
    bookings: number;
    tours: number;
    customers: number;
  };
}

export interface TopTour {
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
}

export type DashboardResponse = ApiSuccessResponse & {
  monthlyRevenue: MonthlyRevenue[];
  dashboardStats: DashboardStats;
  topTours: TopTour[];
};
