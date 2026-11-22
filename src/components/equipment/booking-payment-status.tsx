
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type Props = {
  sessionId: string;
};

type PaymentStatus =
  | "checking"
  | "checkout_pending"
  | "confirmed"
  | "expired"
  | "payment_failed"
  | "checkout_failed"
  | "delayed"
  | "error";

type BookingStatusResponse = {
  success: boolean;
  status: PaymentStatus;
  equipmentName: string;
  totalPrice: number;
  currency: string;
};

export function BookingPaymentStatus({
  sessionId,
}: Props) {
  const [status, setStatus] =
    useState<PaymentStatus>("checking");

  const [equipmentName, setEquipmentName] =
    useState("");

  const [totalPrice, setTotalPrice] = useState(0);

  // =====================================
  // Check booking status from Express
  // =====================================

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;

    async function checkBooking() {
      attempts++;

      try {
        const tokenResult =
          await authClient.token();

        const token = tokenResult.data?.token;

        if (!token) {
          if (!cancelled) {
            setStatus("error");
          }
          return;
        }

        const apiURL =
          process.env.NEXT_PUBLIC_API_URL;

        if (!apiURL) {
          throw new Error("API URL is missing.");
        }

        const response = await fetch(
          `${apiURL.replace(/\/+$/, "")}/bookings/session/${encodeURIComponent(sessionId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to check booking status."
          );
        }

        const result =
          (await response.json()) as BookingStatusResponse;

        if (cancelled) return;

        setEquipmentName(result.equipmentName || "");
        setTotalPrice(result.totalPrice || 0);

        if (result.status === "confirmed") {
          setStatus("confirmed");
          return;
        }

        if (
          result.status === "expired" ||
          result.status === "payment_failed" ||
          result.status === "checkout_failed"
        ) {
          setStatus(result.status);
          return;
        }

        // Webhook may arrive slightly after redirect.
        if (attempts < 15) {
          setStatus("checkout_pending");

          timer = setTimeout(
            checkBooking,
            2000
          );
        } else {
          setStatus("delayed");
        }
      } catch (error) {
        console.error(
          "Booking status check failed:",
          error
        );

        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    void checkBooking();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  // =====================================
  // Status UI
  // =====================================

  const confirmed = status === "confirmed";

  const failed =
    status === "expired" ||
    status === "payment_failed" ||
    status === "checkout_failed";

  return (
    <section className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">

        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
          {confirmed ? (
            <CheckCircle2
              size={36}
              className="text-emerald-600"
            />
          ) : failed ? (
            <XCircle
              size={36}
              className="text-destructive"
            />
          ) : (
            <Clock3
              size={36}
              className="text-primary"
            />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          {confirmed
            ? "Booking Confirmed!"
            : failed
              ? "Booking Not Confirmed"
              : status === "error"
                ? "Unable to Check Payment"
                : "Checking Your Payment"}
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {confirmed
            ? `Your booking for ${equipmentName} has been confirmed.`
            : failed
              ? "Your Checkout was not completed successfully."
              : status === "delayed"
                ? "Payment confirmation is taking longer than expected. Please check again shortly."
                : status === "error"
                  ? "Please sign in and check your booking status again."
                  : "Waiting for verified payment confirmation from Stripe."}
        </p>

        {confirmed && (
          <div className="mt-6 rounded-xl bg-secondary p-5">
            <p className="text-sm text-muted-foreground">
              Total Paid
            </p>

            <p className="mt-2 text-2xl font-bold text-primary">
              ৳{totalPrice.toLocaleString("en-BD")}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Payment verified successfully
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/equipment"
            className="rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            Browse Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}
