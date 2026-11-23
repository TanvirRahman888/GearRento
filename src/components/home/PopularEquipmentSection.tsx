
import FEquipmentCarousel from "@/components/equipment/FEquipmentCarousel";

import { getHomeEquipment } from "@/lib/home-equipment";

import { Flame, Sparkles } from "lucide-react";

export default async function PopularEquipmentSection() {
  // Get combined featured and top-priced products
  const popularProducts = await getHomeEquipment();

  return (
    <section
      aria-labelledby="popular-equipment-heading"
      className="bg-background py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ====================================
            Main Section Header
        ==================================== */}

        <div className="mb-10 text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <Flame className="size-4" />
            Discover Popular Rentals
          </span>

          <h2
            id="popular-equipment-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Popular{" "}
            <span className="text-primary">
              Equipment
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Explore featured and premium rental equipment
            from trusted owners. Find the perfect gear for
            your next project at GearRento.
          </p>

        </div>

        {/* ====================================
            Single Combined Equipment Slider
        ==================================== */}

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="size-3.5" />
            Featured & Premium Picks
          </div>

          <FEquipmentCarousel
            title="Explore Popular Equipment"
            description="Discover featured listings and top-priced rental equipment, all in one place."
            products={popularProducts}
            viewAllHref="/equipment"
            emptyMessage="No popular equipment is available right now."
          />
        </div>

      </div>
    </section>
  );
}
