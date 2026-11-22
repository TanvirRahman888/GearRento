
import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  buildEquipmentQuery,
  type EquipmentFilters,
  type EquipmentPagination as PaginationType,
} from "@/lib/equipment";

type Props = {
  pagination: PaginationType;
  filters: EquipmentFilters;
};

export function EquipmentPagination({
  pagination,
  filters,
}: Props) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages } = pagination;

  const previousHref = `/equipment?${buildEquipmentQuery(
    filters,
    page - 1
  )}`;

  const nextHref = `/equipment?${buildEquipmentQuery(
    filters,
    page + 1
  )}`;

  const buttonClass =
    "inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent";

  return (
    <nav
      aria-label="Equipment pagination"
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={previousHref}
            className={buttonClass}
          >
            <ChevronLeft size={17} />
            Previous
          </Link>
        ) : (
          <span className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground/50">
            Previous
          </span>
        )}

        {page < totalPages ? (
          <Link
            href={nextHref}
            className={buttonClass}
          >
            Next
            <ChevronRight size={17} />
          </Link>
        ) : (
          <span className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground/50">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
