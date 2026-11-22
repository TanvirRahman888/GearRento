
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AllEquipmentTable } from "@/components/dashboard/all-equipment-table";

export const metadata: Metadata = {
  title: "All Equipment | GearRento",
  description:
    "Monitor and inspect all equipment listings.",
};

export default async function AllEquipmentPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/all-equipment"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="All Equipment"
      description="View approved, pending, and rejected equipment from every Owner."
      activePage="all-equipment"
    >
      <AllEquipmentTable />
    </DashboardShell>
  );
}
