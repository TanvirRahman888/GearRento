"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  UserRoundPlus,
  UserRound,
  Package,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  ImageIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Role = "customer" | "owner";

type FormErrors = {
  name?: string;
  email?: string;
  photoUrl?: string;
  password?: string;
  confirmPassword?: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

type RegisterFormProps = {
  returnTo?: string;
};

export function RegisterForm({ returnTo = "/" }: RegisterFormProps) {
  const [role, setRole] = useState<Role>("customer");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  // Password validation
  const passwordRules = [
    { label: "8 characters", valid: password.length >= 8 },
    { label: "uppercase", valid: /[A-Z]/.test(password) },
    { label: "lowercase", valid: /[a-z]/.test(password) },
    { label: "number", valid: /[0-9]/.test(password) },
    {
      label: "special character",
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
  ];

  const missingRules = passwordRules
    .filter((rule) => !rule.valid)
    .map((rule) => rule.label);

  const passwordValid = missingRules.length === 0;

  const router = useRouter();

  // Form submission

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const photoUrl = String(formData.get("photoUrl") || "").trim();

    const newErrors: FormErrors = {};

    // 1. Name validation
    if (name.length < 2) {
      newErrors.name = "Enter at least 2 characters.";
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // 3. Profile photo URL validation
    try {
      const url = new URL(photoUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        newErrors.photoUrl = "Enter a valid image URL.";
      }
    } catch {
      newErrors.photoUrl = "Enter a valid image URL.";
    }

    // 4. Password validation
    if (!passwordValid) {
      newErrors.password = "Please meet all password requirements.";
    }

    // 5. Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the form errors.");
      return;
    }

    // 6. Start loading after validation
    setIsLoading(true);

    try {
      // 7. Create user with Better Auth
      const { data, error } = await signUp.email({
        name,
        email,
        password,
        image: photoUrl,

        // Public registration choice
        accountType: role,

        // Previous page
        callbackURL: returnTo,
      });

      // 8. Handle registration error
      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      // 9. Handle successful registration
      if (data?.user) {
        toast.success(`Welcome to GearRento, ${name}!`);

        router.replace(returnTo);
        router.refresh();
      }
    } catch (error) {
      console.error("Registration failed:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      // 10. Always stop loading
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full rounded-[28px] border border-border bg-card p-5 shadow-xl shadow-black/5 sm:p-8 lg:p-10">
      {/* Page Heading */}
      <div className="mb-9 flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-cta text-cta-foreground">
          <UserRoundPlus size={27} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Create Your GearRento Account
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose your account type and get started
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          {/* ===================================
              LEFT: ACCOUNT SELECTION
          =================================== */}

          <div className="flex flex-col rounded-2xl bg-muted p-5 sm:p-7">
            <fieldset>
              <legend className="text-base font-semibold">Register As</legend>

              <p className="mb-5 mt-1 text-sm text-muted-foreground">
                How would you like to use GearRento?
              </p>

              <div className="space-y-3">
                {/* Customer */}
                <button
                  type="button"
                  aria-pressed={role === "customer"}
                  onClick={() => setRole("customer")}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    role === "customer"
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserRound size={24} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">Customer</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Browse and rent equipment
                    </p>
                  </div>

                  {role === "customer" && (
                    <CheckCircle2 size={20} className="text-primary" />
                  )}
                </button>

                {/* Product Owner */}
                <button
                  type="button"
                  aria-pressed={role === "owner"}
                  onClick={() => setRole("owner")}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    role === "owner"
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Package size={24} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">Product Owner</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      List and rent out equipment
                    </p>
                  </div>

                  {role === "owner" && (
                    <CheckCircle2 size={20} className="text-primary" />
                  )}
                </button>
              </div>
            </fieldset>

            {/* Benefits */}
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-sm font-semibold">Why join GearRento?</h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Discover reliable equipment
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Flexible rental options
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Manage rentals in one place
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Information */}
            <div className="mt-auto pt-8">
              <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-secondary p-4">
                <ShieldCheck size={20} className="shrink-0 text-primary" />

                <p className="text-xs leading-6 text-secondary-foreground">
                  Your GearRento account will help you manage equipment rentals
                  and bookings in one place.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================
              RIGHT: REGISTRATION INPUTS
          =================================== */}

          <div className="rounded-2xl bg-muted p-5 sm:p-7">
            <h2 className="text-base font-semibold">Your Information</h2>

            <p className="mb-6 mt-1 text-sm text-muted-foreground">
              Fill in the details below to continue.
            </p>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                  />

                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
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
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    className={inputClass}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="register-photo"
                  className="mb-2 block text-sm font-medium"
                >
                  Profile Photo URL
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                  />

                  <input
                    id="register-photo"
                    name="photoUrl"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass}
                  />
                </div>

                {errors.photoUrl && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.photoUrl}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
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
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p
                  className={`mt-2 text-xs ${
                    password && passwordValid
                      ? "text-green-600 dark:text-green-400"
                      : password
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {!password
                    ? "8+ characters, uppercase, lowercase, number & special character."
                    : passwordValid
                      ? "✓ Password requirements met."
                      : `Missing: ${missingRules.join(", ")}`}
                </p>

                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="register-confirm"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                  />

                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`mt-1 text-xs ${
                      confirmPassword === password
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive"
                    }`}
                  >
                    {confirmPassword === password
                      ? "✓ Passwords match."
                      : "Passwords do not match."}
                  </p>
                )}

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3 font-semibold text-cta-foreground transition-all duration-200 hover:bg-cta/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Divider */}
      <div className="mx-auto my-7 flex max-w-xl items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign In */}
      <div className="mx-auto max-w-sm">
        <button
          type="button"
          onClick={() => toast.info("Google Sign In will be added later.")}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <span className="text-lg font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>
      </div>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
