
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type {
  EquipmentCategory,
} from "@/data/equipment-categories";

// ======================================
// Category Card Props
// ======================================

interface CategoryCardProps {
  category: EquipmentCategory;
}

// ======================================
// Category Card Component
// ======================================

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={{
        pathname: "/equipment",
        query: {
          category: category.name,
        },
      }}
      aria-label={`Browse ${category.name} equipment`}
      className="
        group relative
        flex h-full min-h-50px
        flex-col overflow-hidden
        rounded-2xl
        border border-border
        bg-card p-4
        shadow-sm
        transition-[border-color,box-shadow,background-color]
        duration-300 ease-out
        hover:border-primary/40
        hover:shadow-lg
        hover:shadow-primary/5
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-ring
        sm:p-5
      "
    >
      {/* ==================================
          BACKGROUND DECORATION
      ================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-8 -top-8
          size-24 rounded-full
          bg-primary/5
          transition-all duration-500
          ease-out
          group-hover:scale-150
          group-hover:bg-primary/10
          motion-reduce:transition-none
        "
      />

      {/* Subtle Background Glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          bg-linear-to-br
          from-primary/5
          via-transparent
          to-transparent
          opacity-0
          transition-opacity duration-500
          group-hover:opacity-100
          group-focus-visible:opacity-100
          motion-reduce:transition-none
        "
      />

      {/* ==================================
          ICON AND ARROW SECTION
      ================================== */}

      <div className="relative z-10 flex items-start justify-between gap-2">
        {/* Category Icon */}

        <div
          className="
            flex size-12 shrink-0
            items-center justify-center
            rounded-2xl
            bg-secondary text-primary
            transition-all duration-300
            ease-out
            group-hover:scale-105
            group-hover:-rotate-3
            group-hover:bg-primary
            group-hover:text-primary-foreground
            group-hover:shadow-md
            group-hover:shadow-primary/20
            group-focus-visible:bg-primary
            group-focus-visible:text-primary-foreground
            motion-reduce:transform-none
            motion-reduce:transition-none
            sm:size-14
          "
        >
          <Icon
            className="
              size-6
              transition-transform duration-300
              group-hover:scale-110
              motion-reduce:transform-none
              motion-reduce:transition-none
              sm:size-7
            "
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {/* Animated Arrow */}

        <div
          aria-hidden="true"
          className="
            flex size-8 shrink-0
            items-center justify-center
            rounded-full
            text-muted-foreground/60
            transition-all duration-300
            ease-out
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:bg-primary/10
            group-hover:text-primary
            group-focus-visible:bg-primary/10
            group-focus-visible:text-primary
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          <ArrowUpRight className="size-4" />
        </div>
      </div>

      {/* ==================================
          CATEGORY INFORMATION
      ================================== */}

      <div className="relative z-10 mt-5 flex flex-1 flex-col">
        {/* Category Name */}

        <h3
          className="
            text-sm font-bold leading-5
            text-card-foreground
            transition-colors duration-300
            group-hover:text-primary
            group-focus-visible:text-primary
            motion-reduce:transition-none
            sm:text-base
          "
        >
          {category.name}
        </h3>

        {/* Category Description */}

        <p
          className="
            mt-2 text-xs leading-5
            text-muted-foreground
          "
        >
          {category.description}
        </p>
      </div>

      {/* ==================================
          BOTTOM ANIMATED INDICATOR
      ================================== */}

      <div className="relative z-10 mt-5 pt-1">
        {/* Indicator Track */}

        <div
          aria-hidden="true"
          className="
            h-1 w-8
            overflow-hidden
            rounded-full
            bg-border
            transition-all duration-500
            ease-out
            group-hover:w-14
            group-hover:bg-primary/20
            group-focus-visible:w-14
            motion-reduce:transition-none
          "
        >
          {/* Animated Indicator Fill */}

          <div
            className="
              h-full w-0
              rounded-full
              bg-cta
              transition-all duration-500
              ease-out
              group-hover:w-full
              group-focus-visible:w-full
              motion-reduce:transition-none
            "
          />
        </div>
      </div>
    </Link>
  );
}
