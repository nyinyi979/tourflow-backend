import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { StatusBadge } from "../../../components/layout/AdminLayout";
import { Button } from "../../../components/ui/Button";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Booking } from "@/types/booking";

export default function BookingDetails({
  activity,
  createdAt,
  customer,
  guests,
  id,
  status,
  totalPrice,
  tour,
  travelDate,
  updateStatus,
}: Booking & {
  updateStatus: (id: string, next: string) => void;
}) {
  return (
    <div className="mt-4 space-y-5">
      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Customer
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <img
            src={customer.avatar}
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-slate-500">{customer.email}</div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 p-4 text-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trip
        </h4>
        <dl className="mt-2 grid grid-cols-2 gap-y-2">
          <dt className="text-slate-500">Item</dt>
          <dd>{tour.name}</dd>
          <dt className="text-slate-500">Type</dt>
          <dd className="capitalize">{tour.type}</dd>
          <dt className="text-slate-500">Travel date</dt>
          <dd>{travelDate}</dd>
          <dt className="text-slate-500">Adults</dt>
          <dd>{guests.adults}</dd>
          <dt className="text-slate-500">Children</dt>
          <dd>{guests.children}</dd>
          <dt className="text-slate-500">Total</dt>
          <dd className="font-medium">${totalPrice.toLocaleString()}</dd>
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Status
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={status} />
          <Select value={status} onValueChange={(v) => updateStatus(id, v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Activity log
        </h4>
        <ul className="mt-2 space-y-2 text-sm">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-deep" />
              <div>
                <div>{a.label}</div>
                <div className="text-xs text-slate-500">{a.at}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Button
        className="w-full bg-teal-deep hover:bg-teal-deep/90"
        onClick={() => toast.success("Confirmation email sent")}
      >
        <Mail className="h-4 w-4" /> Send Confirmation Email
      </Button>
    </div>
  );
}
