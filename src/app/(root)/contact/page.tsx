
import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeHelp,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";

// ========================================
// Page Metadata
// ========================================

export const metadata: Metadata = {
  title: "Contact Us | GearRento",
  description:
    "Get in touch with GearRento for equipment rental inquiries, bookings, equipment listings, and general support.",
};

// ========================================
// Contact Information
// ========================================

// IMPORTANT:
// Replace this example address with a real,
// verified contact email before deployment.

const CONTACT_EMAIL = "support@gearrento.com";

// ========================================
// Help Cards
// ========================================

const helpLinks = [
  {
    title: "Browse Equipment",
    description:
      "Explore available equipment and discover the right gear for your project.",
    icon: PackageSearch,
    href: "/equipment",
    action: "Explore Equipment",
  },
  {
    title: "Manage Your Bookings",
    description:
      "Check rental bookings and review your rental activity.",
    icon: CircleHelp,
    href: "/dashboard/my-bookings",
    action: "My Bookings",
  },
  {
    title: "Learn About GearRento",
    description:
      "Discover our mission, marketplace, and how equipment rental works.",
    icon: BadgeHelp,
    href: "/about",
    action: "About Us",
  },
];

// ========================================
// Contact Page
// ========================================

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">

      {/* =====================================
          1. Intro / Hero
      ===================================== */}

      <section className="relative isolate overflow-hidden border-b border-border bg-linear-to-br from-secondary/70 via-background to-background py-14 sm:py-20 lg:py-24">

        {/* Decorations */}

        <div className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-36 -right-24 size-80 rounded-full bg-cta/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <nav
            aria-label="Breadcrumb"
            className="mb-9 flex items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="text-muted-foreground transition hover:text-primary"
            >
              Home
            </Link>

            <ChevronRight className="size-4 text-muted-foreground" />

            <span
              aria-current="page"
              className="font-semibold text-primary"
            >
              Contact Us
            </span>
          </nav>

          {/* Page Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              <Sparkles className="size-4" />
              Get in Touch
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              We&apos;re Here to{" "}
              <span className="text-primary">
                Help You
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-lg">
              Have a question about renting equipment,
              managing bookings, or listing your own gear?
              Get in touch with GearRento and let us know
              how we can help.
            </p>

          </div>
        </div>
      </section>

      {/* =====================================
          2. Contact Details + Form
      ===================================== */}

      <section className="relative py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">

            {/* =================================
                Left Side
            ================================= */}

            <div className="lg:col-span-5">

              {/* Section Badge */}

              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <MessageCircle className="size-4" />
                Contact Information
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                Let&apos;s Start a{" "}
                <span className="text-primary">
                  Conversation.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base">
                Whether you&apos;re a customer looking
                for equipment or an owner interested in
                sharing your gear, your questions matter
                to us.
              </p>

              {/* ==============================
                  Contact Cards
              ============================== */}

              <div className="mt-9 space-y-4">

                {/* Email */}

                <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Mail className="size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-card-foreground">
                      Email Us
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Send your rental or marketplace
                      questions by email.
                    </p>

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-semibold text-primary hover:underline"
                    >
                      {CONTACT_EMAIL}
                      <ArrowUpRight className="size-4 shrink-0" />
                    </a>
                  </div>

                </div>

                {/* Location */}

                <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <MapPin className="size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-card-foreground">
                      Our Marketplace
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Browse rental listings across
                      Bangladesh&apos;s eight divisions,
                      based on equipment availability.
                    </p>

                    <p className="mt-2 text-sm font-semibold text-primary">
                      Bangladesh
                    </p>
                  </div>

                </div>

                {/* Support */}

                <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Headphones className="size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-card-foreground">
                      Rental & Booking Help
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Need information about equipment
                      details, rental dates, or bookings?
                      Include the relevant details in
                      your message.
                    </p>
                  </div>

                </div>

              </div>

              {/* ==============================
                  Bottom Information
              ============================== */}

              <div className="mt-6 rounded-2xl border border-primary/15 bg-secondary/60 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                    <ShieldCheck className="size-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      A Better Rental Experience
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      GearRento is designed to connect
                      equipment owners and renters through
                      clear listings, rental information,
                      and convenient booking features.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* =================================
                Right Side - Contact Form
            ================================= */}

            <div className="lg:col-span-7">

              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-xl shadow-black/5 dark:shadow-black/20 sm:p-8 lg:p-10">

                {/* Decoration */}

                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />

                {/* Form Header */}

                <div className="relative mb-8">

                  <div className="mb-5 flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <MessageCircle className="size-6" />
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                    Send Us a Message
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Fill out the form below to prepare
                    your inquiry. Your email application
                    will open with the message ready
                    for you to send.
                  </p>

                </div>

                {/* Contact Form */}

                <div className="relative">
                  <ContactForm
                    contactEmail={CONTACT_EMAIL}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          3. Quick Help Section
      ===================================== */}

      <section className="border-t border-border bg-muted/35 py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              <BadgeHelp className="size-4" />
              Quick Help
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Find What You{" "}
              <span className="text-primary">
                Need
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Explore helpful pages before sending an
              inquiry. You might find exactly what
              you&apos;re looking for.
            </p>

          </div>

          {/* Quick Help Cards */}

          <div className="grid gap-5 md:grid-cols-3">

            {helpLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >

                  <div className="flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-card-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                    {item.action}

                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>
      </section>

      {/* =====================================
          4. Bottom CTA
      ===================================== */}

      <section className="bg-background py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-[#0B3341] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">

            {/* Decoration */}

            <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border-35px border-white/5" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 size-64 rounded-full bg-[#22D3EE]/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB547]">
                  <CheckCircle2 className="size-4" />
                  Start Your Rental Journey
                </span>

                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to Find the Right Equipment?
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Explore equipment for creative projects,
                  construction, outdoor adventures, events,
                  and more on GearRento.
                </p>

              </div>

              <Link
                href="/equipment"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFB547] px-6 py-3.5 text-sm font-bold text-[#17212B] transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Browse Equipment

                <ArrowRight className="size-4" />
              </Link>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
