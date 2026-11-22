
import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MyEquipmentList } from "@/components/dashboard/my-equipment-list";

export default async function MyEquipmentPage() {
  const { user, role } = await requireRole(
    ["owner"],
    "/dashboard/my-equipment"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="My Equipment"
      description="View your equipment listings and track their approval status."
      activePage="my-equipment"
    >
      <MyEquipmentList />
    </DashboardShell>
  );
}
