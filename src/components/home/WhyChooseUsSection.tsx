
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Layers3,
  MapPinned,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// ========================================
// Why Choose Us Benefits
// ========================================

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Trusted Equipment Listings",
    description:
      "Explore admin-reviewed equipment listings from rental owners, all organized in one convenient marketplace.",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Wide Equipment Selection",
    description:
      "Discover cameras, power tools, construction machinery, camping gear, and much more across 14 categories.",
    icon: Layers3,
  },
  {
    id: 3,
    title: "Flexible Rental Periods",
    description:
      "Choose equipment based on your project schedule and book it for the dates that work best for you.",
    icon: CalendarDays,
  },
  {
    id: 4,
    title: "Transparent Daily Pricing",
    description:
      "Compare rental rates before booking and find equipment that fits your needs and budget.",
    icon: Wallet,
  },
  {
    id: 5,
    title: "Equipment Near You",
    description:
      "Browse available equipment by Bangladesh division to find rental options in your preferred location.",
    icon: MapPinned,
  },
  {
    id: 6,
    title: "Simple Booking Experience",
    description:
      "Explore listings, review equipment details, and manage your rental bookings through one platform.",
    icon: ClipboardCheck,
  },
];

// ========================================
// Reusable Benefit Card
// ========================================

function BenefitCard({
  benefit,
}: {
  benefit: Benefit;
}) {
  const Icon = benefit.icon;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:shadow-black/10 sm:p-7">

      {/* Decorative Circle */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

      {/* Icon and Number */}
      <div className="relative flex items-start justify-between">

        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
          <Icon
            className="size-7"
            strokeWidth={1.8}
          />
        </div>

        <span className="text-3xl font-bold text-primary/10 transition-colors group-hover:text-primary/20">
          {String(benefit.id).padStart(2, "0")}
        </span>

      </div>

      {/* Content */}
      <div className="relative mt-6 flex flex-1 flex-col">

        <h3 className="text-lg font-bold tracking-tight text-card-foreground transition-colors group-hover:text-primary">
          {benefit.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {benefit.description}
        </p>

      </div>

      {/* Bottom Decoration */}
      <div className="relative mt-6 flex items-center justify-between">

        <div className="h-1 w-10 rounded-full bg-cta transition-all duration-300 group-hover:w-20" />

        <ArrowUpRight className="size-5 -translate-x-1 translate-y-1 text-primary/30 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />

      </div>

    </div>
  );
}

// ========================================
// Why Choose Us Section
// ========================================

export default function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-80 rounded-full bg-cta/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ====================================
            Section Heading
        ==================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">

          {/* Section Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
            <BadgeCheck className="size-4" />
            The GearRento Advantage
          </span>

          {/* Heading */}
          <h2
            id="why-choose-us-heading"
            className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Why Choose{" "}
            <span className="text-primary">
              GearRento?
            </span>
          </h2>

          {/* Short Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Renting equipment should be simple, convenient,
            and flexible. GearRento brings equipment owners
            and renters together to make finding the right
            gear easier than ever.
          </p>

        </div>

        {/* ====================================
            Benefits Grid
        ==================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">

          {benefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
            />
          ))}

        </div>

        {/* ====================================
            Bottom Call to Action
        ==================================== */}

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/10 bg-secondary p-6 sm:mt-16 sm:p-10">

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border-30px border-primary/5" />

          <div className="pointer-events-none absolute -bottom-24 right-1/4 size-48 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">

            {/* CTA Text */}
            <div className="max-w-2xl">

              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <BadgeCheck className="size-4" />
                Ready to Get Started?
              </span>

              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Find the Right Gear for{" "}
                <span className="text-primary">
                  Your Next Project.
                </span>
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                From small everyday tasks to big projects,
                explore equipment listings and start planning
                your next rental with GearRento.
              </p>

            </div>

            {/* CTA Button */}
            <Link
              href="/equipment"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg"
            >
              Explore Equipment
              <ArrowRight className="size-5" />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
