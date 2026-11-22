
import type { Metadata } from "next";

import { requireRole } from "@/lib/require-role";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ManageUsersTable } from "@/components/dashboard/manage-users-table";

export const metadata: Metadata = {
  title: "Manage Users | GearRento",
  description:
    "Manage registered users, account roles, and user access.",
};

export default async function ManageUsersPage() {
  const { user, role } = await requireRole(
    ["admin"],
    "/dashboard/manage-users"
  );

  return (
    <DashboardShell
      user={user}
      role={role}
      title="Manage Users"
      description="Manage registered users, change account roles, and delete accounts."
      activePage="manage-users"
    >
      <ManageUsersTable />
    </DashboardShell>
  );
}
