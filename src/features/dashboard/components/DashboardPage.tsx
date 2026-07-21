import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarCheck,
  Map,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookingListQueryOptions } from "@/features/bookings/queries";
import { dashboardQueryOptions } from "../queries";
import { useQuery } from "@tanstack/react-query";

function StatCard({
  label,
  value,
  trend,
  Icon,
}: {
  label: string;
  value: string;
  trend: number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const up = trend >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-md bg-slate-100 p-2 text-teal-deep">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
          up ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {up ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {up ? "+" : ""}
        {trend}% vs last month
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const dashboardQuery = useQuery(dashboardQueryOptions());
  const bookingsQuery = useQuery(
    bookingListQueryOptions({
      page: 0,
      perPage: 6,
      sortBy: "createdAt",
      orderBy: "desc",
    }),
  );

  if (dashboardQuery.isLoading) {
    return (
      <p className="py-10 text-center text-slate-500">Loading dashboard…</p>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <p className="py-10 text-center text-rose-600">
        Unable to load dashboard data.
      </p>
    );
  }

  const { dashboardStats, monthlyRevenue, topTours } = dashboardQuery.data;
  const recent = bookingsQuery.data?.data ?? [];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
          trend={dashboardStats.trends.revenue}
          Icon={DollarSign}
        />
        <StatCard
          label="Total Bookings"
          value={dashboardStats.totalBookings.toString()}
          trend={dashboardStats.trends.bookings}
          Icon={CalendarCheck}
        />
        <StatCard
          label="Active Tours"
          value={dashboardStats.activeTours.toString()}
          trend={dashboardStats.trends.tours}
          Icon={Map}
        />
        <StatCard
          label="New Customers"
          value={dashboardStats.newCustomers.toString()}
          trend={dashboardStats.trends.customers}
          Icon={Users}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Revenue — last 12 months
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--teal-deep)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Bookings per month
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="var(--teal-deep)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">
            Recent bookings
          </h3>
          <div className="mt-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">
                      {b.bookingNumber}
                    </TableCell>
                    <TableCell>
                      {b.customer?.name ?? "Deleted customer"}
                    </TableCell>
                    <TableCell>{b.tour.name}</TableCell>
                    <TableCell>{b.travelDate}</TableCell>
                    <TableCell>{b.guests.adults + b.guests.children}</TableCell>
                    <TableCell>${b.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!bookingsQuery.isLoading && recent.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-slate-500"
                    >
                      No bookings yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">Top tours</h3>
          <div className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>★</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTours.map((t) => (
                  <TableRow key={t.name}>
                    <TableCell className="max-w-40 truncate">
                      {t.name}
                    </TableCell>
                    <TableCell>{t.bookings}</TableCell>
                    <TableCell>${t.revenue.toLocaleString()}</TableCell>
                    <TableCell>{t.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
