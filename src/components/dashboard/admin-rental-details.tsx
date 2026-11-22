
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  AdminRentalBooking,
} from "./admin-rental-types";

type Props = {
  booking: AdminRentalBooking;
};

function formatDate(value: string) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });
}

export function AdminRentalDetails({
  booking,
}: Props) {
  return (
    <div className="grid gap-5 rounded-xl bg-muted/40 p-4 lg:grid-cols-2">
      {/* Customer Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          Customer Information
        </h3>

        <div className="flex items-start gap-2">
          <UserRound
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Full Name
            </p>

            <p className="mt-1 wrap-break-word text-sm font-medium">
              {booking.fullName || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Contact Number
            </p>

            <p className="mt-1 text-sm font-medium">
              {booking.phone || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Rental Address
            </p>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm">
              {booking.address || "Not provided"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {booking.district}, {booking.division}
            </p>
          </div>
        </div>

        {booking.notes && (
          <div>
            <p className="text-xs font-semibold">
              Additional Notes
            </p>

            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      {/* Rental and Payment Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          Rental & Payment Information
        </h3>

        <div className="flex items-start gap-2">
          <Package
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Quantity and Duration
            </p>

            <p className="mt-1 text-sm font-medium">
              {booking.quantity} units · {booking.totalDays} days
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              ৳{booking.dailyPrice.toLocaleString("en-BD")}
              {" "}per unit/day
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Booking Created
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatDate(booking.createdAt)}
            </p>

            {booking.completedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Completed: {formatDate(booking.completedAt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CreditCard
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Stripe Payment
            </p>

            <p className="mt-1 text-sm font-medium">
              {booking.paymentStatus === "paid"
                ? "Payment received"
                : "Payment not completed"}
            </p>

            {booking.paidAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Paid: {formatDate(booking.paidAt)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3 text-xs">
          <p>
            <span className="font-semibold">Booking ID: </span>
            <span className="break-all">{booking._id}</span>
          </p>

          <p>
            <span className="font-semibold">Owner ID: </span>
            <span className="break-all">{booking.ownerId}</span>
          </p>

          <p>
            <span className="font-semibold">Customer ID: </span>
            <span className="break-all">{booking.customerId}</span>
          </p>

          {booking.stripeSessionId && (
            <p>
              <span className="font-semibold">Stripe Session: </span>
              <span className="break-all">
                {booking.stripeSessionId}
              </span>
            </p>
          )}
        </div>

        <Link
          href={`/equipment/${booking.equipmentId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          View Equipment
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
