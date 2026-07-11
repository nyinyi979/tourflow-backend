import ReactDOM from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import {
  CalendarCheck,
  Compass,
  LayoutDashboard,
  Map,
  Settings,
  Star,
  Users,
} from "lucide-react";
import "./index.css";
import LayoutComponent from "./components/AdminLayout";
import DashboardPage from "./components/dashboard/DashboardPage";
import ActivitiesPage from "./components/acitivites/ActivitiesPage";
import CustomersPage from "./components/customers/CustomersPage";
import SettingPage from "./components/setting/SettingPage";
import ToursPage from "./components/tours/ToursPage";
import BookingsPage from "./components/bookings/BookingsPage";
import ReviewsPage from "./components/reviews/ReviewsPage";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tours", label: "Tours", icon: Map },
  { to: "/activities", label: "Activities", icon: Compass },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings, exact: true },
] as const;

export function RootComponent() {
  return (
    <div>
      <h1>Home</h1>
      <Outlet />
    </div>
  );
}
export const rootRoute = createRootRoute({
  component: () => <Outlet />,

  notFoundComponent: () => (
    <div>
      <p>This is the notFoundComponent configured on root route</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  ),
});
export const indexRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard",
    });
  },
});

export default function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title =
    navItems.find((item) => item.to === pathname)?.label || "Dashboard";
  return (
    <>
      <LayoutComponent title={title}>
        <Outlet />
      </LayoutComponent>
    </>
  );
}

export const layoutRoute = createRoute({
  id: "admin",
  getParentRoute: () => rootRoute,
  component: Layout,
});
export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => layoutRoute,
  component: DashboardPage,
});
export const activitiesRoute = createRoute({
  path: "/activities",
  getParentRoute: () => layoutRoute,
  component: ActivitiesPage,
});
export const customersRoute = createRoute({
  path: "/customers",
  getParentRoute: () => layoutRoute,
  component: CustomersPage,
});
export const settingRoute = createRoute({
  path: "/settings",
  getParentRoute: () => layoutRoute,
  component: SettingPage,
});
export const toursRoute = createRoute({
  path: "/tours",
  getParentRoute: () => layoutRoute,
  component: ToursPage,
});
export const bookingsRoute = createRoute({
  path: "/bookings",
  getParentRoute: () => layoutRoute,
  component: BookingsPage,
});
export const reviewsRoute = createRoute({
  path: "/reviews",
  getParentRoute: () => layoutRoute,
  component: ReviewsPage,
});
const routeTree = rootRoute.addChildren([
  indexRoute,

  layoutRoute.addChildren([
    dashboardRoute,
    activitiesRoute,
    toursRoute,
    customersRoute,
    bookingsRoute,
    settingRoute,
    reviewsRoute,
  ]),
]);

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  scrollRestoration: true,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
