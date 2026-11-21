
import { requireRole } from "@/lib/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AddEquipmentForm } from "@/components/dashboard/add-equipment-form";

export default async function AddEquipmentPage() {
  const { user, role } = await requireRole(
    ["owner"],
    "/dashboard/add-equipment"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Add Equipment"
      description="List your equipment and make it available for rental."
      activePage="add-equipment"
    >
      <AddEquipmentForm />
    </DashboardShell>
  );
}
