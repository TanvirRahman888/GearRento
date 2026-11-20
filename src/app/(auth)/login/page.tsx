import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | GearRento",
  description: "Sign in to your GearRento account.",
};

export default function LoginPage() {
  return <LoginForm />;
}