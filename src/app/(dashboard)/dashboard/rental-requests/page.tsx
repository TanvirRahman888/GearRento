
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RentalRequestsList } from "@/components/dashboard/rental-requests-list";

export const metadata: Metadata = {
  title: "Rental Requests | GearRento",
  description:
    "Manage confirmed and completed equipment rentals.",
};

export default async function RentalRequestsPage() {
  const { user, role } = await requireRole(
    ["owner"],
    "/dashboard/rental-requests"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Rental Requests"
      description="View paid customer bookings, rental information, and manage completed rentals."
      activePage="rental-requests"
    >
      <RentalRequestsList />
    </DashboardShell>
  );
}
