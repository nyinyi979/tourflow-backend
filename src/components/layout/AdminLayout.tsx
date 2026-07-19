import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/Sooner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";
import { navItems } from "@/main";
import type { AdminUser } from "@/types/auth";

export default function LayoutComponent({
  title,
  children,
  user,
  onLogout,
}: {
  title: string;
  children: ReactNode;
  user: AdminUser;
  onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-200 transition-all duration-200",
          collapsed ? "w-16" : "w-64",
          "hidden lg:flex",
        )}
      >
        <SidebarInner collapsed={collapsed} isActive={isActive} user={user} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-200 lg:hidden">
            <SidebarInner
              collapsed={false}
              isActive={isActive}
              user={user}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all",
          collapsed ? "lg:pl-16" : "lg:pl-64",
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            className="lg:hidden rounded-md p-2 hover:bg-slate-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            className="hidden lg:inline-flex rounded-md p-2 hover:bg-slate-100"
            onClick={() => setCollapsed((c) => !c)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100">
                <UserInitial name={user.username} className="h-8 w-8" />
                <span className="hidden text-sm font-medium sm:inline">
                  {user.username}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal text-slate-500">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}

function SidebarInner({
  collapsed,
  isActive,
  user,
  onNavigate,
}: {
  collapsed: boolean;
  isActive: (to: string, exact?: boolean) => boolean;
  user: AdminUser;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-deep text-white font-display text-lg">
          T
        </div>
        {!collapsed && (
          <span className="font-display text-lg tracking-tight text-white">
            TourFlow
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(
            item.to,
            "exact" in item ? item.exact : false,
          );
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-teal-deep text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3">
          <UserInitial name={user.username} className="h-9 w-9" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user.username}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function UserInitial({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-teal-deep text-sm font-semibold uppercase text-white",
        className,
      )}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
    completed: "bg-slate-200 text-slate-800",
    published: "bg-emerald-100 text-emerald-800",
    hidden: "bg-slate-200 text-slate-700",
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-slate-200 text-slate-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        map[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {status}
    </span>
  );
}
