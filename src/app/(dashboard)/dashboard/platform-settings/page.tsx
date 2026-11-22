
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlatformSettingsForm } from "@/components/dashboard/platform-settings-form";

export const metadata: Metadata = {
  title: "Platform Settings | GearRento",
  description:
    "Manage marketplace settings and booking rules.",
};

export default async function PlatformSettingsPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/platform-settings"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Platform Settings"
      description="Manage marketplace information, customer support, announcements, and booking rules."
      activePage="platform-settings"
    >
      <PlatformSettingsForm />
    </DashboardShell>
  );
}
