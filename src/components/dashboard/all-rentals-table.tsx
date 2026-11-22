
"use client";

import {
  Fragment,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { AdminRentalStats } from "./admin-rental-stats";
import { AdminRentalDetails } from "./admin-rental-details";

import type {
  AdminRentalBooking,
  AdminRentalStats as RentalStats,
  AdminRentalStatus,
  AdminPaymentFilter,
  AdminRentalsResponse,
} from "./admin-rental-types";

// ======================================
// Helpers
// ======================================

function formatRentalDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value || "—";
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

function getStatusInfo(status: string) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        color:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      };

    case "completed":
      return {
        label: "Completed",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };

    case "checkout_pending":
      return {
        label: "Checkout Pending",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };

    case "payment_failed":
    case "checkout_failed":
      return {
        label: "Payment Failed",
        color:
          "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };

    case "expired":
      return {
        label: "Expired",
        color: "bg-muted text-muted-foreground",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-muted text-muted-foreground",
      };

    default:
      return {
        label: status.replaceAll("_", " "),
        color: "bg-muted text-muted-foreground",
      };
  }
}

const selectClass =
  "rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";

// ======================================
// All Rentals Table
// ======================================

export function AllRentalsTable() {
  const [bookings, setBookings] =
    useState<AdminRentalBooking[]>([]);

  const [stats, setStats] =
    useState<RentalStats | null>(null);

  const [pagination, setPagination] =
    useState<AdminRentalsResponse["pagination"] | null>(
      null
    );

  const [status, setStatus] =
    useState<AdminRentalStatus>("all");

  const [payment, setPayment] =
    useState<AdminPaymentFilter>("all");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  // ====================================
  // Load Admin Rentals
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRentals(): Promise<AdminRentalsResponse> {
      const tokenResult = await authClient.token();

      if (controller.signal.aborted) {
        throw new Error("Request cancelled");
      }

      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const apiURL =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      const params = new URLSearchParams({
        page: String(page),
        status,
        payment,
      });

      if (search) {
        params.set("q", search);
      }

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/admin?${params.toString()}`,
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
        (await response.json()) as AdminRentalsResponse;

      if (
        !response.ok ||
        !result.success ||
        !Array.isArray(result.bookings) ||
        !result.pagination ||
        !result.stats
      ) {
        throw new Error(
          result.error || "Unable to load rentals."
        );
      }

      return result;
    }

    void fetchRentals()
      .then((result) => {
        if (controller.signal.aborted) return;

        setBookings(result.bookings);
        setPagination(result.pagination);
        setStats(result.stats);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load rental bookings."
        );

        setBookings([]);
        setPagination(null);
        setStats(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [page, status, payment, search, refreshKey]);

  // ====================================
  // Refresh
  // ====================================

  function handleRefresh() {
    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Search
  // ====================================

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    setLoading(true);
    setError("");
    setExpandedId(null);

    setSearch(nextSearch);
    setPage(1);

    if (nextSearch === search && page === 1) {
      setRefreshKey((current) => current + 1);
    }
  }

  // ====================================
  // Status Filter
  // ====================================

  function handleStatusChange(
    nextStatus: AdminRentalStatus
  ) {
    if (nextStatus === status) return;

    setLoading(true);
    setError("");
    setExpandedId(null);

    setStatus(nextStatus);
    setPage(1);
  }

  // ====================================
  // Payment Filter
  // ====================================

  function handlePaymentChange(
    nextPayment: AdminPaymentFilter
  ) {
    if (nextPayment === payment) return;

    setLoading(true);
    setError("");
    setExpandedId(null);

    setPayment(nextPayment);
    setPage(1);
  }

  // ====================================
  // Clear Filters
  // ====================================

  function handleClearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setPayment("all");
    setPage(1);
    setExpandedId(null);

    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Pagination
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
    setExpandedId(null);

    setPage(nextPage);
  }

  // ====================================
  // Toggle Booking Details
  // ====================================

  function toggleDetails(id: string) {
    setExpandedId((current) =>
      current === id ? null : id
    );
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">
      {/* Dashboard Statistics */}
      <AdminRentalStats stats={stats} />

      {/* Search and Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">
              All Rental Bookings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {pagination
                ? `${pagination.total} matching records`
                : "Monitor customer bookings and payments."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_170px_auto]">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex min-w-0 items-center gap-2"
          >
            <label
              htmlFor="admin-rental-search"
              className="sr-only"
            >
              Search rentals
            </label>

            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                id="admin-rental-search"
                type="search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                maxLength={100}
                placeholder="Equipment, customer, phone, booking ID..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          {/* Booking Status */}
          <div>
            <label
              htmlFor="admin-rental-status"
              className="sr-only"
            >
              Booking status
            </label>

            <select
              id="admin-rental-status"
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value as AdminRentalStatus
                )
              }
              className={`${selectClass} w-full`}
            >
              <option value="all">All Booking Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="checkout_pending">
                Checkout Pending
              </option>
              <option value="checkout_failed">
                Checkout Failed
              </option>
              <option value="payment_failed">
                Payment Failed
              </option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label
              htmlFor="admin-payment-status"
              className="sr-only"
            >
              Payment status
            </label>

            <select
              id="admin-payment-status"
              value={payment}
              onChange={(event) =>
                handlePaymentChange(
                  event.target.value as AdminPaymentFilter
                )
              }
              className={`${selectClass} w-full`}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading all rental bookings...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-8"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Rentals
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-5 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <ShoppingBag
            size={44}
            className="mx-auto text-muted-foreground"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Rental Bookings Found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No bookings match your current filters.
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* Rental Table */}
      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-270 text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-4 font-semibold">
                    Equipment
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Customer
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Rental Dates
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Payment
                  </th>
                  <th className="px-4 py-4 font-semibold">
                    Booking Status
                  </th>
                  <th className="px-4 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {bookings.map((booking) => {
                  const bookingStatus =
                    getStatusInfo(booking.status);

                  const paid =
                    booking.paymentStatus === "paid";

                  const expanded =
                    expandedId === booking._id;

                  return (
                    <Fragment key={booking._id}>
                      <tr className="transition-colors hover:bg-muted/30">
                        {/* Equipment */}
                        <td className="max-w-64 px-4 py-4 align-top">
                          <Link
                            href={`/equipment/${booking.equipmentId}`}
                            className="line-clamp-2 font-semibold hover:text-primary"
                          >
                            {booking.equipmentName}
                          </Link>

                          <p className="mt-1 text-xs text-muted-foreground">
                            #{booking._id.slice(-8).toUpperCase()}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-4 align-top">
                          <p className="font-medium">
                            {booking.fullName || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {booking.district || "—"}
                          </p>
                        </td>

                        {/* Rental Period */}
                        <td className="px-4 py-4 align-top">
                          <p>
                            {formatRentalDate(booking.startDate)}
                          </p>

                          <p className="mt-1 text-muted-foreground">
                            to {formatRentalDate(booking.endDate)}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {booking.quantity} unit(s) ·{" "}
                            {booking.totalDays} day(s)
                          </p>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-4 align-top">
                          <p className="font-bold text-primary">
                            ৳
                            {booking.totalPrice.toLocaleString(
                              "en-BD"
                            )}
                          </p>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              paid
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {paid
                              ? "Paid"
                              : booking.paymentStatus || "Unpaid"}
                          </span>
                        </td>

                        {/* Booking Status */}
                        <td className="px-4 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${bookingStatus.color}`}
                          >
                            {bookingStatus.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right align-top">
                          <button
                            type="button"
                            onClick={() =>
                              toggleDetails(booking._id)
                            }
                            aria-expanded={expanded}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                          >
                            {expanded ? "Hide Details" : "View Details"}

                            {expanded ? (
                              <ChevronUp size={15} />
                            ) : (
                              <ChevronDown size={15} />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {expanded && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-4 sm:p-6"
                          >
                            <AdminRentalDetails
                              booking={booking}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label="Admin rental pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
          >
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  handlePageChange(page - 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >= pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
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
