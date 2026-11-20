import Link from "next/link";

import {
  ArrowRight,
  Search,
  CalendarCheck,
  PackageCheck,
  Images,
  Package,
} from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      {/* Hero Section */}
      <section className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">

        {/* Left Content */}
        <div>
          <p className="mb-5 inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            Your Equipment Rental Marketplace
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Rent Smarter.
            <br />
            <span className="text-primary">Build Bigger.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            Discover and rent quality equipment from trusted
            owners. Simple booking, flexible rental periods,
            and reliable service.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 rounded-lg bg-cta px-6 py-3 font-semibold text-cta-foreground hover:bg-cta/90"
            >
              Explore Equipment
              <ArrowRight size={18} />
            </Link>

            <Link
              href="#how-it-works"
              className="rounded-lg border border-border bg-card px-6 py-3 font-medium hover:bg-accent"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Temporary Hero Preview */}
        <div className="grid gap-4 sm:grid-cols-5">
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 text-center sm:col-span-3">
            <Images size={40} className="text-primary" />

            <h2 className="font-semibold">
              Banner Slider
            </h2>

            <p className="text-sm text-muted-foreground">
              5 admin-managed banners
            </p>
          </div>

          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-secondary p-6 text-center sm:col-span-2">
            <Package size={40} className="text-primary" />

            <h2 className="font-semibold">
              Featured Equipment
            </h2>

            <p className="text-sm text-muted-foreground">
              Products from our API
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>
      <section
        id="how-it-works"
        className="scroll-mt-24 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            How GearRento Works
          </h2>

          <p className="mt-3 text-muted-foreground">
            Rent equipment in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border bg-card p-6">
            <Search className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Find Equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse equipment and find exactly what you need.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Book Online
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select your rental dates and complete your booking.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <PackageCheck className="mb-4 text-primary" size={32} />

            <h3 className="text-lg font-semibold">
              Use & Return
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Use your rented equipment and return it when done.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}