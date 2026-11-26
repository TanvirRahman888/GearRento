
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { FeatureEquipmentForm } from "@/components/dashboard/feature-equipment-form";

import { FeaturePaymentStatus } from "@/components/dashboard/feature-payment-status";

export const metadata: Metadata = {
  title: "Feature Equipment | GearRento",
  description:
    "Promote your equipment with a paid featured listing.",
};

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    payment?: string | string[];
    session_id?: string | string[];
  }>;
};

function getSingleValue(
  value: string | string[] | undefined
) {
  return typeof value === "string"
    ? value
    : undefined;
}

export default async function FeatureEquipmentPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;

  const query = await searchParams;

  const { user, role } = await requireRole(
    ["owner"],
    `/dashboard/feature-equipment/${id}`
  );

  const payment = getSingleValue(query.payment);

  const sessionId = getSingleValue(
    query.session_id
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Feature Equipment"
      description="Promote your equipment with 5, 15, or 30-day featured placement."
      activePage="my-equipment"
    >
      <div className="space-y-6">
        {payment && (
          <FeaturePaymentStatus
            equipmentId={id}
            payment={payment}
            sessionId={sessionId}
          />
        )}

        <FeatureEquipmentForm equipmentId={id} />
      </div>
    </DashboardShell>
  );
}
