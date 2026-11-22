import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { type EquipmentResponse, type EquipmentFilters } from "@/lib/equipment";

import { EquipmentCard } from "./equipment-card";
import { EquipmentPagination } from "./equipment-pagination";

type Props = {
  data: EquipmentResponse | null;
  error: string;
  filters: EquipmentFilters;
};

export function EquipmentResults({ data, error, filters }: Props) {
  const equipment = data?.equipment ?? [];

  return (
    <section className="min-w-0">
      {/* Results Heading */}
      <div className="mb-5">
        <h2 className="text-xl font-bold">Available Equipment</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {data
            ? `${data.pagination.total} listings found`
            : "Explore rental listings"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-8"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Equipment
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && data && equipment.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <PackageSearch size={44} className="mx-auto text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">No Equipment Found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try changing your filters or search terms.
          </p>

          <Link
            href="/equipment"
            className="mt-5 inline-flex rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground"
          >
            Clear Filters
          </Link>
        </div>
      )}

      {/* Equipment Grid */}
      {!error && equipment.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!error && data && (
        <EquipmentPagination pagination={data.pagination} filters={filters} />
      )}
    </section>
  );
}
