
import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardFeatureGrid } from "@/components/dashboard/dashboard-feature-grid";
import { dashboardConfig } from "@/components/dashboard/dashboard-config";

export default async function DashboardPage() {
  const { user, role } = await requireRole(
    ["admin", "owner", "customer"],
    "/dashboard"
  );

  const dashboard = dashboardConfig[role];

  return (
    <DashboardShell
      user={user}
      role={role}
      title={dashboard.title}
      description={dashboard.description}
      activePage="overview"
    >
      <DashboardFeatureGrid role={role} />
    </DashboardShell>
  );
}
