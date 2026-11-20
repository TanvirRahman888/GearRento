
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  LogIn,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Search,
  CalendarCheck,
  PackageCheck,
} from "lucide-react";

import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Invalid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      toast.error("Password is required.");
      return;
    }

    setError("");

    // Login API will be implemented later.
    console.log("GearRento Login Form:", {
      email,
      password: "[hidden]",
    });

    toast.info("Login form validated!", {
      description: "Authentication will be connected later.",
    });
  }

  return (
    <div className="w-full rounded-[28px] border border-border bg-card p-5 shadow-xl shadow-black/5 sm:p-8 lg:p-10">

      {/* Page Heading */}
      <div className="mb-9 flex flex-col items-center text-center">

        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-cta text-cta-foreground">
          <LogIn size={27} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome Back to GearRento
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your rentals and account
        </p>

      </div>

      {/* Two Column Layout */}
      <div className="grid items-stretch gap-5 lg:grid-cols-2">

        {/* =============================
            LEFT INFORMATION PANEL
        ============================= */}

        <div className="hidden flex-col rounded-2xl bg-muted p-7 lg:flex">

          <h2 className="text-lg font-semibold">
            Rent Smarter. Build Bigger.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your next rental is just a few clicks away.
            Access your account to continue where you left off.
          </p>

          <div className="mt-8 space-y-5">

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Search size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Explore Equipment
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Discover equipment that suits your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <CalendarCheck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Manage Your Bookings
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Keep track of your rental dates and bookings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <PackageCheck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Manage Your Equipment
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Access equipment listings when you have owner permissions.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Note */}
          <div className="mt-auto pt-8">
            <div className="rounded-xl border border-primary/15 bg-secondary p-4">
              <p className="text-sm font-semibold text-secondary-foreground">
                Everything you need, ready to rent.
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Find, rent and manage equipment with GearRento.
              </p>
            </div>
          </div>

        </div>

        {/* =============================
            RIGHT LOGIN FORM
        ============================= */}

        <div className="flex flex-col justify-center rounded-2xl bg-muted p-5 sm:p-7">

          <h2 className="text-lg font-semibold">
            Sign In to Your Account
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to continue.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  onChange={() => setError("")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={() => setError("")}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Validation Error */}
            {error && (
              <p
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold text-cta-foreground transition-colors hover:bg-cta/90"
            >
              Sign In
              <LogIn size={18} />
            </button>

          </form>

        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto my-7 flex max-w-xl items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">
          OR CONTINUE WITH
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign In */}
      <div className="mx-auto max-w-sm">
        <button
          type="button"
          onClick={() =>
            toast.info(
              "Google Sign In will be implemented later."
            )
          }
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <span className="text-lg font-bold text-[#4285F4]">
            G
          </span>

          Continue with Google
        </button>
      </div>

      {/* Registration Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create Account
        </Link>
      </p>

    </div>
  );
}
