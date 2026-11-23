
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { RentalHistoryList } from "@/components/dashboard/rental-history-list";

export const metadata: Metadata = {
  title: "Rental History | GearRento",
  description:
    "View your completed and past equipment rentals.",
};

export default async function RentalHistoryPage() {
  const { user, role } = await requireRole(
    ["customer"],
    "/dashboard/rental-history"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Rental History"
      description="Review your past rentals, payments, and completed bookings."
      activePage="rental-history"
    >
      <RentalHistoryList />
    </DashboardShell>
  );
}
