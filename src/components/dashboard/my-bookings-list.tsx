
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ImageIcon,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

// ======================================
// Types
// ======================================

type Booking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  quantity: number;
  dailyPrice: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type BookingsResponse = {
  success: boolean;
  bookings: Booking[];
  pagination: Pagination;
  error?: string;
};

// ======================================
// Helpers
// ======================================

function formatRentalDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  return new Date(
    `${date}T00:00:00.000Z`
  ).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatCreatedDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

function getBookingStatus(status: string) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      };

    case "completed":
      return {
        label: "Completed",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };

    case "checkout_pending":
      return {
        label: "Payment Pending",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };

    case "expired":
      return {
        label: "Expired",
        className: "bg-muted text-muted-foreground",
      };

    case "payment_failed":
    case "checkout_failed":
      return {
        label: "Payment Failed",
        className:
          "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        className: "bg-muted text-muted-foreground",
      };

    default:
      return {
        label: status.replaceAll("_", " "),
        className: "bg-muted text-muted-foreground",
      };
  }
}

// ======================================
// Booking Image with Fallback
// ======================================

function BookingImage({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  const [failedSrc, setFailedSrc] =
    useState<string | null>(null);

  const showImage = Boolean(
    src && failedSrc !== src
  );

  return (
    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted sm:size-24">
      {showImage ? (
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
          size={30}
          className="text-muted-foreground/50"
        />
      )}
    </div>
  );
}

// ======================================
// Individual Booking Card
// ======================================

function BookingCard({
  booking,
}: {
  booking: Booking;
}) {
  const status = getBookingStatus(booking.status);
  const paid = booking.paymentStatus === "paid";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        {/* Equipment and Booking Status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <BookingImage
              src={booking.imageUrl}
              name={booking.equipmentName}
            />

            <div className="min-w-0 flex-1">
              <Link
                href={`/equipment/${booking.equipmentId}`}
                className="line-clamp-2 font-semibold transition-colors hover:text-primary"
              >
                {booking.equipmentName}
              </Link>

              <p className="mt-2 text-xs text-muted-foreground">
                Booked on{" "}
                {formatCreatedDate(booking.createdAt)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Booking #
                {booking._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Rental Information */}
        <div className="mt-5 grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              Start Date
            </p>

            <p className="mt-1 text-sm font-semibold">
              {formatRentalDate(booking.startDate)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              End Date
            </p>

            <p className="mt-1 text-sm font-semibold">
              {formatRentalDate(booking.endDate)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package size={14} />
              Rental Details
            </p>

            <p className="mt-1 text-sm font-semibold">
              {booking.quantity}{" "}
              {booking.quantity === 1
                ? "unit"
                : "units"}
              {" · "}
              {booking.totalDays}{" "}
              {booking.totalDays === 1
                ? "day"
                : "days"}
            </p>
          </div>
        </div>

        {/* Price and Payment Status */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Total Rental Amount
            </p>

            <p className="mt-1 text-2xl font-bold text-primary">
              ৳
              {booking.totalPrice.toLocaleString(
                "en-BD"
              )}
            </p>

            <p
              className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                paid
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              <CreditCard size={14} />

              {paid
                ? "Payment Successful"
                : "Not Paid"}
            </p>
          </div>

          <Link
            href={`/equipment/${booking.equipmentId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
          >
            View Equipment
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ======================================
// My Bookings List
// ======================================

export function MyBookingsList() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Used to refetch without changing page
  const [refreshKey, setRefreshKey] = useState(0);

  // ====================================
  // Fetch Customer Bookings
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBookings(): Promise<BookingsResponse> {
      const tokenResult = await authClient.token();

      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const apiURL =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error(
          "API URL is not configured."
        );
      }

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/mine?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result =
        (await response.json()) as BookingsResponse;

      if (
        !response.ok ||
        !result.success ||
        !Array.isArray(result.bookings) ||
        !result.pagination
      ) {
        throw new Error(
          result.error ||
            "Unable to load bookings."
        );
      }

      return result;
    }

    // All state updates happen asynchronously,
    // after the request resolves or rejects.
    void fetchBookings()
      .then((result) => {
        if (controller.signal.aborted) return;

        setBookings(result.bookings);
        setPagination(result.pagination);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load bookings."
        );

        setBookings([]);
        setPagination(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [page, refreshKey]);

  // ====================================
  // Refresh Handler
  // ====================================

  function handleRefresh() {
    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Pagination Handler
  // ====================================

  function handlePageChange(nextPage: number) {
    if (
      loading ||
      nextPage < 1 ||
      (pagination &&
        nextPage > pagination.totalPages)
    ) {
      return;
    }

    if (nextPage === page) return;

    setLoading(true);
    setError("");

    setPage(nextPage);
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            My Rental Bookings
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {pagination
              ? `${pagination.total} bookings found`
              : "Track your rental bookings and payments."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading your bookings...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-7"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Bookings
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <ShoppingBag
              size={44}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No Bookings Yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              You have not booked any equipment yet.
              Browse the GearRento marketplace to
              find equipment for your next rental.
            </p>

            <Link
              href="/equipment"
              className="mt-5 inline-flex rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
            >
              Browse Equipment
            </Link>
          </div>
        )}

      {/* Booking Cards */}
      {!loading &&
        !error &&
        bookings.length > 0 && (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
              />
            ))}
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label="Booking pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
          >
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  handlePageChange(page - 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {/* Next */}
              <button
                type="button"
                disabled={
                  page >= pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </nav>
        )}
    </div>
  );
}
