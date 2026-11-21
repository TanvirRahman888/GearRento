import type { ReactNode } from "react";
import { requireRole } from "@/lib/require-role";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(["admin", "owner", "customer"]);

  return <>{children}</>;
}
