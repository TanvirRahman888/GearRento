
import Link from "next/link";

import {
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

import CategoryCard from "@/components/equipment/CategoryCard";

import {
  equipmentCategories,
} from "@/data/equipment-categories";

export default function CategorySection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-background py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================
            Section Heading
        =================================== */}

        <div className="mb-9 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">

            {/* Badge */}

            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <LayoutGrid className="size-4" />
              Explore Our Categories
            </span>

            {/* Heading */}

            <h2
              id="categories-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              Browse by{" "}
              <span className="text-primary">
                Category
              </span>
            </h2>

            {/* Description */}

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Explore a wide range of rental equipment.
              Find the right tools, technology, and gear
              for your next project.
            </p>

          </div>

          {/* View All Button */}

          <Link
            href="/equipment"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary hover:bg-secondary hover:text-primary"
          >
            View All Equipment
            <ArrowRight className="size-4" />
          </Link>

        </div>

        {/* ===================================
            Categories Grid
        =================================== */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7">
          {equipmentCategories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
            />
          ))}
        </div>

        {/* Bottom Link */}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Looking for something specific?{" "}
            <Link
              href="/equipment"
              className="inline-flex items-center gap-1 font-semibold text-primary transition hover:underline"
            >
              Explore all equipment
              <ArrowRight className="size-4" />
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
