
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MyBookingsList } from "@/components/dashboard/my-bookings-list";

export const metadata: Metadata = {
  title: "My Bookings | GearRento",
  description:
    "View and track your rental bookings and payment statuses.",
};

export default async function MyBookingsPage() {
  const { user, role } = await requireRole(
    ["customer"],
    "/dashboard/my-bookings"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="My Bookings"
      description="View your rental bookings, payment information, and rental dates."
      activePage="my-bookings"
    >
      <MyBookingsList />
    </DashboardShell>
  );
}
