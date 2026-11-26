
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { SavedEquipmentList } from "@/components/dashboard/saved-equipment-list";

export const metadata: Metadata = {
  title: "Saved Equipment | GearRento",
  description:
    "Manage your favorite rental equipment on GearRento.",
};

export default async function FavoritesPage() {
  const { user, role } = await requireRole(
    ["customer"],
    "/dashboard/favorites"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Saved Equipment"
      description="View and manage equipment you've saved for later."
      activePage="favorites"
    >
      <SavedEquipmentList />
    </DashboardShell>
  );
}
