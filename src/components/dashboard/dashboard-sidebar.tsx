"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Menu,
  X,
  House,
  LayoutDashboard,
  Package,
  Pencil,
  UserRound,
} from "lucide-react";

import { dashboardConfig, type DashboardRole } from "./dashboard-config";

import { LogoutButton } from "./logout-button";

type DashboardSidebarProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  role: DashboardRole;
  activePage: "overview" | "profile" | "add-equipment" | "my-equipment" | "equipment-approvals"| "my-bookings"  | "rental-requests" | "all-rentals" | "analytics" | "manage-users" | "all-equipment" | "platform-settings"| "availability";
};

// Shared navigation links
const generalLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    page: "overview",
  },
  {
    label: "Edit Profile",
    href: "/dashboard/profile",
    icon: Pencil,
    page: "profile",
  },
  {
    label: "Browse Equipment",
    href: "/equipment",
    icon: Package,
    page: null,
  },
  {
    label: "Back to Home",
    href: "/",
    icon: House,
    page: null,
  },
] as const;

export function DashboardSidebar({
  user,
  role,
  activePage,
}: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboard = dashboardConfig[role];

  // Close mobile sidebar with Escape
  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* =====================================
          MOBILE SIDEBAR TOGGLE
      ===================================== */}

      <button
        type="button"
        aria-label="Open dashboard navigation"
        aria-expanded={mobileOpen}
        aria-controls="dashboard-sidebar"
        onClick={() => setMobileOpen(true)}
        className="
          fixed left-4 top-4 z-40
          flex size-11 items-center justify-center
          rounded-xl border border-border
          bg-card text-foreground
          shadow-sm
          lg:hidden
        "
      >
        <Menu size={21} />
      </button>

      {/* =====================================
          MOBILE BACKDROP
      ===================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/45
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================
          FIXED SIDEBAR
      ===================================== */}

      <aside
        id="dashboard-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-75 max-w-[90vw]
          flex-col
          border-r border-border
          bg-card
          shadow-xl
          transition-transform duration-300
          ease-in-out
          lg:translate-x-0
          lg:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =====================================
            SIDEBAR BRAND
        ===================================== */}

        <div
          className="
            flex h-16 shrink-0 items-center
            justify-between
            border-b border-border
            px-5
          "
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div
              className="
                flex size-9 items-center justify-center
                rounded-xl bg-secondary text-primary
              "
            >
              <LayoutDashboard size={20} />
            </div>

            <div>
              <p className="text-sm font-bold">GearRento</p>

              <p className="text-[11px] text-muted-foreground">
                Dashboard Workspace
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="
              flex size-9 items-center justify-center
              rounded-lg hover:bg-accent
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================
            USER PROFILE
        ===================================== */}

        <div className="shrink-0 border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            {/* Profile Photo */}
            <div
              className="
                relative flex size-12 shrink-0
                items-center justify-center
                overflow-hidden rounded-full
                bg-primary text-primary-foreground
              "
            >
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

            {/* User Name and Email */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>

              <p
                className="
                  mt-1 truncate
                  text-xs text-muted-foreground
                "
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="mt-4">
            <span
              className="
                inline-flex rounded-full
                bg-secondary px-3 py-1
                text-xs font-semibold
                text-secondary-foreground
              "
            >
              {dashboard.label}
            </span>
          </div>
        </div>

        {/* =====================================
            SCROLLABLE NAVIGATION AREA
        ===================================== */}

        <nav
          aria-label="Dashboard navigation"
          className="
            min-h-0 flex-1
            overflow-y-auto
            px-4 py-5
          "
        >
          {/* GENERAL LINKS */}
          <div>
            <p
              className="
                mb-3 px-3
                text-[11px] font-bold
                uppercase tracking-wider
                text-muted-foreground
              "
            >
              Main Menu
            </p>

            <div className="space-y-1">
              {generalLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.page !== null && activePage === link.page;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3
                      rounded-xl px-3 py-3
                      text-sm font-medium
                      transition-colors
                      ${
                        isActive
                          ? "bg-secondary text-primary"
                          : "text-foreground/80 hover:bg-accent hover:text-primary"
                      }
                    `}
                  >
                    <Icon size={19} className="shrink-0" />

                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================
              ROLE-SPECIFIC LINKS
          ===================================== */}

          <div className="mt-6 border-t border-border pt-5">
            <p
              className="
                mb-3 px-3
                text-[11px] font-bold
                uppercase tracking-wider
                text-muted-foreground
              "
            >
              {dashboard.label} Tools
            </p>

            <div className="space-y-1">
              {dashboard.features.map((feature) => {
                const Icon = feature.icon;

                const isActive = feature.href === `/dashboard/${activePage}`;

                const content = (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon size={18} className="shrink-0" />

                      <span className="truncate">{feature.title}</span>
                    </div>

                    {!feature.href && (
                      <span className="shrink-0 rounded-md bg-muted px-1.5 py-1 text-[10px] text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </>
                );

                const classes =
                  "flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm transition-colors";

                // Implemented features
                if (feature.href) {
                  return (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`${classes} ${
                        isActive
                          ? "bg-secondary font-semibold text-primary"
                          : "text-foreground/80 hover:bg-accent hover:text-primary"
                      }`}
                    >
                      {content}
                    </Link>
                  );
                }

                // Upcoming features
                return (
                  <div
                    key={feature.title}
                    className={`${classes} text-muted-foreground`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* =====================================
            LOGOUT - ALWAYS AT BOTTOM
        ===================================== */}

        <div
          className="
            mt-auto shrink-0
            border-t border-border
            bg-card px-4 py-4
          "
        >
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
