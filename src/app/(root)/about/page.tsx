
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  HeartHandshake,
  Layers3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// ========================================
// Page Metadata
// ========================================

export const metadata: Metadata = {
  title: "About Us | GearRento",
  description:
    "Learn about GearRento, an equipment rental marketplace connecting equipment owners and renters across Bangladesh.",
};

// Replace this route with your actual
// equipment-owner application route.
const OWNER_APPLICATION_PATH = "/become-owner";

// ========================================
// Reusable Types
// ========================================

interface ValueItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ImageContentSectionProps {
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  points: string[];
  reverse?: boolean;
}

// ========================================
// Core Values Data
// ========================================

const coreValues: ValueItem[] = [
  {
    title: "Accessibility",
    description:
      "We want useful equipment to be easier to find, without requiring everyone to purchase gear they only need temporarily.",
    icon: Layers3,
  },
  {
    title: "Transparency",
    description:
      "Equipment listings display important information such as daily rental prices, conditions, locations, and availability.",
    icon: CircleDollarSign,
  },
  {
    title: "Trust",
    description:
      "GearRento uses an administrative listing review process before equipment becomes visible to customers.",
    icon: ShieldCheck,
  },
  {
    title: "Community",
    description:
      "We bring equipment owners and renters together in a marketplace built around sharing resources and opportunities.",
    icon: HeartHandshake,
  },
];

// ========================================
// Reusable Section Badge
// ========================================

function SectionBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
      <Sparkles className="size-4" />
      {children}
    </span>
  );
}

// ========================================
// Reusable Value Card
// ========================================

function ValueCard({
  value,
}: {
  value: ValueItem;
}) {
  const Icon = value.icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-7" strokeWidth={1.8} />
      </div>

      <h3 className="relative mt-6 text-lg font-bold text-card-foreground">
        {value.title}
      </h3>

      <p className="relative mt-3 text-sm leading-7 text-muted-foreground">
        {value.description}
      </p>

      <div className="relative mt-6 h-1 w-10 rounded-full bg-cta transition-all duration-300 group-hover:w-20" />
    </div>
  );
}

// ========================================
// Reusable Image + Content Section
// ========================================

function ImageContentSection({
  badge,
  title,
  description,
  image,
  imageAlt,
  points,
  reverse = false,
}: ImageContentSectionProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

      {/* Image */}

      <div className={reverse ? "lg:order-2" : ""}>
        <div className="relative">

          <div className="absolute -inset-3 rounded-3xl bg-primary/5" />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-xl shadow-black/10 dark:shadow-black/20">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

        </div>
      </div>

      {/* Text Content */}

      <div className={reverse ? "lg:order-1" : ""}>
        <SectionBadge>{badge}</SectionBadge>

        <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>

        <p className="mt-5 text-sm leading-8 text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mt-7 space-y-4">
          {points.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

              <span className="text-sm leading-6 text-foreground/85">
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ========================================
// About Page
// ========================================

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">

      {/* =====================================
          1. Hero Section
      ===================================== */}

      <section
        aria-labelledby="about-heading"
        className="relative overflow-hidden"
      >
        <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">

          {/* Background Image */}

          <Image
            src="/about/About%20Us%20Hero.png"
            alt="A collaborative equipment rental workspace with cameras, tools, and outdoor gear"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Dark Overlay for readable text */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#061923]/95 via-[#061923]/75 to-[#061923]/25" />

          {/* Hero Content */}

          <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-4 py-16 sm:min-h-[520px] sm:px-6 lg:min-h-[580px] lg:px-8">

            <div className="max-w-2xl">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <Sparkles className="size-4 text-[#FFB547]" />
                Welcome to GearRento
              </span>

              <h1
                id="about-heading"
                className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Connecting People
                <span className="block text-[#FFB547]">
                  With Possibilities.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                GearRento connects equipment owners with
                people who need the right tools and gear.
                Our goal is to make equipment rental
                simpler, more accessible, and more
                convenient across Bangladesh.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/equipment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB547] px-6 py-3.5 text-sm font-bold text-[#17212B] transition hover:brightness-95"
                >
                  Explore Equipment
                  <ArrowRight className="size-4" />
                </Link>

                <a
                  href="#our-mission"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Learn Our Mission
                </a>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================
          2. Marketplace Highlights
      ===================================== */}

      <section
        aria-label="GearRento marketplace highlights"
        className="border-b border-border bg-card"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <Layers3 className="size-6" />
            </div>

            <div>
              <p className="text-xl font-bold text-foreground">
                14 Categories
              </p>
              <p className="text-xs text-muted-foreground">
                Different types of rental equipment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <MapPin className="size-6" />
            </div>

            <div>
              <p className="text-xl font-bold text-foreground">
                8 Divisions
              </p>
              <p className="text-xs text-muted-foreground">
                Location-based browsing across Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <BadgeCheck className="size-6" />
            </div>

            <div>
              <p className="text-xl font-bold text-foreground">
                Reviewed Listings
              </p>
              <p className="text-xs text-muted-foreground">
                Equipment listings require admin approval
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================
          3. Our Mission
      ===================================== */}

      <section
        id="our-mission"
        className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <ImageContentSection
            badge="Our Story & Mission"
            title="Making Equipment Rental Easier for Everyone"
            description="Not every project requires owning expensive equipment. Whether you are a photographer, student, contractor, event organizer, or outdoor enthusiast, GearRento aims to connect you with equipment owners who can provide the gear you need. We are building a marketplace where renting and sharing resources are more convenient."
            image="/about/Our%20Mission%20%26%20Story.png"
            imageAlt="An illustrative arrangement of photography, construction, camping, and event equipment"
            points={[
              "Make different types of equipment easier to discover.",
              "Help renters compare listings and daily rental prices.",
              "Provide equipment owners with opportunities to list their gear.",
              "Support a more resource-efficient rental experience.",
            ]}
          />

        </div>
      </section>

      {/* =====================================
          4. Our Core Values
      ===================================== */}

      <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}

          <div className="mx-auto mb-12 max-w-3xl text-center">

            <SectionBadge>What Drives Us</SectionBadge>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Core{" "}
              <span className="text-primary">
                Values
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              These principles guide how we want GearRento
              to serve renters, equipment owners, and
              the wider community.
            </p>

          </div>

          {/* Values Cards */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {coreValues.map((value) => (
              <ValueCard
                key={value.title}
                value={value}
              />
            ))}

          </div>

        </div>
      </section>

      {/* =====================================
          5. Quality and Trust
      ===================================== */}

      <section className="py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <ImageContentSection
            badge="Building Confidence"
            title="A More Transparent Way to Rent Equipment"
            description="GearRento provides equipment details, rental prices, locations, and availability information to help renters make informed choices. Before a listing appears publicly, it must pass through the platform's administrative approval process. Renters should still review the equipment details and rental terms before booking."
            image="/about/Quality%20%26%20Trust.png"
            imageAlt="Illustrative scene of an equipment owner handing camera gear to a renter"
            reverse
            points={[
              "Equipment listings are reviewed before publication.",
              "Browse information about condition, price, and location.",
              "Check inventory and date-specific availability during booking.",
              "Manage your rental activity through your account.",
            ]}
          />

        </div>
      </section>

      {/* =====================================
          6. Community & Vision
      ===================================== */}

      <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <ImageContentSection
            badge="Our Vision"
            title="Building a Community Around Sharing"
            description="We envision a marketplace where more people can access the tools and equipment they need, and where equipment owners can make better use of their existing resources. GearRento aims to connect opportunities across different industries and communities throughout Bangladesh."
            image="/about/Join%20Our%20Community.png"
            imageAlt="Illustrative group of people collaborating around cameras, tools, and outdoor rental gear"
            points={[
              "Connect equipment owners with potential renters.",
              "Support students, creators, businesses, and professionals.",
              "Encourage equipment sharing instead of unnecessary purchases.",
              "Make rental discovery accessible across Bangladesh.",
            ]}
          />

        </div>
      </section>

      {/* =====================================
          7. Who We Serve
      ===================================== */}

      <section className="py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <SectionBadge>Who We Serve</SectionBadge>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for Every{" "}
              <span className="text-primary">
                Kind of Project
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              From creative projects to professional work,
              GearRento supports different equipment needs.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Camera,
                title: "Creators & Students",
                text: "Explore cameras, lenses, audio gear, and equipment for photography, content creation, and academic projects.",
              },
              {
                icon: Wrench,
                title: "Builders & Professionals",
                text: "Discover power tools, construction equipment, and machinery for repairs, maintenance, and larger projects.",
              },
              {
                icon: UsersRound,
                title: "Events & Adventures",
                text: "Find event equipment, outdoor gear, and camping essentials for memorable experiences.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-card-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* =====================================
          8. Final CTA
      ===================================== */}

      <section className="pb-16 sm:pb-20 lg:pb-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-[#0B3341] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16">

            {/* Decorative Background */}

            <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border-45px border-white/5" />

            <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-[#22D3EE]/10 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#FFB547]">
                <PackageCheck className="size-4" />
                Join the GearRento Marketplace
              </span>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to Make Your{" "}
                <span className="text-[#FFB547]">
                  Next Project Happen?
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-200 sm:text-base">
                Whether you are looking for equipment or
                want to share your own gear with others,
                GearRento brings both sides of the
                rental marketplace together.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">

                {/* Rent Equipment */}

                <Link
                  href="/equipment"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB547] px-6 py-3.5 text-sm font-bold text-[#17212B] transition hover:brightness-95"
                >
                  Explore Equipment
                  <ArrowRight className="size-4" />
                </Link>

                {/* Become Equipment Owner */}

                <Link
                  href={OWNER_APPLICATION_PATH}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Become an Owner
                  <ArrowRight className="size-4" />
                </Link>

              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-300">

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#FFB547]" />
                  Flexible Rental Dates
                </span>

                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#FFB547]" />
                  Reviewed Listings
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
