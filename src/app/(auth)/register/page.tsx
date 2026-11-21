import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSafeRedirect } from "@/lib/safe-redirect";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register | GearRento",
};

type RegisterPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const params = await searchParams;
  const returnTo = getSafeRedirect(params.next);

  // Already authenticated
  if (session?.user) {
    redirect(returnTo);
  }

  return <RegisterForm returnTo={returnTo} />;
}