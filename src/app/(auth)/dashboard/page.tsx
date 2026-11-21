
import Link from "next/link";
import Image from "next/image";

import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import {
  LayoutDashboard,
  ArrowUpRight,
  Users,
  ShieldCheck,
  Package,
  PackagePlus,
  ClipboardList,
  ChartNoAxesCombined,
  CalendarDays,
  Wallet,
  ShoppingBag,
  Heart,
  CreditCard,
  UserRound,
  House,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";

// ==================================
// Dashboard types
// ==================================

type Role = "admin" | "owner" | "customer";

type DashboardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type DashboardConfig = {
  label: string;
  title: string;
  description: string;
  items: DashboardItem[];
};

// ==================================
// Dashboard content for each role
// ==================================

const dashboardConfig: Record<Role, DashboardConfig> = {
  admin: {
    label: "Administrator",
    title: "Admin Dashboard",
    description:
      "Manage GearRento users, equipment approvals, and platform activities.",
    items: [
      {
        title: "Manage Users",
        description: "View and manage platform users.",
        icon: Users,
      },
      {
        title: "Equipment Approvals",
        description: "Review equipment listings.",
        icon: ShieldCheck,
      },
      {
        title: "All Equipment",
        description: "Manage equipment across the platform.",
        icon: Package,
      },
      {
        title: "All Rentals",
        description: "Monitor rental bookings.",
        icon: ClipboardList,
      },
      {
        title: "Platform Analytics",
        description: "Review marketplace performance.",
        icon: ChartNoAxesCombined,
      },
    ],
  },

  owner: {
    label: "Product Owner",
    title: "Owner Dashboard",
    description:
      "Manage your equipment, rental requests, and earnings.",
    items: [
      {
        title: "Add Equipment",
        description: "Create a new equipment listing.",
        icon: PackagePlus,
      },
      {
        title: "My Equipment",
        description: "Manage your equipment listings.",
        icon: Package,
      },
      {
        title: "Rental Requests",
        description: "Review customer rental requests.",
        icon: ClipboardList,
      },
      {
        title: "Availability",
        description: "Manage equipment rental dates.",
        icon: CalendarDays,
      },
      {
        title: "My Earnings",
        description: "View your rental earnings.",
        icon: Wallet,
      },
    ],
  },

  customer: {
    label: "Customer",
    title: "Customer Dashboard",
    description:
      "Manage your bookings and explore equipment for rent.",
    items: [
      {
        title: "My Bookings",
        description: "View your equipment bookings.",
        icon: ShoppingBag,
      },
      {
        title: "Rental History",
        description: "Review your previous rentals.",
        icon: ClipboardList,
      },
      {
        title: "Saved Equipment",
        description: "View equipment saved for later.",
        icon: Heart,
      },
      {
        title: "My Payments",
        description: "Check payment information.",
        icon: CreditCard,
      },
    ],
  },
};

// ==================================
// Protected Server Component
// ==================================

export default async function DashboardPage() {
  // Check the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Unauthenticated user
  if (!session?.user) {
    redirect("/login?next=%2Fdashboard");
  }

  const user = session.user;
  const role = user.role;

  // Only supported roles may access dashboard
  if (
    role !== "admin" &&
    role !== "owner" &&
    role !== "customer"
  ) {
    notFound();
  }

  // Select the dashboard from the stored role
  const dashboard = dashboardConfig[role];

  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-primary">
            GearRento Workspace
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {dashboard.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back, {user.name}.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">

          {/* ==========================
              SIDEBAR
          ========================== */}

          <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">

            {/* User Information */}
            <div className="flex items-center gap-3 border-b border-border px-2 py-4">
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="48px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <UserRound size={24} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="px-2 pt-4">
              <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {dashboard.label}
              </span>
            </div>

            {/* General Links */}
            <nav className="mt-6 space-y-1">
              <Link
                href="/dashboard"
                aria-current="page"
                className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-3 text-sm font-semibold text-secondary-foreground"
              >
                <LayoutDashboard size={18} />
                Overview
              </Link>

              <Link
                href="/equipment"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
              >
                <Package size={18} />
                All Equipment
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
              >
                <House size={18} />
                Home
              </Link>
            </nav>

            {/* Role-Specific Tools */}
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {dashboard.label} Tools
              </p>

              <div className="space-y-1">
                {dashboard.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon
                          size={17}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {item.title}
                        </span>
                      </div>

                      <span className="text-[10px]">
                        Soon
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ==========================
              MAIN CONTENT
          ========================== */}

          <main className="min-w-0 space-y-8">

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0E7490] p-6 text-white sm:p-9 dark:bg-[#164552]">

              <div className="relative z-10 max-w-xl">
                <p className="text-sm font-medium text-cyan-100">
                  {dashboard.label} Workspace
                </p>

                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Welcome, {user.name}!
                </h2>

                <p className="mt-3 text-sm leading-7 text-cyan-50/90">
                  {dashboard.description}
                </p>

                <Link
                  href="/equipment"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta/90"
                >
                  Explore Equipment
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              {/* Decoration */}
              <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full border-32px border-white/10" />
            </div>

            {/* Workspace Tools */}
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Your Workspace
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your available dashboard sections.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {dashboard.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
                    >
                      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                        <Icon size={23} />
                      </div>

                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-5 border-t border-border pt-4">
                        <span className="text-xs font-medium text-muted-foreground">
                          Coming soon
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>
        </div>
      </div>
    </section>
  );
}
