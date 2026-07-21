import { StatusBadge } from "@/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookingStatus } from "@/lib/api/types";
import type { Booking } from "../types";

export default function BookingDetails({
  booking,
  updating,
  updateStatus,
}: {
  booking: Booking;
  updating: boolean;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
}) {
  return (
    <div className="mt-4 space-y-5">
      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Customer
        </h4>
        {booking.customer ? (
          <div className="mt-2 flex items-center gap-3">
            {booking.customer.avatar ? (
              <img
                src={booking.customer.avatar}
                className="h-10 w-10 rounded-full object-cover"
                alt={booking.customer.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-100" />
            )}
            <div>
              <div className="font-medium">{booking.customer.name}</div>
              <div className="text-sm text-slate-500">
                {booking.customer.email}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Customer account is no longer available.
          </p>
        )}
      </section>
      <section className="rounded-lg border border-slate-200 p-4 text-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trip
        </h4>
        <dl className="mt-2 grid grid-cols-2 gap-y-2">
          <dt className="text-slate-500">Item</dt>
          <dd>
            {booking.tour?.title ?? booking.activity?.title ?? "Deleted item"}
          </dd>
          <dt className="text-slate-500">Type</dt>
          <dd className="capitalize">{booking.itemType}</dd>
          <dt className="text-slate-500">Travel date</dt>
          <dd>{booking.travelDate}</dd>
          <dt className="text-slate-500">Adults</dt>
          <dd>{booking.adults}</dd>
          <dt className="text-slate-500">Children</dt>
          <dd>{booking.children}</dd>
          <dt className="text-slate-500">Total</dt>
          <dd className="font-medium">
            ${booking.totalPrice.toLocaleString()}
          </dd>
        </dl>
      </section>
      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Status
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={booking.status} />
          <Select
            disabled={updating}
            value={booking.status}
            onValueChange={(next) =>
              updateStatus(booking.id, next as BookingStatus)
            }
          >
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
      <section className="rounded-lg border border-slate-200 p-4 text-sm">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Payment
        </h4>
        <dl className="mt-2 grid grid-cols-2 gap-y-2">
          <dt className="text-slate-500">Status</dt>
          <dd className="capitalize">{booking.paymentStatus}</dd>
          <dt className="text-slate-500">Method</dt>
          <dd className="capitalize">{booking.paymentMethod ?? "—"}</dd>
          <dt className="text-slate-500">Reference</dt>
          <dd>{booking.paymentReference ?? "—"}</dd>
          <dt className="text-slate-500">Paid at</dt>
          <dd>
            {booking.paidAt
              ? new Date(booking.paidAt).toLocaleString()
              : "—"}
          </dd>
        </dl>
      </section>
      <section className="rounded-lg border border-slate-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Activity log
        </h4>
        <ul className="mt-2 space-y-2 text-sm">
          {booking.events.map((event, index) => (
            <li
              key={`${event.occurredAt}-${index}`}
              className="flex items-start gap-3"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-teal-deep" />
              <div>
                <div>{event.label}</div>
                <div className="text-xs text-slate-500">
                  {new Date(event.occurredAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
