
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AllRentalsTable } from "@/components/dashboard/all-rentals-table";

export const metadata: Metadata = {
  title: "All Rentals | GearRento",
  description:
    "Monitor all equipment bookings and customer payments.",
};

export default async function AllRentalsPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/all-rentals"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="All Rentals"
      description="Monitor equipment bookings, customer payments, and rental statuses."
      activePage="all-rentals"
    >
      <AllRentalsTable />
    </DashboardShell>
  );
}
