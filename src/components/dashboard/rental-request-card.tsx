
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  ImageIcon,
  MapPin,
  Package,
  Phone,
  UserRound,
} from "lucide-react";

import type {
  OwnerRentalBooking,
} from "./rental-request-types";

type Props = {
  booking: OwnerRentalBooking;
  completing: boolean;
  onComplete: (booking: OwnerRentalBooking) => void;
};

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Date(
    `${value}T00:00:00.000Z`
  ).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getBangladeshToday() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((item) => [item.type, item.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function RentalImage({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const [failedSrc, setFailedSrc] =
    useState<string | null>(null);

  return (
    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted sm:size-24">
      {src && failedSrc !== src ? (
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          sizes="96px"
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <ImageIcon
          size={28}
          className="text-muted-foreground"
        />
      )}
    </div>
  );
}

export function RentalRequestCard({
  booking,
  completing,
  onComplete,
}: Props) {
  const isCompleted = booking.status === "completed";

  // Do not release reserved dates prematurely.
  const canComplete =
    booking.status === "confirmed" &&
    booking.endDate < getBangladeshToday();

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="space-y-5 p-4 sm:p-6">

        {/* Equipment Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-3">
            <RentalImage
              src={booking.imageUrl}
              name={booking.equipmentName}
            />

            <div className="min-w-0">
              <Link
                href={`/equipment/${booking.equipmentId}`}
                className="line-clamp-2 font-semibold hover:text-primary"
              >
                {booking.equipmentName}
              </Link>

              <p className="mt-2 text-xs text-muted-foreground">
                Booking #{booking._id.slice(-8).toUpperCase()}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CreditCard size={13} />
                Payment received
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isCompleted
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={14} />
            ) : (
              <Clock3 size={14} />
            )}

            {isCompleted ? "Completed" : "Confirmed"}
          </span>
        </div>

        {/* Rental Details */}
        <div className="grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              Start Date
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(booking.startDate)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              End Date
            </p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(booking.endDate)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package size={14} />
              Rental
            </p>
            <p className="mt-1 text-sm font-semibold">
              {booking.quantity}{" "}
              {booking.quantity === 1 ? "unit" : "units"}
              {" · "}
              {booking.totalDays}{" "}
              {booking.totalDays === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        {/* Customer and Delivery */}
        <div className="border-t border-border pt-5">
          <h3 className="mb-4 text-sm font-semibold">
            Customer & Rental Address
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <UserRound
                size={17}
                className="mt-0.5 shrink-0 text-primary"
              />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Customer Name
                </p>
                <p className="mt-1 wrap-break-word text-sm font-medium">
                  {booking.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone
                size={17}
                className="mt-0.5 shrink-0 text-primary"
              />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Contact Number
                </p>

                <a
                  href={`tel:${booking.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-1 block text-sm font-medium hover:text-primary"
                >
                  {booking.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin
                size={17}
                className="mt-0.5 shrink-0 text-primary"
              />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Rental Address
                </p>

                <p className="mt-1 wrap-break-word text-sm">
                  {booking.address}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.district}, {booking.division}
                </p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="mt-4 rounded-xl bg-muted/50 p-3">
              <p className="text-xs font-semibold">
                Additional Notes
              </p>

              <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground">
                {booking.notes}
              </p>
            </div>
          )}
        </div>

        {/* Payment / Actions */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-xs text-muted-foreground">
              Total Paid by Customer
            </p>

            <p className="mt-1 text-2xl font-bold text-primary">
              ৳{booking.totalPrice.toLocaleString("en-BD")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/equipment/${booking.equipmentId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent"
            >
              View Equipment
              <ArrowUpRight size={16} />
            </Link>

            {canComplete && (
              <button
                type="button"
                onClick={() => onComplete(booking)}
                disabled={completing}
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90 disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                {completing
                  ? "Updating..."
                  : "Mark Completed"}
              </button>
            )}
          </div>
        </div>

        {!isCompleted && !canComplete && (
          <p className="text-xs text-muted-foreground">
            Completion becomes available after the
            rental end date. Confirm the equipment has
            been returned before marking it completed.
          </p>
        )}
      </div>
    </article>
  );
}
