
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type {
  EquipmentCategory,
} from "@/data/equipment-categories";

interface CategoryCardProps {
  category: EquipmentCategory;
}

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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
    >
      {/* Decorative Background */}

      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/10" />

      {/* Icon and Arrow */}

      <div className="relative flex items-start justify-between gap-2">

        <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:size-14">
          <Icon
            className="size-6 sm:size-7"
            strokeWidth={1.8}
          />
        </div>

        <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />

      </div>

      {/* Category Details */}

      <div className="relative mt-5 flex flex-1 flex-col">
        <h3 className="text-sm font-bold leading-5 text-card-foreground transition-colors group-hover:text-primary sm:text-base">
          {category.name}
        </h3>

        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {category.description}
        </p>
      </div>

      {/* Bottom Indicator */}

      <div className="relative mt-5 h-1 w-8 rounded-full bg-border transition-all duration-300 group-hover:w-14 group-hover:bg-cta" />

    </Link>
  );
}
