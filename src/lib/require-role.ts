import "server-only";

import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth";

export type UserRole = "admin" | "owner" | "customer";

export async function requireRole(
  allowedRoles: UserRole[],
  returnTo = "/dashboard",
) {
  // Verify the actual Better Auth session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }

  const role = session.user.role;

  // Reject invalid roles
  if (role !== "admin" && role !== "owner" && role !== "customer") {
    notFound();
  }

  // Reject users without permission
  if (!allowedRoles.includes(role)) {
    notFound();
  }

  return {
    user: session.user,
    role,
  };
}
