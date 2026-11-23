
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "@/lib/auth-client";

import {
  LogIn,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Search,
  CalendarCheck,
  PackageCheck,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

// ======================================
// Input Styling
// ======================================

const inputClass =
  "w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";

// ======================================
// Props
// ======================================

type LoginFormProps = {
  returnTo?: string;
};

// ======================================
// Safe Redirect Helper
// ======================================

function getSafeReturnTo(returnTo: string) {
  // Only permit internal application routes.
  if (
    !returnTo.startsWith("/") ||
    returnTo.startsWith("//") ||
    returnTo.includes("\\")
  ) {
    return "/";
  }

  return returnTo;
}

// ======================================
// Google Logo
// ======================================

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.2c0-.75-.07-1.46-.2-2.15H12v4.07h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.28Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.43-2.37l-3.14-2.43c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.32v2.5A9.5 9.5 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.56 13.62a5.7 5.7 0 0 1 0-3.24v-2.5H3.32a9.5 9.5 0 0 0 0 8.24l3.24-2.5Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.37c1.43 0 2.71.49 3.72 1.47l2.79-2.8A9.07 9.07 0 0 0 12 2.5a9.5 9.5 0 0 0-8.68 5.38l3.24 2.5c.77-2.3 2.91-4.01 5.44-4.01Z"
      />
    </svg>
  );
}

// ======================================
// Login Form
// ======================================

export function LoginForm({
  returnTo = "/",
}: LoginFormProps) {
  const router = useRouter();

  const destination = getSafeReturnTo(returnTo);

  // ====================================
  // States
  // ====================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const busy = isLoading || isGoogleLoading;

  // ====================================
  // Email and Password Login
  // ====================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busy) return;

    const formData = new FormData(
      event.currentTarget
    );

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    );

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError(
        "Please enter a valid email address."
      );

      toast.error(
        "Invalid email address."
      );

      return;
    }

    // Validate password
    if (!password) {
      setError(
        "Please enter your password."
      );

      toast.error(
        "Password is required."
      );

      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const {
        data,
        error: authError,
      } = await signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (authError) {
        setError(
          "Invalid email or password."
        );

        toast.error(
          "Invalid email or password."
        );

        return;
      }

      if (!data?.user) {
        setError(
          "Unable to sign in. Please try again."
        );

        toast.error(
          "Unable to sign in."
        );

        return;
      }

      // Email login successful
      toast.success(
        `Welcome back, ${data.user.name}!`
      );

      router.replace(destination);
      router.refresh();
    } catch (cause) {
      console.error(
        "Email login failed:",
        cause
      );

      setError(
        "Something went wrong. Please try again."
      );

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ====================================
  // Google Login
  // ====================================

  async function handleGoogleSignIn() {
    if (busy) return;

    setError("");
    setIsGoogleLoading(true);

    try {
      const { error: googleError } =
        await signIn.social({
          provider: "google",

          // After authentication, return
          // to the intended GearRento page.
          callbackURL: destination,

          // Return here if Google fails.
          errorCallbackURL: "/login",
        });

      if (googleError) {
        const message =
          googleError.message ||
          "Google sign-in failed.";

        setError(message);
        toast.error(message);

        return;
      }

      // Better Auth handles the
      // redirect to Google's login page.
      //
      // The Customer role is assigned
      // in auth.ts during user creation.
    } catch (cause) {
      console.error(
        "Google login failed:",
        cause
      );

      const message =
        cause instanceof Error
          ? cause.message
          : "Unable to sign in with Google.";

      setError(message);
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  }

  // ====================================
  // UI
  // ====================================

  return (
    <div className="w-full rounded-[28px] border border-border bg-card p-5 shadow-xl shadow-black/5 sm:p-8 lg:p-10">

      {/* ==============================
          PAGE HEADING
      ============================== */}

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

      {/* ==============================
          TWO COLUMN LAYOUT
      ============================== */}

      <div className="grid items-stretch gap-5 lg:grid-cols-2">

        {/* ============================
            LEFT INFORMATION PANEL
        ============================ */}

        <div className="hidden flex-col rounded-2xl bg-muted p-7 lg:flex">

          <h2 className="text-lg font-semibold">
            Rent Smarter. Build Bigger.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your next rental is just a few clicks
            away. Access your account to continue
            where you left off.
          </p>

          <div className="mt-8 space-y-5">

            {/* Explore Equipment */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Search size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Explore Equipment
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Discover equipment that suits
                  your needs.
                </p>
              </div>
            </div>

            {/* Manage Bookings */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <CalendarCheck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Manage Your Bookings
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Keep track of your rental dates
                  and bookings.
                </p>
              </div>
            </div>

            {/* Manage Equipment */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <PackageCheck size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Manage Your Equipment
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Access equipment listings when
                  you have owner permissions.
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
                Find, rent and manage equipment
                with GearRento.
              </p>

            </div>
          </div>
        </div>

        {/* ============================
            RIGHT LOGIN PANEL
        ============================ */}

        <div className="flex flex-col justify-center rounded-2xl bg-muted p-5 sm:p-7">

          <h2 className="text-lg font-semibold">
            Sign In to Your Account
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials or continue
            with Google.
          </p>

          {/* ==========================
              EMAIL LOGIN FORM
          ========================== */}

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
                  disabled={busy}
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={busy}
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
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={busy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary disabled:opacity-50"
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

            {/* Email Submit Button */}
            <button
              type="submit"
              disabled={busy}
              aria-busy={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold text-cta-foreground transition-all duration-200 hover:bg-cta/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn size={18} />
                </>
              )}
            </button>

          </form>

          {/* ==========================
              DIVIDER
          ========================== */}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="whitespace-nowrap text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* ==========================
              GOOGLE LOGIN BUTTON
          ========================== */}

          <button
            type="button"
            onClick={() => {
              void handleGoogleSignIn();
            }}
            disabled={busy}
            aria-busy={isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Connecting to Google...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            New Google accounts are created
            with the Customer role.
          </p>

          {/* ==========================
              REGISTRATION LINK
          ========================== */}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}

            <Link
              href={`/register?next=${encodeURIComponent(
                destination
              )}`}
              className="font-semibold text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
