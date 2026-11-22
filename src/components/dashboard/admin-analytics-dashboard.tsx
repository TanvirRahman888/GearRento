
"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { AdminAnalyticsStatsCards } from "./admin-analytics-stats";
import { AdminAnalyticsCharts } from "./admin-analytics-charts";
import { AdminAnalyticsRankings } from "./admin-analytics-rankings";

import type {
  AdminAnalyticsResponse,
} from "./admin-analytics-types";

export function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] =
    useState<AdminAnalyticsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // ====================================
  // Fetch Analytics from Express
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics():
      Promise<AdminAnalyticsResponse> {
      const tokenResult = await authClient.token();

      if (controller.signal.aborted) {
        throw new Error("Request cancelled.");
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
        throw new Error(
          "API URL is not configured."
        );
      }

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/admin/analytics`,
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
        (await response.json()) as AdminAnalyticsResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.stats ||
        !Array.isArray(result.monthly) ||
        !Array.isArray(result.topEquipment) ||
        !Array.isArray(result.categories)
      ) {
        throw new Error(
          result.error ||
            "Unable to load Admin analytics."
        );
      }

      return result;
    }

    // State updates happen after the
    // asynchronous API request resolves.
    void fetchAnalytics()
      .then((result) => {
        if (controller.signal.aborted) return;

        setAnalytics(result);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  // ====================================
  // Refresh Button
  // ====================================

  function handleRefresh() {
    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">

      {/* Heading and Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Marketplace Analytics
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor GearRento bookings, rental
            performance, and payment trends.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading marketplace analytics...
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
          <div className="flex items-center gap-2">
            <AlertCircle
              size={20}
              className="text-destructive"
            />

            <h3 className="font-semibold text-destructive">
              Unable to Load Analytics
            </h3>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
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

      {/* Real Analytics */}
      {!loading && !error && analytics && (
        <div className="space-y-6">

          {/* KPI Statistics */}
          <AdminAnalyticsStatsCards
            stats={analytics.stats}
          />

          {/* Monthly Charts */}
          <AdminAnalyticsCharts
            monthly={analytics.monthly}
          />

          {/* Equipment and Categories */}
          <AdminAnalyticsRankings
            topEquipment={analytics.topEquipment}
            categories={analytics.categories}
          />

          <p className="text-xs leading-5 text-muted-foreground">
            Analytics are calculated from MongoDB
            bookings. Gross paid amounts represent
            recorded customer payments before any
            refunds, commissions, or Owner payouts.
          </p>
        </div>
      )}
    </div>
  );
}
