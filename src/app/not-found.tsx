
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CircleHelp,
  Compass,
  Home,
  Search,
  Tent,
  Wrench,
} from "lucide-react";

// ========================================
// Quick Equipment Categories
// ========================================

const quickCategories = [
  {
    name: "Photography",
    icon: Camera,
    href: "/equipment?category=Photography",
  },
  {
    name: "Power Tools",
    icon: Wrench,
    href: "/equipment?category=Power%20Tools",
  },
  {
    name: "Camping",
    icon: Tent,
    href: "/equipment?category=Camping",
  },
];

// ========================================
// GearRento 404 Page
// ========================================

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 size-96 rounded-full bg-cta/10 blur-3xl" />

      {/* ====================================
          Header Branding
      ==================================== */}

      <header className="relative z-10 border-b border-border/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="GearRento Home"
          >
            <Image
              src="/GearRentoIcon.png"
              alt=""
              width={45}
              height={45}
              className="size-11 object-contain"
            />

            <span className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Gear
              <span className="text-primary">
                Rento
              </span>
            </span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:text-sm"
          >
            <CircleHelp className="size-4" />
            Need Help?
          </Link>

        </div>
      </header>

      {/* ====================================
          Main 404 Content
      ==================================== */}

      <section className="relative z-10 flex flex-1 items-center py-14 sm:py-20">

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

          {/* =================================
              Left: Error Message
          ================================= */}

          <div className="text-center lg:text-left">

            {/* Error Number */}

            <div className="relative inline-block">

              <span
                aria-hidden="true"
                className="block bg-linear-to-br from-primary via-primary to-primary/30 bg-clip-text text-[clamp(7rem,20vw,13rem)] font-black leading-none tracking-tighter text-transparent"
              >
                404
              </span>

              {/* Floating Icon */}

              <div className="absolute -right-5 top-2 flex size-12 rotate-12 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-lg sm:-right-8 sm:size-16">
                <Compass className="size-7 sm:size-9" />
              </div>

            </div>

            {/* Status Badge */}

            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                <Search className="size-4" />
                Page Not Found
              </span>
            </div>

            {/* Heading */}

            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Looks Like This Page
              <span className="mt-1 block text-primary">
                Is Out on Rent!
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base lg:mx-0">
              The page you are looking for may have been
              moved, removed, or entered incorrectly.
              Don&apos;t worry — there&apos;s still plenty
              of great equipment waiting for you at
              GearRento.
            </p>

            {/* Action Buttons */}

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">

              {/* Home Button */}

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg"
              >
                <Home className="size-4" />
                Back to Home
                <ArrowRight className="size-4" />
              </Link>

              {/* Equipment Button */}

              <Link
                href="/equipment"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary hover:bg-secondary hover:text-primary"
              >
                Browse Equipment
                <ArrowUpRight className="size-4" />
              </Link>

            </div>

          </div>

          {/* =================================
              Right: Helpful Actions Card
          ================================= */}

          <div className="relative">

            {/* Decorative Background */}

            <div className="absolute -inset-3 rounded-[2rem] bg-primary/5 blur-xl" />

            {/* Main Card */}

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-8">

              {/* Card Icon */}

              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Search className="size-7" />
              </div>

              {/* Card Heading */}

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-card-foreground">
                Looking for Equipment?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Try searching for what you need or explore
                one of our popular equipment categories.
              </p>

              {/* =================================
                  Search Form
              ================================= */}

              <form
                action="/equipment"
                method="get"
                role="search"
                className="mt-7"
              >
                <label
                  htmlFor="equipment-search-404"
                  className="mb-2 block text-sm font-semibold text-card-foreground"
                >
                  Search Equipment
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <div className="relative min-w-0 flex-1">

                    <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id="equipment-search-404"
                      type="search"
                      name="q"
                      placeholder="Camera, drill, generator..."
                      required
                      maxLength={100}
                      className="h-12 w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />

                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    Search
                    <ArrowRight className="size-4" />
                  </button>

                </div>
              </form>

              {/* =================================
                  Quick Categories
              ================================= */}

              <div className="mt-8 border-t border-border pt-6">

                <h3 className="text-sm font-bold text-card-foreground">
                  Explore Popular Categories
                </h3>

                <div className="mt-4 space-y-3">

                  {quickCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 transition-all duration-200 hover:border-primary/40 hover:bg-secondary"
                      >

                        <div className="flex items-center gap-3">

                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="size-5" />
                          </span>

                          <span className="text-sm font-semibold text-foreground">
                            {category.name}
                          </span>

                        </div>

                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />

                      </Link>
                    );
                  })}

                </div>

              </div>

              {/* Help Footer */}

              <div className="mt-7 rounded-xl bg-secondary/70 p-4">

                <div className="flex items-start gap-3">

                  <CircleHelp className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>

                    <h3 className="text-sm font-bold text-foreground">
                      Still Need Assistance?
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Visit our contact page for rental
                      questions and general support.
                    </p>

                    <Link
                      href="/contact"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      Contact Us
                      <ArrowRight className="size-3.5" />
                    </Link>

                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ====================================
          Bottom Footer
      ==================================== */}

      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GearRento.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              href="/about"
              className="text-xs text-muted-foreground transition hover:text-primary"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="text-xs text-muted-foreground transition hover:text-primary"
            >
              Contact
            </Link>

            <Link
              href="/equipment"
              className="text-xs text-muted-foreground transition hover:text-primary"
            >
              Equipment
            </Link>

          </div>

        </div>
      </footer>

    </main>
  );
}
