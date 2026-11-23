
import type { ReactNode } from "react";

import {
  type DashboardRole,
} from "./dashboard-config";

import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardShellProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  role: DashboardRole;
  title: string;
  description: string;
  activePage: "overview" | "profile"| "add-equipment"| "my-equipment"| "equipment-approvals" | "my-bookings"  | "rental-requests" | "all-rentals" | "analytics" | "manage-users" | "all-equipment" | "platform-settings"| "availability" | "rental-history"
  children: ReactNode;
};

export function DashboardShell({
  user,
  role,
  title,
  description,
  activePage,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-dvh bg-background">

      {/* Fixed Sidebar */}
      <DashboardSidebar
        user={user}
        role={role}
        activePage={activePage}
      />

      {/* =====================================
          DASHBOARD CONTENT AREA
      ===================================== */}

      <div className="min-h-dvh lg:pl-75">

        <main
          className="
            mx-auto w-full max-w-[1550px]
            px-4 pb-8 pt-20
            sm:px-6
            lg:px-8 lg:py-8
          "
        >
          {/* =====================================
              COMPACT PAGE HEADING
          ===================================== */}

          <div
            className="
              relative overflow-hidden
              rounded-2xl
              bg-[#0E7490]
              px-5 py-6 text-white
              dark:bg-[#164552]
              sm:px-7 sm:py-7
            "
          >
            <div className="relative z-10">
              <p className="mb-2 text-xs font-semibold text-cyan-100">
                GearRento Dashboard
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50/90">
                {description}
              </p>
            </div>

            {/* Background Decoration */}
            <div
              className="
                pointer-events-none
                absolute -right-12 -top-14
                size-48 rounded-full
                border-28px border-white/10
              "
            />
          </div>

          {/* Dashboard Page Content */}
          <div className="mt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
