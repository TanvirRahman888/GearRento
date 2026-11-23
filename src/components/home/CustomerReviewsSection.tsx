
import {
  MessageSquareHeart,
  Quote,
} from "lucide-react";

import CustomerReviewCard from "./CustomerReviewCard";

import {
  customerReviews,
} from "@/data/customer-reviews";

export default function CustomerReviewsSection() {
  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      {/* Background Decoration */}

      <div className="pointer-events-none absolute -left-32 top-1/4 size-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-72 rounded-full bg-cta/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================
            Section Header
        =================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          {/* Badge */}

          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <MessageSquareHeart className="size-4" />
            Sample Customer Reviews
          </span>

          {/* Title */}

          <h2
            id="customer-reviews-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            What Our{" "}
            <span className="text-primary">
              Customers Say
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            See examples of how renters might describe
            their GearRento experience, from finding
            equipment to comparing rental options.
          </p>

        </div>

        {/* ===================================
            Customer Review Cards
        =================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

          {customerReviews.map((review) => (
            <CustomerReviewCard
              key={review.id}
              review={review}
            />
          ))}

        </div>

        {/* ===================================
            Bottom Decorative Text
        =================================== */}

        <div className="mt-12 flex items-center justify-center gap-3 text-center">

          <div className="h-px w-8 bg-border sm:w-16" />

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
            <Quote className="size-4 text-primary" />

            Customer experiences matter to us

          </div>

          <div className="h-px w-8 bg-border sm:w-16" />

        </div>

      </div>
    </section>
  );
}
