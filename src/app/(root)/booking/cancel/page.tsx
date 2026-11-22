
import Link from "next/link";

import {
  ArrowLeft,
  XCircle,
} from "lucide-react";

export default function BookingCancelPage() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">

        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary">
          <XCircle
            size={34}
            className="text-destructive"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Checkout Not Completed
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          You returned from Stripe Checkout without
          completing your payment. Your booking
          has not been confirmed.
        </p>

        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          A temporary inventory hold may remain
          until the Stripe Checkout Session expires.
        </p>

        <Link
          href="/equipment"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
        >
          <ArrowLeft size={17} />
          Back to Equipment
        </Link>
      </div>
    </section>
  );
}
