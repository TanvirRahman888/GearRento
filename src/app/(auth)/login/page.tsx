import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getSafeRedirect } from "@/lib/safe-redirect";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | GearRento",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  // 1. Get the current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Get the previous page
  const params = await searchParams;
  const returnTo = getSafeRedirect(params.next);

  // 3. Already logged in? Redirect.
  if (session?.user) {
    redirect(returnTo);
  }

  // 4. Otherwise display the login form
  return <LoginForm returnTo={returnTo} />;
}