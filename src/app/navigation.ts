import {
  Activity,
  CalendarCheck,
  Compass,
  LayoutDashboard,
  Map,
  Star,
  Users,
} from "lucide-react";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/categories", label: "Categories", icon: Activity },
  { to: "/tours", label: "Tours", icon: Map },
  { to: "/activities", label: "Activities", icon: Compass },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reviews", label: "Reviews", icon: Star },
] as const;
