import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";
import { AdminRouteLayout } from "./AdminRouteLayout";

const ActivitiesPage = lazyRouteComponent(
  () => import("@/features/activities/components/ActivitiesPage"),
);
const LoginPage = lazyRouteComponent(
  () => import("@/features/auth/components/LoginPage"),
);
const BookingsPage = lazyRouteComponent(
  () => import("@/features/bookings/components/BookingsPage"),
);
const CategoriesPage = lazyRouteComponent(
  () => import("@/features/categories/components/CategoriesPage"),
);
const CustomersPage = lazyRouteComponent(
  () => import("@/features/customers/components/CustomersPage"),
);
const DashboardPage = lazyRouteComponent(
  () => import("@/features/dashboard/components/DashboardPage"),
);
const ReviewsPage = lazyRouteComponent(
  () => import("@/features/reviews/components/ReviewsPage"),
);
const ToursPage = lazyRouteComponent(
  () => import("@/features/tours/components/ToursPage"),
);

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <h1 className="text-3xl text-slate-900">Page not found</h1>
        <Link className="mt-4 inline-block text-sm text-teal-deep" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </main>
  ),
});

const indexRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const loginRoute = createRoute({
  path: "/login",
  getParentRoute: () => rootRoute,
  component: LoginPage,
});

const adminRoute = createRoute({
  id: "admin",
  getParentRoute: () => rootRoute,
  component: AdminRouteLayout,
});

const adminRoutes = [
  createRoute({
    path: "/dashboard",
    getParentRoute: () => adminRoute,
    component: DashboardPage,
  }),
  createRoute({
    path: "/categories",
    getParentRoute: () => adminRoute,
    component: CategoriesPage,
  }),
  createRoute({
    path: "/activities",
    getParentRoute: () => adminRoute,
    component: ActivitiesPage,
  }),
  createRoute({
    path: "/tours",
    getParentRoute: () => adminRoute,
    component: ToursPage,
  }),
  createRoute({
    path: "/customers",
    getParentRoute: () => adminRoute,
    component: CustomersPage,
  }),
  createRoute({
    path: "/bookings",
    getParentRoute: () => adminRoute,
    component: BookingsPage,
  }),
  createRoute({
    path: "/reviews",
    getParentRoute: () => adminRoute,
    component: ReviewsPage,
  }),
];

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute.addChildren(adminRoutes),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 5_000,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
