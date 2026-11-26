
import {
  Clock3,
} from "lucide-react";

import FEquipmentCarousel from "@/components/equipment/FEquipmentCarousel";

import { getRecentlyAddedEquipment } from "@/lib/recent-equipment";

// ========================================
// Recently Added Equipment Section
// ========================================

export default async function RecentlyAddedSection() {
  const recentProducts =
    await getRecentlyAddedEquipment();

  return (
    <section
      aria-label="Recently added rental equipment"
      className="relative overflow-hidden bg-background py-14 sm:py-20"
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute -left-32 top-0 size-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 size-72 rounded-full bg-cta/5 blur-3xl" />

      {/* Container */}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Badge */}

        <div className="mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">

            <Clock3 className="size-4" />

            Freshly Listed Equipment

          </span>
        </div>

        {/* ====================================
            Reusable Equipment Carousel
        ==================================== */}

        <FEquipmentCarousel
          title="Recently Added Equipment"
          description="Discover the latest equipment listings on GearRento. Explore new rental options and find the right tools and gear for your next project."
          products={recentProducts}
          viewAllHref="/equipment?sort=newest"
          emptyMessage="No recently added equipment is available right now."
        />

      </div>
    </section>
  );
}
