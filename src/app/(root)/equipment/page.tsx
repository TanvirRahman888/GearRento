import type { Metadata } from "next";

import {
  getApprovedEquipment,
  parseEquipmentFilters,
  buildEquipmentQuery,
  type EquipmentSearchParams,
} from "@/lib/equipment";

import { EquipmentFiltersPanel } from "@/components/equipment/equipment-filters";
import { EquipmentResults } from "@/components/equipment/equipment-results";

export const metadata: Metadata = {
  title: "All Equipment | GearRento",
  description: "Browse approved rental equipment on GearRento.",
};

type PageProps = {
  searchParams: Promise<EquipmentSearchParams>;
};

// =====================================
// Public Equipment Server Component
// =====================================

export default async function AllEquipmentPage({ searchParams }: PageProps) {
  // Read search filters from URL
  const params = await searchParams;

  const filters = parseEquipmentFilters(params);

  // Fetch approved equipment on the server
  const { data, error } = await getApprovedEquipment(filters);

  return (
    <section className="min-h-svh bg-background">
      {/* Page Header */}
      <header className="border-b border-border bg-card">
        <div className=" container mx-auto  px-4 py-10 sm:px-6 lg:py-12">
          <p className="mb-2 text-sm font-semibold text-primary">
            GearRento Marketplace
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Equipment for Rent
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Explore approved rental equipment from GearRento Product Owners.
          </p>
        </div>
      </header>

      {/* Filter and Results Layout */}
      <div className=" container mx-auto px-4 py-7 sm:px-6 lg:py-9">
        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <EquipmentFiltersPanel
            key={buildEquipmentQuery(filters)}
            filters={filters}
          />

          <EquipmentResults data={data} error={error} filters={filters} />
        </div>
      </div>
    </section>
  );
}
