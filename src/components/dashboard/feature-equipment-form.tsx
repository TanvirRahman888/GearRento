
"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CreditCard,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// ======================================
// Types
// ======================================

type Duration = 5 | 15 | 30;

type QuoteOption = {
  days: Duration;
  amountPaisa: number;
  amountBDT: number;
  eligible: boolean;
  effectivePercent: number;
};

type QuoteResponse = {
  success: boolean;

  equipment: {
    id: string;
    name: string;
    dailyPrice: number;
    featureExpiresAt: string | null;
  };

  pricing: {
    baseRatePercent: number;
    maxRatePercent: number;
    minimumTotalBDT: number;
  };

  options: QuoteOption[];
  error?: string;
};

type CheckoutResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

// ======================================
// Helpers
// ======================================

function apiBase() {
  const value =
    process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing."
    );
  }

  return value.replace(/\/+$/, "");
}

async function token() {
  const response = await authClient.token();

  if (!response.data?.token) {
    throw new Error(
      "Please sign in as a Product Owner again."
    );
  }

  return response.data.token;
}

function taka(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(
    "en-BD",
    {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

// ======================================
// Feature Equipment Form
// ======================================

export function FeatureEquipmentForm({
  equipmentId,
}: {
  equipmentId: string;
}) {
  const [quote, setQuote] =
    useState<QuoteResponse | null>(null);

  const [days, setDays] =
    useState<Duration>(5);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [notice, setNotice] =
    useState("");

  // ====================================
  // Return from Stripe Checkout
  // ====================================

  useEffect(() => {
    const payment = new URLSearchParams(
      window.location.search
    ).get("payment");

    if (payment === "success") {
      setNotice(
        "Checkout returned successfully. Promotion activates after Stripe confirms payment. Refresh the status shortly."
      );
    }

    if (payment === "cancelled") {
      setNotice(
        "Checkout was cancelled. No promotion was activated."
      );
    }
  }, []);

  // ====================================
  // Load Promotion Quotes
  // ====================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadQuote() {
      const accessToken = await token();

      if (controller.signal.aborted) {
        return;
      }

      const response = await fetch(
        `${apiBase()}/owner/equipment/${encodeURIComponent(
          equipmentId
        )}/feature/quote`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          signal: controller.signal,
          cache: "no-store",
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | QuoteResponse
        | null;

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.error ||
            `Could not load promotion options (HTTP ${response.status}).`
        );
      }

      return result;
    }

    void loadQuote()
      .then((result) => {
        if (
          controller.signal.aborted ||
          !result
        ) {
          return;
        }

        setQuote(result);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load feature options."
        );

        setQuote(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [equipmentId, refreshKey]);

  // ====================================
  // Selected Option
  // ====================================

  const selected = quote?.options.find(
    (option) => option.days === days
  );

  const active = Boolean(
    quote?.equipment.featureExpiresAt &&
      new Date(
        quote.equipment.featureExpiresAt
      ).getTime() > Date.now()
  );

  // ====================================
  // Initiate Payment
  // ====================================

  async function handleCheckout() {
    if (
      !selected?.eligible ||
      busy
    ) {
      return;
    }

    setBusy(true);

    try {
      const accessToken =
        await token();

      const response = await fetch(
        `${apiBase()}/owner/equipment/${encodeURIComponent(
          equipmentId
        )}/feature/checkout`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            days,
          }),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | CheckoutResponse
        | null;

      if (
        !response.ok ||
        !result?.success ||
        !result.url
      ) {
        throw new Error(
          result?.error ||
            "Unable to open Stripe Checkout."
        );
      }

      window.location.assign(result.url);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not initiate feature payment."
      );

      setBusy(false);
    }
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Star
              className="text-amber-500"
              size={22}
            />
            Feature Your Equipment
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a promotion period and pay securely
            with Stripe.
          </p>
        </div>

        <button
          type="button"
          disabled={busy || loading}
          onClick={() => {
            setLoading(true);
            setRefreshKey(
              (value) => value + 1
            );
          }}
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Payment Return Notice */}
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-border bg-muted/50 p-4 text-sm"
        >
          {notice}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border p-6 text-sm">
          <Loader2
            className="animate-spin"
            size={20}
          />
          Loading promotion options...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 p-5 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Promotion Form */}
      {!loading && quote && (
        <section className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

          {/* Equipment */}
          <div>
            <h3 className="text-lg font-semibold">
              {quote.equipment.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Rental price: ৳
              {quote.equipment.dailyPrice.toLocaleString(
                "en-BD"
              )}
              /day
            </p>

            {active &&
              quote.equipment.featureExpiresAt && (
                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                  Currently featured until{" "}
                  {formatDate(
                    quote.equipment.featureExpiresAt
                  )}
                  . A new purchase extends this period.
                </p>
              )}
          </div>

          {/* Radio Buttons */}
          <fieldset
            className="space-y-3"
            disabled={busy}
          >
            <legend className="mb-3 text-sm font-semibold">
              Feature duration
            </legend>

            {quote.options.map((option) => (
              <label
                key={option.days}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 ${
                  days === option.days
                    ? "border-primary bg-primary/5"
                    : "border-border"
                } ${
                  !option.eligible
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="feature-days"
                    value={option.days}
                    checked={days === option.days}
                    disabled={
                      !option.eligible || busy
                    }
                    onChange={() =>
                      setDays(option.days)
                    }
                    className="size-4 accent-primary"
                  />

                  <span>
                    <strong>
                      {option.days} days
                    </strong>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      {option.eligible
                        ? `${option.effectivePercent}% effective rate`
                        : "Not eligible at this rental price"}
                    </span>
                  </span>
                </span>

                <strong>
                  {option.eligible
                    ? taka(option.amountBDT)
                    : "Unavailable"}
                </strong>
              </label>
            ))}
          </fieldset>

          {/* Price Summary */}
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <p>
              Base feature rate:{" "}
              <strong>1% per feature-day</strong>
            </p>

            <p className="mt-1">
              Minimum total:{" "}
              <strong>৳30</strong>
              {" · "}
              Maximum effective rate:{" "}
              <strong>2%</strong>
            </p>

            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
              <span>Total to pay</span>

              <span className="text-xl text-primary">
                {selected?.eligible
                  ? taka(selected.amountBDT)
                  : "Not available"}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            onClick={() =>
              void handleCheckout()
            }
            disabled={
              busy ||
              !selected?.eligible
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? (
              <Loader2
                className="animate-spin"
                size={18}
              />
            ) : (
              <CreditCard size={18} />
            )}

            {busy
              ? "Opening Stripe Checkout..."
              : "Pay & Feature Equipment"}
          </button>

          <p className="text-xs leading-5 text-muted-foreground">
            Featured placement starts only after
            Stripe verifies payment. It improves
            visibility but does not guarantee rentals.
            Stripe may enforce its own minimum charge.
          </p>

          <Link
            href="/dashboard/my-equipment"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to My Equipment
          </Link>
        </section>
      )}
    </div>
  );
}
