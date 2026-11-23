import { Quote, Star, MapPin } from "lucide-react";

import type { CustomerReview } from "@/data/customer-reviews";

interface CustomerReviewCardProps {
  review: CustomerReview;
}

export default function CustomerReviewCard({
  review,
}: CustomerReviewCardProps) {
  const rating = Math.max(0, Math.min(5, Math.round(review.rating)));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:shadow-black/10 sm:p-7">
      {/* Decorative Quote */}

      <Quote
        className="absolute right-6 top-6 size-12 text-primary/10 transition-colors group-hover:text-primary/20"
        aria-hidden="true"
      />

      {/* ===================================
          Customer Rating
      =================================== */}

      <div
        className="relative flex items-center gap-1"
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`size-4.5 ${
              index < rating
                ? "fill-cta text-cta"
                : "fill-muted text-muted-foreground/20"
            }`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* ===================================
          Review Comment
      =================================== */}

      <blockquote className="relative mt-5 flex-1">
        <p className="text-sm leading-7 text-card-foreground/85">
          &ldquo;{review.comment}&rdquo;
        </p>
      </blockquote>

      {/* ===================================
          Customer Information
      =================================== */}

      <div className="mt-7 border-t border-border pt-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}

          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground ring-2 ring-primary/10">
            {review.initials}
          </div>

          {/* Customer Name and Location */}

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-card-foreground">
              {review.name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />

              <span className="truncate">{review.location}</span>
            </div>
          </div>

          {/* Rating Number */}

          <div className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold text-secondary-foreground">
            {rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-cta transition-all duration-300 group-hover:w-full" />
    </article>
  );
}
