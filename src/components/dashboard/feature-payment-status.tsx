
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  CheckCircle2,
  AlertCircle,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";

type Props = {
  equipmentId: string;
  payment: string;
  sessionId?: string;
};

type PaymentResult = {
  success: boolean;
  status: string | null;
  paymentStatus: string | null;
  isFeatured: boolean;
  featureExpiresAt: string | null;
  durationDays: number | null;
  error?: string;
};

type Status =
  | "checking"
  | "active"
  | "pending"
  | "review"
  | "cancelled"
  | "error";

export function FeaturePaymentStatus({
  equipmentId,
  payment,
  sessionId,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<Status>(
    payment === "cancelled"
      ? "cancelled"
      : "checking"
  );

  const [result, setResult] =
    useState<PaymentResult | null>(null);

  const [error, setError] = useState("");

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (payment !== "success") {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    async function verifyPayment() {
      try {
        attempts += 1;

        if (!cancelled) {
          setStatus("checking");
          setError("");
        }

        // Get a Better Auth JWT using
        // the current browser session.
        const tokenResponse = await fetch(
          "/api/auth/token",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!tokenResponse.ok) {
          throw new Error(
            "Unable to verify your login session."
          );
        }

        const tokenData: { token?: string } =
          await tokenResponse.json();

        if (!tokenData.token) {
          throw new Error(
            "Authentication token is missing."
          );
        }

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
          throw new Error(
            "Equipment API URL is not configured."
          );
        }

        const query = sessionId
          ? `?session_id=${encodeURIComponent(sessionId)}`
          : "";

        const url =
          `${API_URL}/owner/equipment/` +
          `${encodeURIComponent(equipmentId)}` +
          `/feature/payment-status${query}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const data: PaymentResult =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Payment verification failed."
          );
        }

        if (cancelled) return;

        setResult(data);

        if (data.isFeatured) {
          setStatus("active");
          router.refresh();
          return;
        }

        if (
          data.paymentStatus === "paid" &&
          data.status === "paid_review"
        ) {
          setStatus("review");
          return;
        }

        if (
          data.paymentStatus === "paid"
        ) {
          setStatus("review");
          return;
        }

        if (
          ["expired", "payment_failed", "checkout_failed"]
            .includes(data.status ?? "")
        ) {
          setStatus("error");
          setError(
            "The Checkout Session is no longer payable. Please review the payment in Stripe before trying again."
          );
          return;
        }

        // Stripe webhook delivery can be delayed.
        // Check a few times, without creating
        // another payment.
        if (attempts < 6) {
          timeout = setTimeout(
            verifyPayment,
            3000
          );
        } else {
          setStatus("pending");
        }
      } catch (err) {
        if (cancelled) return;

        setStatus("error");

        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify payment."
        );
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    equipmentId,
    payment,
    sessionId,
    retry,
    router,
  ]);

  if (payment === "cancelled") {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <div className="flex items-start gap-3">
          <XCircle className="size-6 shrink-0 text-muted-foreground" />

          <div>
            <h3 className="font-semibold">
              Checkout Cancelled
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              The checkout was cancelled. You can
              choose another promotion plan below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (payment !== "success") {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
    >
      {status === "checking" && (
        <div className="flex items-start gap-3">
          <LoaderCircle className="size-6 shrink-0 animate-spin text-primary" />

          <div>
            <h3 className="font-semibold">
              Verifying Featured Payment
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Checking your payment securely with
              Stripe. Do not start another payment.
            </p>
          </div>
        </div>
      )}

      {status === "active" && (
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-6 shrink-0 text-emerald-500" />

          <div className="space-y-2">
            <h3 className="font-semibold">
              Equipment Featured Successfully!
            </h3>

            <p className="text-sm text-muted-foreground">
              Your payment was verified and your
              equipment is now featured.
            </p>

            {result?.featureExpiresAt && (
              <p className="text-sm">
                Featured until:{" "}
                <strong>
                  {new Date(
                    result.featureExpiresAt
                  ).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Dhaka",
                  })}
                </strong>
              </p>
            )}

            <Link
              href="/dashboard/my-equipment"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              View My Equipment
            </Link>
          </div>
        </div>
      )}

      {status === "pending" && (
        <div className="flex items-start gap-3">
          <Clock3 className="size-6 shrink-0 text-primary" />

          <div className="space-y-3">
            <h3 className="font-semibold">
              Payment Confirmation Pending
            </h3>

            <p className="text-sm text-muted-foreground">
              We could not verify a completed payment
              yet. Please check your Stripe payment
              before trying again.
            </p>

            <button
              type="button"
              onClick={() => setRetry((n) => n + 1)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Check Again
            </button>
          </div>
        </div>
      )}

      {status === "review" && (
        <div className="flex items-start gap-3">
          <AlertCircle className="size-6 shrink-0 text-amber-500" />

          <div>
            <h3 className="font-semibold">
              Payment Received — Review Required
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Stripe payment was recorded, but your
              listing is not currently active as
              featured. Please contact support
              before purchasing another promotion.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-3">
          <AlertCircle className="size-6 shrink-0 text-destructive" />

          <div className="space-y-3">
            <h3 className="font-semibold">
              Unable to Confirm Promotion
            </h3>

            <p className="text-sm text-muted-foreground">
              {error ||
                "We could not confirm the payment."}
            </p>

            <button
              type="button"
              onClick={() => setRetry((n) => n + 1)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Retry Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
