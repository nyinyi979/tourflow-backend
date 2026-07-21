import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import AdminLayout from "@/components/layout/AdminLayout";
import { adminMeQueryOptions } from "@/features/auth/queries";
import {
  clearAdminSession,
  getAdminToken,
} from "@/lib/auth";
import { navItems } from "./navigation";

export function AdminRouteLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const token = getAdminToken();
  const sessionQuery = useQuery(adminMeQueryOptions(Boolean(token)));
  const title =
    navItems.find((item) => item.to === pathname)?.label ?? "Dashboard";

  if (!token) return <Navigate to="/login" replace />;

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

  if (sessionQuery.isPending || !sessionQuery.data) {
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
    <AdminLayout
      title={title}
      user={sessionQuery.data.data}
      onLogout={logout}
    >
      <Outlet />
    </AdminLayout>
  );
}
