
import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { dashboardConfig } from "@/components/dashboard/dashboard-config";

export default async function ProfilePage() {
  const { user, role } = await requireRole(
    ["admin", "owner", "customer"],
    "/dashboard/profile"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Edit Profile"
      description="Manage your personal information and profile photo."
      activePage="profile"
    >
      <ProfileForm
        initialName={user.name}
        initialImage={user.image ?? null}
        email={user.email}
        roleLabel={dashboardConfig[role].label}
      />
    </DashboardShell>
  );
}
