
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminAnalyticsDashboard } from "@/components/dashboard/admin-analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics | GearRento",
  description:
    "Monitor rental bookings, equipment performance, and revenue.",
};

export default async function AnalyticsPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/analytics"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Analytics"
      description="Explore booking trends, customer payments, and equipment rental performance."
      activePage="analytics"
    >
      <AdminAnalyticsDashboard />
    </DashboardShell>
  );
}
