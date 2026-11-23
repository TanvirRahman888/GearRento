
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { FeatureEquipmentForm } from "@/components/dashboard/feature-equipment-form";

export const metadata: Metadata = {
  title: "Feature Equipment | GearRento",
  description:
    "Promote your equipment with a paid featured listing.",
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FeatureEquipmentPage({
  params,
}: Props) {
  const { id } = await params;

  const { user, role } = await requireRole(
    ["owner"],
    `/dashboard/feature-equipment/${id}`
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Feature Equipment"
      description="Promote your equipment with 5, 15, or 30-day featured placement."
      activePage="my-equipment"
    >
      <FeatureEquipmentForm
        equipmentId={id}
      />
    </DashboardShell>
  );
}
