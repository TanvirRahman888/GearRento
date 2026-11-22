
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { RentalRequestCard } from "./rental-request-card";

import type {
  OwnerRentalBooking,
  OwnerRentalStatus,
  OwnerRentalsResponse,
} from "./rental-request-types";

export function RentalRequestsList() {
  const [bookings, setBookings] =
    useState<OwnerRentalBooking[]>([]);

  const [stats, setStats] =
    useState<OwnerRentalsResponse["stats"] | null>(null);

  const [pagination, setPagination] =
    useState<OwnerRentalsResponse["pagination"] | null>(
      null
    );

  const [status, setStatus] =
    useState<OwnerRentalStatus>("all");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completingId, setCompletingId] =
    useState<string | null>(null);

  // ====================================
  // Fetch Owner's paid rentals
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRentals(): Promise<OwnerRentalsResponse> {
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

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      const params = new URLSearchParams({
        page: String(page),
        status,
      });

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/owner?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result =
        (await response.json()) as OwnerRentalsResponse;

      if (
        !response.ok ||
        !result.success ||
        !Array.isArray(result.bookings) ||
        !result.pagination ||
        !result.stats
      ) {
        throw new Error(
          result.error || "Unable to load rental requests."
        );
      }

      return result;
    }

    void fetchRentals()
      .then((result) => {
        if (controller.signal.aborted) return;

        const totalPages = Math.max(
          1,
          result.pagination.totalPages
        );

        // Handle an empty final page after completion.
        if (page > totalPages) {
          setPage(totalPages);
          return;
        }

        setBookings(result.bookings);
        setStats(result.stats);
        setPagination(result.pagination);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load rental requests."
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
  }, [page, status, refreshKey]);

  // ====================================
  // Refresh
  // ====================================

  function handleRefresh() {
    setLoading(true);
    setError("");
    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Status Filter
  // ====================================

  function handleStatusChange(
    nextStatus: OwnerRentalStatus
  ) {
    if (nextStatus === status) return;

    setLoading(true);
    setError("");
    setStatus(nextStatus);

    if (page === 1) {
      // Changing status triggers the Effect.
      return;
    }

    setPage(1);
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

    setLoading(true);
    setError("");
    setPage(nextPage);
  }

  // ====================================
  // Complete Rental (API)
  // ====================================

  async function completeBooking(bookingId: string) {
    if (completingId) return;

    setCompletingId(bookingId);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error(
          "Please log in again to complete this rental."
        );
      }

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/owner/${bookingId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Unable to complete rental."
        );
      }

      toast.success("Rental marked as completed.");

      // Reload records and updated statistics.
      if (page !== 1) {
        setLoading(true);
        setPage(1);
      } else {
        handleRefresh();
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to complete rental."
      );
    } finally {
      setCompletingId(null);
    }
  }

  // ====================================
  // Sonner Confirmation
  // ====================================

  function confirmCompletion(
    booking: OwnerRentalBooking
  ) {
    toast.warning("Mark rental as completed?", {
      description:
        `Confirm that "${booking.equipmentName}" ` +
        "has been returned. This action cannot be undone.",
      duration: 15000,

      action: {
        label: "Yes, Complete",
        onClick: () => {
          void completeBooking(booking._id);
        },
      },

      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Paid Rentals
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats?.total ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3
              size={16}
              className="text-emerald-600"
            />
            Confirmed
          </div>

          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats?.confirmed ?? "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2
              size={16}
              className="text-blue-600"
            />
            Completed
          </div>

          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.completed ?? "—"}
          </p>
        </div>
      </div>

      {/* Heading / Filters */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Equipment Rental Bookings
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View paid customer bookings and manage
            rental completion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="rental-status" className="sr-only">
            Filter rental status
          </label>

          <select
            id="rental-status"
            value={status}
            onChange={(event) =>
              handleStatusChange(
                event.target.value as OwnerRentalStatus
              )
            }
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Paid Rentals</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
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
              Loading rental bookings...
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
            Unable to Load Rentals
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <ShoppingBag
            size={44}
            className="mx-auto text-muted-foreground"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Rental Bookings Found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {status === "all"
              ? "No paid bookings have been made for your equipment yet."
              : `You don't have any ${status} rentals.`}
          </p>

          <Link
            href="/dashboard/my-equipment"
            className="mt-5 inline-flex rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            View My Equipment
          </Link>
        </div>
      )}

      {/* Real Bookings */}
      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <RentalRequestCard
              key={booking._id}
              booking={booking}
              completing={completingId === booking._id}
              onComplete={confirmCompletion}
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
            aria-label="Rental pagination"
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
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  handlePageChange(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
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
