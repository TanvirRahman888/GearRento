
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { OwnerAvailabilityCalendar } from "@/components/dashboard/owner-availability-calendar";

export const metadata: Metadata = {
  title: "Equipment Availability | GearRento",
  description:
    "Manage unavailable equipment dates and rental reservations.",
};

export default async function AvailabilityPage() {
  const { user, role } = await requireRole(
    ["owner"],
    "/dashboard/availability"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Availability"
      description="Manage equipment availability, blocked dates, and rental reservations."
      activePage="availability"
    >
      <OwnerAvailabilityCalendar />
    </DashboardShell>
  );
}
