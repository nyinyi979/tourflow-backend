import ReactDOM from "react-dom/client";
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Compass,
  LayoutDashboard,
  Map,
  Star,
  Users,
  Activity,
} from "lucide-react";
import "./index.css";
import LayoutComponent from "./components/layout/AdminLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ActivitiesPage from "./pages/activites/ActivitiesPage";
import CustomersPage from "./pages/customers/CustomersPage";
import ToursPage from "./pages/tours/ToursPage";
import BookingsPage from "./pages/bookings/BookingsPage";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import QueryClientProviderComponent, {
  queryClientInstance,
} from "./hooks/useQueryClientProvider";
import CategoriesPage from "./pages/categories/CategoriesPage";
import LoginPage from "./pages/auth/LoginPage";
import { getAdminMe } from "./services/auth";
import {
  ADMIN_UNAUTHORIZED_EVENT,
  clearAdminSession,
  getAdminToken,
} from "./lib/auth";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/categories", label: "Categories", icon: Activity },
  { to: "/tours", label: "Tours", icon: Map },
  { to: "/activities", label: "Activities", icon: Compass },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reviews", label: "Reviews", icon: Star },
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const token = getAdminToken();
  const sessionQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getAdminMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const title =
    navItems.find((item) => item.to === pathname)?.label || "Dashboard";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (sessionQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-sm text-rose-600">
          Unable to verify the admin session.
        </p>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm"
            onClick={() => void sessionQuery.refetch()}
          >
            Retry
          </button>
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
            onClick={() => {
              clearAdminSession();
              queryClient.clear();
              void navigate({ to: "/login", replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (sessionQuery.isLoading || !sessionQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Verifying admin session…
      </div>
    );
  }

  const logout = () => {
    clearAdminSession();
    queryClient.clear();
    void navigate({ to: "/login", replace: true });
  };

  return (
    <LayoutComponent
      title={title}
      user={sessionQuery.data.data}
      onLogout={logout}
    >
      <Outlet />
    </LayoutComponent>
  );
}

export const layoutRoute = createRoute({
  id: "admin",
  getParentRoute: () => rootRoute,
  component: Layout,
});
export const loginRoute = createRoute({
  path: "/login",
  getParentRoute: () => rootRoute,
  component: LoginPage,
});
export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => layoutRoute,
  component: DashboardPage,
});
export const categoriesRoute = createRoute({
  path: "/categories",
  getParentRoute: () => layoutRoute,
  component: CategoriesPage,
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
  loginRoute,

  layoutRoute.addChildren([
    dashboardRoute,
    categoriesRoute,
    activitiesRoute,
    toursRoute,
    customersRoute,
    bookingsRoute,
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

window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, () => {
  queryClientInstance.clear();
  void router.navigate({ to: "/login", replace: true });
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

  root.render(
    <QueryClientProviderComponent>
      <RouterProvider router={router} />
    </QueryClientProviderComponent>,
  );
}
