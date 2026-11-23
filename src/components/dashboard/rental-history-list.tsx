
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock3,
  ImageOff,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

// =====================================
// Types
// =====================================

type HistoryStatus =
  | "all"
  | "completed"
  | "awaiting";

type HistorySort =
  | "newest"
  | "oldest";

type HistoryBooking = {
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

  division: string;
  district: string;
  address: string;
  notes: string;

  status: "completed" | "confirmed";
  paymentStatus: string;

  paidAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
};

type HistoryResponse = {
  success: boolean;

  bookings: HistoryBooking[];

  stats: {
    totalPastRentals: number;
    completedRentals: number;
    awaitingCompletion: number;
    totalPaidAmount: number;
  };

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  error?: string;
};

// =====================================
// Helpers
// =====================================

function apiBase() {
  const url =
    process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing."
    );
  }

  return url.replace(/\/+$/, "");
}

async function accessToken() {
  const result = await authClient.token();

  if (!result.data?.token) {
    throw new Error(
      "Session expired. Please sign in again."
    );
  }

  return result.data.token;
}

function formatDate(
  value: string | null
) {
  if (!value) return "—";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00.000Z`
      : value
  );

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-BD",
    {
      day: "numeric",
      month: "short",
      year: "numeric",

      timeZone:
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? "UTC"
          : "Asia/Dhaka",
    }
  ).format(date);
}

function taka(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
}

// =====================================
// Equipment Image
// =====================================

function EquipmentThumbnail({
  booking,
}: {
  booking: HistoryBooking;
}) {
  const [failed, setFailed] =
    useState(false);

  const validUrl =
    /^https?:\/\//i.test(
      booking.imageUrl
    );

  return (
    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
      {validUrl && !failed ? (
        <Image
          src={booking.imageUrl}
          alt={booking.equipmentName}
          fill
          unoptimized
          sizes="80px"
          className="object-cover"
          onError={() =>
            setFailed(true)
          }
        />
      ) : (
        <ImageOff
          className="text-muted-foreground"
          size={25}
        />
      )}
    </div>
  );
}

// =====================================
// Main Component
// =====================================

export function RentalHistoryList() {
  const [bookings, setBookings] =
    useState<HistoryBooking[]>([]);

  const [stats, setStats] =
    useState<
      HistoryResponse["stats"] | null
    >(null);

  const [pagination, setPagination] =
    useState<
      HistoryResponse["pagination"] | null
    >(null);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<HistoryStatus>("all");

  const [sort, setSort] =
    useState<HistorySort>("newest");

  const [page, setPage] =
    useState(1);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================
  // Load Customer Rental History
  // ===================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function load():
      Promise<HistoryResponse> {
      const token =
        await accessToken();

      if (
        controller.signal.aborted
      ) {
        throw new Error(
          "Cancelled"
        );
      }

      const params =
        new URLSearchParams({
          page: String(page),
          status,
          sort,
        });

      if (search) {
        params.set("q", search);
      }

      const response = await fetch(
        `${apiBase()}/bookings/history?${params}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          cache: "no-store",
          signal: controller.signal,
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          `History API returned a non-JSON response (HTTP ${response.status}). Check the Express route.`
        );
      }

      const data =
        (await response.json()) as
          HistoryResponse;

      if (
        !response.ok ||
        !data.success ||
        !Array.isArray(
          data.bookings
        ) ||
        !data.stats ||
        !data.pagination
      ) {
        throw new Error(
          data.error ||
            "Unable to load rental history."
        );
      }

      return data;
    }

    void load()
      .then((data) => {
        if (
          controller.signal.aborted
        ) {
          return;
        }

        const lastPage =
          Math.max(
            data.pagination.totalPages,
            1
          );

        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        setBookings(data.bookings);
        setStats(data.stats);
        setPagination(data.pagination);
        setError("");
      })
      .catch((cause: unknown) => {
        if (
          controller.signal.aborted
        ) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause.message
            : "Request failed."
        );

        setBookings([]);
        setPagination(null);
      })
      .finally(() => {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      });

    return () =>
      controller.abort();
  }, [
    search,
    status,
    sort,
    page,
    refreshKey,
  ]);

  // ===================================
  // Refresh
  // ===================================

  function refresh() {
    setLoading(true);
    setError("");
    setExpandedId(null);

    setRefreshKey(
      (value) => value + 1
    );
  }

  // ===================================
  // Search
  // ===================================

  function submitSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setExpandedId(null);
    setPage(1);
    setSearch(searchInput.trim());

    setRefreshKey(
      (value) => value + 1
    );
  }

  // ===================================
  // Status Filter
  // ===================================

  function changeStatus(
    value: HistoryStatus
  ) {
    setLoading(true);
    setExpandedId(null);
    setStatus(value);
    setPage(1);

    setRefreshKey(
      (current) => current + 1
    );
  }

  // ===================================
  // Sort
  // ===================================

  function changeSort(
    value: HistorySort
  ) {
    setLoading(true);
    setExpandedId(null);
    setSort(value);
    setPage(1);

    setRefreshKey(
      (current) => current + 1
    );
  }

  // ===================================
  // Pagination
  // ===================================

  function changePage(value: number) {
    if (
      loading ||
      value < 1 ||
      value === page ||
      (pagination &&
        value > pagination.totalPages)
    ) {
      return;
    }

    setLoading(true);
    setExpandedId(null);
    setPage(value);
  }

  // ===================================
  // Summary Cards
  // ===================================

  const summary = [
    {
      label: "Past Paid Rentals",

      value:
        stats?.totalPastRentals
          ?.toLocaleString("en-BD") ??
        "—",

      icon: ClipboardList,
    },
    {
      label: "Completed",

      value:
        stats?.completedRentals
          ?.toLocaleString("en-BD") ??
        "—",

      icon: CheckCircle2,
    },
    {
      label: "Awaiting Completion",

      value:
        stats?.awaitingCompletion
          ?.toLocaleString("en-BD") ??
        "—",

      icon: Clock3,
    },
    {
      label: "Total Paid for Past Rentals",

      value: stats
        ? taka(
            stats.totalPaidAmount
          )
        : "—",

      icon: Banknote,
    },
  ];

  // ===================================
  // Render
  // ===================================

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(
          ({
            label,
            value,
            icon: Icon,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {label}
                </p>

                <Icon
                  size={20}
                  className="shrink-0 text-primary"
                />
              </div>

              <p className="mt-4 wrap-break-word text-2xl font-bold">
                {value}
              </p>
            </div>
          )
        )}
      </div>

      {/* Heading and Filters */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              Rental History
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Paid rentals whose rental
              period has ended.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_160px]">

          {/* Search */}
          <form
            onSubmit={submitSearch}
            className="flex min-w-0 gap-2"
          >
            <label
              htmlFor="history-search"
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
                id="history-search"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                maxLength={100}
                placeholder="Equipment name or booking ID..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Search
            </button>
          </form>

          {/* Status Filter */}
          <select
            aria-label="Filter rental history status"
            value={status}
            onChange={(event) =>
              changeStatus(
                event.target.value as
                  HistoryStatus
              )
            }
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="all">
              All Past Rentals
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="awaiting">
              Awaiting Completion
            </option>
          </select>

          {/* Sort */}
          <select
            aria-label="Sort rental history"
            value={sort}
            onChange={(event) =>
              changeSort(
                event.target.value as
                  HistorySort
              )
            }
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="newest">
              Most Recent
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>
        </div>

        {pagination && (
          <p className="mt-3 text-xs text-muted-foreground">
            {pagination.total} matching{" "}
            {pagination.total === 1
              ? "rental"
              : "rentals"}
          </p>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-border bg-card">
          <Loader2
            className="animate-spin text-primary"
            size={24}
          />

          <span className="text-sm text-muted-foreground">
            Loading rental history...
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-6"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Rental History
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
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

            <CalendarDays
              className="mx-auto text-muted-foreground"
              size={44}
            />

            <h3 className="mt-4 text-lg font-semibold">
              No Past Rentals Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Completed rentals and paid
              rentals with past end dates
              will appear here.
            </p>

            <Link
              href="/dashboard/my-bookings"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              View My Bookings
            </Link>
          </div>
        )}

      {/* Rental History Cards */}
      {!loading &&
        !error &&
        bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCompleted =
                booking.status === "completed";

              const expanded =
                expandedId === booking._id;

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >

                  {/* Card Heading */}
                  <div className="flex flex-wrap items-start gap-4">

                    <EquipmentThumbnail
                      booking={booking}
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold sm:text-lg">
                        {booking.equipmentName}
                      </h3>

                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        Booking ID:{" "}
                        {booking._id}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {isCompleted
                            ? "Completed"
                            : "Awaiting Owner Completion"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2
                            size={14}
                          />
                          Paid
                        </span>
                      </div>
                    </div>

                    {/* Paid Amount */}
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">
                        Amount Paid
                      </p>

                      <p className="mt-1 text-xl font-bold text-primary">
                        {taka(
                          booking.totalPrice
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Rental Dates */}
                  <div className="mt-4 grid gap-3 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-3">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Start Date
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatDate(
                          booking.startDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        End Date
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatDate(
                          booking.endDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Rental Duration
                      </p>

                      <p className="mt-1 font-semibold">
                        {booking.totalDays} day(s)
                        {" · "}
                        {booking.quantity} unit(s)
                      </p>
                    </div>
                  </div>

                  {/* Completion Status */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                    <p className="text-xs text-muted-foreground">
                      {isCompleted
                        ? `Completed: ${formatDate(
                            booking.completedAt
                          )}`
                        : "Your Owner has not marked the rental completed yet."}
                    </p>

                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setExpandedId(
                          expanded
                            ? null
                            : booking._id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                    >
                      {expanded
                        ? "Hide Details"
                        : "View Details"}

                      {expanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expanded && (
                    <div className="mt-4 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">

                      {/* Price Breakdown */}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Price Breakdown
                        </p>

                        <p className="mt-1">
                          Daily price:{" "}
                          <strong>
                            {taka(
                              booking.dailyPrice
                            )}
                          </strong>
                        </p>

                        <p>
                          Duration:{" "}
                          <strong>
                            {booking.totalDays} day(s)
                          </strong>
                        </p>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {booking.quantity}
                          </strong>
                        </p>

                        <p>
                          Total paid:{" "}
                          <strong>
                            {taka(
                              booking.totalPrice
                            )}
                          </strong>
                        </p>
                      </div>

                      {/* Rental Address */}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Rental Delivery Address
                        </p>

                        <p className="mt-1 wrap-break-word">
                          {booking.address ||
                            "—"}
                        </p>

                        <p className="mt-1">
                          {[
                            booking.district,
                            booking.division,
                          ]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </p>
                      </div>

                      {/* Payment Dates */}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Booking & Payment Dates
                        </p>

                        <p className="mt-1">
                          Booked:{" "}
                          {formatDate(
                            booking.createdAt
                          )}
                        </p>

                        <p>
                          Paid:{" "}
                          {formatDate(
                            booking.paidAt
                          )}
                        </p>
                      </div>

                      {/* Notes */}
                      {booking.notes && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Your Notes
                          </p>

                          <p className="mt-1 whitespace-pre-wrap wrap-break-word">
                            {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label="Rental history pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
          >

            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={
                  loading ||
                  page <= 1
                }
                onClick={() =>
                  changePage(page - 1)
                }
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  loading ||
                  page >=
                    pagination.totalPages
                }
                onClick={() =>
                  changePage(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </nav>
        )}
    </div>
  );
}
