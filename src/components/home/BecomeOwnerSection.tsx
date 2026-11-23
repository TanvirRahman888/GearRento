
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  ClipboardList,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundPlus,
} from "lucide-react";

import OwnerStepCard, {
  type OwnerStep,
} from "./OwnerStepCard";

// ========================================
// Owner Onboarding Steps
// ========================================

const ownerSteps: OwnerStep[] = [
  {
    number: "01",
    title: "Apply to Become an Owner",
    description:
      "Create your account and submit an owner request to start your rental journey.",
    icon: UserRoundPlus,
  },
  {
    number: "02",
    title: "List Your Equipment",
    description:
      "After approval, add equipment photos, descriptions, daily rental prices, and availability.",
    icon: PackagePlus,
  },
  {
    number: "03",
    title: "Manage Your Rentals",
    description:
      "Once your listings are approved, customers can discover them and you can manage rental activity.",
    icon: ClipboardList,
  },
];

// ========================================
// Section Props
// ========================================

interface BecomeOwnerSectionProps {
  applyHref?: string;
}

// ========================================
// Become an Owner Section
// ========================================

export default function BecomeOwnerSection({
  applyHref = "/register",
}: BecomeOwnerSectionProps) {
  return (
    <section
      aria-labelledby="become-owner-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-80 rounded-full bg-cta/5 blur-3xl" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ====================================
              Left: Promotional Content
          ==================================== */}

          <div>

            {/* Section Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <Sparkles className="size-4" />
              For Equipment Owners
            </span>

            {/* Heading */}
            <h2
              id="become-owner-heading"
              className="mt-6 max-w-xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Your Equipment.{" "}
              <span className="text-primary">
                New Earning Opportunities.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              Have equipment sitting unused? Join GearRento
              as an equipment owner and connect with people
              looking to rent cameras, tools, machinery,
              event equipment, and more.
            </p>

            {/* ====================================
                Owner Benefits
            ==================================== */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {/* Benefit 1 */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <CircleDollarSign className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Earning Potential
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Offer equipment for rent and create an
                    additional income opportunity.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <TrendingUp className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Reach More Renters
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Showcase your equipment to potential
                    customers on GearRento.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <ClipboardList className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Manage Listings
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Organize equipment details, pricing,
                    and rental availability.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Reviewed Listings
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Equipment listings go through an
                    admin approval process.
                  </p>
                </div>
              </div>

            </div>

            {/* ====================================
                CTA Buttons
            ==================================== */}

            <div className="mt-9 flex flex-wrap items-center gap-4">

              {/* Primary CTA */}
              <Link
                href={applyHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg"
              >
                Become an Owner
                <ArrowRight className="size-4" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/equipment"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary hover:bg-secondary hover:text-primary"
              >
                Explore Marketplace
                <ArrowRight className="size-4" />
              </Link>

            </div>

            {/* Small Trust Note */}
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <BadgeCheck className="size-4 shrink-0 text-primary" />
              Owner applications and equipment listings
              are subject to approval.
            </div>

          </div>

          {/* ====================================
              Right: How It Works Panel
          ==================================== */}

          <div className="relative">

            {/* Main Panel */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary/50 p-5 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-7 lg:p-8">

              {/* Decorative Shapes */}
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border-35 border-primary/5" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-primary/5 blur-3xl" />

              {/* Panel Header */}
              <div className="relative mb-7">

                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <BadgeCheck className="size-4" />
                  Simple Onboarding
                </span>

                <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Start in 3 Steps
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  From registering as an owner to sharing
                  your equipment with potential renters.
                </p>

              </div>

              {/* Onboarding Steps */}
              <div className="relative space-y-4">
                {ownerSteps.map((step) => (
                  <OwnerStepCard
                    key={step.number}
                    step={step}
                  />
                ))}
              </div>

              {/* Bottom Note */}
              <div className="relative mt-6 flex items-start gap-3 rounded-xl border border-primary/10 bg-card/80 p-4">

                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <BadgeCheck className="size-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-card-foreground">
                    You are in Control
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Set rental prices, manage equipment
                    information, and update availability
                    through your owner dashboard.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ====================================
            Bottom Promotional Banner
        ==================================== */}

        <div className="relative mt-14 overflow-hidden rounded-2xl border border-primary/10 bg-secondary px-6 py-6 sm:mt-16 sm:px-8 lg:px-10">

          <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

            <div className="flex items-start gap-4">

              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                <PackagePlus className="size-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Have equipment ready to rent?
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Apply to become a GearRento equipment
                  owner and explore new opportunities.
                </p>
              </div>

            </div>

            <Link
              href={applyHref}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
