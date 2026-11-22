
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  CalendarDays,
  CreditCard,
  Loader2,
  LockKeyhole,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { rentalDivisions } from "@/lib/equipment";

// =====================================
// Types
// =====================================

type Props = {
  equipmentId: string;
  dailyPrice: number;
  availableQuantity: number;
  viewerRole: string | null;
  isLoggedIn: boolean;
};

type BookingRules = {
  bookingsEnabled: boolean;
  maxRentalDays: number;
};

type PlatformSettingsResponse = {
  success: boolean;
  settings?: BookingRules;
  error?: string;
};

type CheckoutResponse = {
  success?: boolean;
  bookingId?: string;
  url?: string;
  error?: string;
};

// =====================================
// Helpers
// =====================================

function getBangladeshToday() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [
      part.type,
      part.value,
    ])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getRentalDays(
  start: string,
  end: string
) {
  if (!start || !end || end < start) {
    return 0;
  }

  const startTime = Date.parse(
    `${start}T00:00:00.000Z`
  );

  const endTime = Date.parse(
    `${end}T00:00:00.000Z`
  );

  if (
    !Number.isFinite(startTime) ||
    !Number.isFinite(endTime)
  ) {
    return 0;
  }

  return (
    Math.round(
      (endTime - startTime) / 86400000
    ) + 1
  );
}

// Calculate the latest allowed end date.
function getMaximumEndDate(
  startDate: string,
  maxRentalDays: number
) {
  if (!startDate) return "";

  const date = new Date(
    `${startDate}T00:00:00.000Z`
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setUTCDate(
    date.getUTCDate() + maxRentalDays - 1
  );

  return date.toISOString().slice(0, 10);
}

function getApiUrl() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  return apiUrl.replace(/\/+$/, "");
}

const inputClass =
  "mt-2 w-full min-w-0 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

// =====================================
// Booking Request Form
// =====================================

export function BookingRequestForm({
  equipmentId,
  dailyPrice,
  availableQuantity,
  viewerRole,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  // Only Customer accounts can book.
  const isCustomer =
    viewerRole === "customer";

  const today = getBangladeshToday();

  // ===================================
  // Rental Information
  // ===================================

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  // ===================================
  // Contact Information
  // ===================================

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  // ===================================
  // Rental Address
  // ===================================

  const [division, setDivision] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [notes, setNotes] =
    useState("");

  // ===================================
  // Stripe Checkout State
  // ===================================

  const [submitting, setSubmitting] =
    useState(false);

  // ===================================
  // Platform Booking Rules
  // ===================================

  const [bookingRules, setBookingRules] =
    useState<BookingRules | null>(null);

  const [settingsError, setSettingsError] =
    useState("");

  const [settingsRefreshKey, setSettingsRefreshKey] =
    useState(0);

  // ===================================
  // Load Platform Settings
  // ===================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchBookingRules():
      Promise<BookingRules> {
      const response = await fetch(
        `${getApiUrl()}/platform-settings`,
        {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "The platform settings API returned an invalid response."
        );
      }

      const result =
        (await response.json()) as
          PlatformSettingsResponse;

      if (
        !response.ok ||
        !result.success ||
        !result.settings
      ) {
        throw new Error(
          result.error ||
            "Unable to load booking settings."
        );
      }

      const rules = result.settings;

      if (
        typeof rules.bookingsEnabled !==
          "boolean" ||
        !Number.isInteger(
          rules.maxRentalDays
        ) ||
        rules.maxRentalDays < 1 ||
        rules.maxRentalDays > 30
      ) {
        throw new Error(
          "The platform returned invalid booking rules."
        );
      }

      return rules;
    }

    void fetchBookingRules()
      .then((rules) => {
        if (
          controller.signal.aborted
        ) {
          return;
        }

        setBookingRules(rules);
        setSettingsError("");
      })
      .catch((error: unknown) => {
        if (
          controller.signal.aborted
        ) {
          return;
        }

        setBookingRules(null);

        setSettingsError(
          error instanceof Error
            ? error.message
            : "Unable to load booking settings."
        );
      });

    return () => {
      controller.abort();
    };
  }, [settingsRefreshKey]);

  // ===================================
  // Retry Loading Settings
  // ===================================

  function retryBookingRules() {
    setBookingRules(null);
    setSettingsError("");

    setSettingsRefreshKey(
      (current) => current + 1
    );
  }

  // ===================================
  // Rental Calculations
  // ===================================

  const totalDays = getRentalDays(
    startDate,
    endDate
  );

  const totalPrice =
    totalDays * quantity * dailyPrice;

  const unavailable =
    availableQuantity < 1;

  const maxRentalDays =
    bookingRules?.maxRentalDays ?? 30;

  const maxEndDate =
    getMaximumEndDate(
      startDate,
      maxRentalDays
    );

  const validRental =
    bookingRules !== null &&
    bookingRules.bookingsEnabled &&
    totalDays >= 1 &&
    totalDays <= maxRentalDays &&
    startDate >= today &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= availableQuantity;

  // ===================================
  // Booking Availability
  // ===================================

  const settingsLoading =
    bookingRules === null &&
    !settingsError;

  const bookingsPaused =
    bookingRules !== null &&
    !bookingRules.bookingsEnabled;

  const disabled =
    !isCustomer ||
    unavailable ||
    submitting ||
    settingsLoading ||
    Boolean(settingsError) ||
    bookingsPaused;

  // ===================================
  // Submit Booking
  // ===================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Check platform settings first.
    if (!bookingRules) {
      toast.error(
        "Booking settings are not available. Please try again."
      );
      return;
    }

    if (!bookingRules.bookingsEnabled) {
      toast.error(
        "GearRento is temporarily not accepting new bookings."
      );
      return;
    }

    if (
      totalDays < 1 ||
      totalDays > bookingRules.maxRentalDays
    ) {
      toast.error(
        `Rental duration must be between 1 and ${bookingRules.maxRentalDays} days.`
      );
      return;
    }

    if (
      !isCustomer ||
      unavailable ||
      submitting ||
      !validRental
    ) {
      return;
    }

    setSubmitting(true);

    try {
      // =================================
      // Get Better Auth JWT
      // =================================

      const tokenResult =
        await authClient.token();

      const token =
        tokenResult.data?.token;

      if (!token) {
        toast.error(
          "Please log in as a customer."
        );

        router.push(
          `/login?next=${encodeURIComponent(
            `/equipment/${equipmentId}`
          )}`
        );

        return;
      }

      // =================================
      // Create Stripe Checkout Session
      // =================================

      const response = await fetch(
        `${getApiUrl()}/bookings/checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            equipmentId,

            startDate,
            endDate,
            quantity,

            fullName: fullName.trim(),
            phone: phone.trim(),

            division,
            district: district.trim(),
            address: address.trim(),
            notes: notes.trim(),
          }),
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | CheckoutResponse
        | null;

      if (
        !response.ok ||
        !result?.success ||
        !result.url
      ) {
        throw new Error(
          result?.error ||
            "Unable to start Stripe Checkout."
        );
      }

      // =================================
      // Redirect to Stripe Checkout
      // =================================

      window.location.assign(
        result.url
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Booking request failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ===================================
  // Component
  // ===================================

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-xl font-bold">
          Book This Equipment
        </h2>

        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Select rental dates, enter your contact
          information, and complete Stripe payment.
        </p>
      </div>

      {/* =================================
          Role Restriction
      ================================= */}

      {!isCustomer && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-border bg-muted p-4"
        >
          <div className="flex items-start gap-3">
            <LockKeyhole
              size={20}
              className="mt-0.5 shrink-0 text-primary"
            />

            <div>
              <p className="text-sm font-semibold">
                Customer Account Required
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isLoggedIn
                  ? "Only Customer accounts can book equipment. Owner and Admin accounts cannot make bookings."
                  : "Please log in with a Customer account to book this equipment."}
              </p>

              {!isLoggedIn && (
                <Link
                  href={`/login?next=${encodeURIComponent(
                    `/equipment/${equipmentId}`
                  )}`}
                  className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Log In to Book
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================
          Stock Restriction
      ================================= */}

      {unavailable && (
        <div className="mb-5 rounded-xl border border-destructive/20 bg-muted p-4 text-sm text-destructive">
          This equipment is currently unavailable.
        </div>
      )}

      {/* =================================
          Loading Platform Settings
      ================================= */}

      {settingsLoading && (
        <div
          role="status"
          className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4"
        >
          <Loader2
            size={18}
            className="shrink-0 animate-spin text-primary"
          />

          <p className="text-sm text-muted-foreground">
            Checking current booking rules...
          </p>
        </div>
      )}

      {/* =================================
          Platform Settings Error
      ================================= */}

      {settingsError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-destructive"
            />

            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">
                Booking Settings Unavailable
              </p>

              <p className="mt-2 wrap-break-word text-xs leading-5 text-muted-foreground">
                {settingsError}
              </p>

              <button
                type="button"
                onClick={retryBookingRules}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          Bookings Paused by Admin
      ================================= */}

      {bookingsPaused && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400"
            />

            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Bookings Temporarily Paused
              </p>

              <p className="mt-2 text-xs leading-5 text-amber-800 dark:text-amber-200">
                GearRento is currently not accepting
                new equipment bookings. Existing
                confirmed rentals remain unaffected.
              </p>

              <button
                type="button"
                onClick={retryBookingRules}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-800 hover:underline dark:text-amber-300"
              >
                <RefreshCw size={14} />
                Check Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          Booking Form
      ================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <fieldset
          disabled={disabled}
          className="space-y-5 disabled:opacity-60"
        >

          {/* ===========================
              Rental Information
          =========================== */}

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays
                size={17}
                className="text-primary"
              />

              Rental Information
            </h3>

            {/* Maximum Rental Duration */}
            {bookingRules?.bookingsEnabled && (
              <div className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5">
                <p className="text-xs font-medium text-primary">
                  Maximum rental duration:{" "}
                  {bookingRules.maxRentalDays}{" "}
                  {bookingRules.maxRentalDays === 1
                    ? "day"
                    : "days"}
                </p>
              </div>
            )}

            {/* Rental Dates */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

              {/* Start Date */}
              <label className="block text-sm font-medium">
                Start Date

                <input
                  type="date"
                  required
                  min={today}
                  value={startDate}
                  onChange={(event) => {
                    const nextDate =
                      event.target.value;

                    setStartDate(nextDate);

                    const nextMaxEnd =
                      getMaximumEndDate(
                        nextDate,
                        maxRentalDays
                      );

                    if (
                      !nextDate ||
                      endDate < nextDate ||
                      endDate > nextMaxEnd
                    ) {
                      setEndDate("");
                    }
                  }}
                  className={inputClass}
                />
              </label>

              {/* End Date */}
              <label className="block text-sm font-medium">
                End Date

                <input
                  type="date"
                  required
                  min={startDate || today}
                  max={maxEndDate || undefined}
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </label>
            </div>

            {/* Rental Duration Warning */}
            {totalDays > maxRentalDays &&
              bookingRules && (
                <p className="text-xs font-medium text-destructive">
                  Your selected rental duration
                  exceeds the maximum of{" "}
                  {maxRentalDays} days.
                </p>
              )}

            {/* Quantity */}
            <label className="block text-sm font-medium">
              Quantity

              <input
                type="number"
                required
                min={1}
                max={availableQuantity}
                step={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    Number(event.target.value)
                  )
                }
                className={inputClass}
              />
            </label>

            <p className="text-xs leading-5 text-muted-foreground">
              Listed stock: {availableQuantity}{" "}
              {availableQuantity === 1
                ? "unit"
                : "units"}
              . Availability for your selected
              dates is checked before payment.
            </p>
          </div>

          {/* ===========================
              Contact Information
          =========================== */}

          <div className="space-y-4 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Phone
                size={17}
                className="text-primary"
              />

              Contact Information
            </h3>

            {/* Full Name */}
            <label className="block text-sm font-medium">
              Full Name

              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                placeholder="Your full name"
                className={inputClass}
              />
            </label>

            {/* Phone */}
            <label className="block text-sm font-medium">
              Contact Number

              <input
                type="tel"
                required
                maxLength={30}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </label>
          </div>

          {/* ===========================
              Rental Address
          =========================== */}

          <div className="space-y-4 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin
                size={17}
                className="text-primary"
              />

              Rental Address
            </h3>

            {/* Division */}
            <label className="block text-sm font-medium">
              Division

              <select
                required
                value={division}
                onChange={(event) =>
                  setDivision(
                    event.target.value
                  )
                }
                className={inputClass}
              >
                <option value="">
                  Select Division
                </option>

                {rentalDivisions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {/* District */}
            <label className="block text-sm font-medium">
              District

              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={district}
                onChange={(event) =>
                  setDistrict(
                    event.target.value
                  )
                }
                placeholder="Enter district"
                className={inputClass}
              />
            </label>

            {/* Full Address */}
            <label className="block text-sm font-medium">
              Full Address

              <textarea
                required
                rows={3}
                minLength={10}
                maxLength={500}
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                placeholder="House, road, area, postal code..."
                className={inputClass}
              />
            </label>

            {/* Additional Notes */}
            <label className="block text-sm font-medium">
              Additional Notes (Optional)

              <textarea
                rows={2}
                maxLength={500}
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                placeholder="Additional instructions"
                className={inputClass}
              />
            </label>
          </div>

          {/* ===========================
              Rental Summary
          =========================== */}

          <div className="rounded-xl bg-secondary p-4">
            <h3 className="mb-4 text-sm font-semibold">
              Rental Summary
            </h3>

            <div className="space-y-3 text-sm">

              {/* Daily Price */}
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Price / day
                </span>

                <span>
                  ৳
                  {dailyPrice.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

              {/* Rental Days */}
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Rental Days
                </span>

                <span>
                  {totalDays}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Quantity
                </span>

                <span>
                  {quantity}
                </span>
              </div>

              {/* Maximum Rental Days */}
              {bookingRules && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    Maximum Allowed
                  </span>

                  <span>
                    {bookingRules.maxRentalDays}{" "}
                    {bookingRules.maxRentalDays === 1
                      ? "day"
                      : "days"}
                  </span>
                </div>
              )}
            </div>

            {/* Total Price */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-primary">
                ৳
                {totalPrice.toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>
          </div>

          {/* ===========================
              Stripe Checkout Button
          =========================== */}

          <button
            type="submit"
            disabled={
              disabled ||
              !validRental ||
              !division ||
              !district.trim() ||
              !address.trim() ||
              !fullName.trim() ||
              !phone.trim()
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : disabled ? (
              <LockKeyhole size={18} />
            ) : (
              <CreditCard size={18} />
            )}

            {submitting
              ? "Opening Stripe..."
              : !isCustomer
                ? "Customer Login Required"
                : settingsLoading
                  ? "Checking Booking Rules..."
                  : settingsError
                    ? "Booking Unavailable"
                    : bookingsPaused
                      ? "Bookings Paused"
                      : unavailable
                        ? "Equipment Unavailable"
                        : "Proceed to Payment"}
          </button>

          {/* Payment Information */}
          <p className="text-center text-xs leading-5 text-muted-foreground">
            Booking is confirmed after successful
            Stripe payment verification.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
