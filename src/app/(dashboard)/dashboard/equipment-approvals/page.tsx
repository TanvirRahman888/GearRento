
import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EquipmentApprovalsTable } from "@/components/dashboard/equipment-approvals-table";

export default async function EquipmentApprovalsPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/equipment-approvals"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Equipment Approvals"
      description="Review and approve equipment submitted by Product Owners."
      activePage="equipment-approvals"
    >
      <EquipmentApprovalsTable />
    </DashboardShell>
  );
}
