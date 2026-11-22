
"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CreditCard,
  Loader2,
  LockKeyhole,
  MapPin,
  Phone,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { rentalDivisions } from "@/lib/equipment";

type Props = {
  equipmentId: string;
  dailyPrice: number;
  availableQuantity: number;
  viewerRole: string | null;
  isLoggedIn: boolean;
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
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getRentalDays(start: string, end: string) {
  if (!start || !end || end < start) return 0;

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

const inputClass =
  "mt-2 w-full min-w-0 rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

// =====================================
// Booking Form
// =====================================

export function BookingRequestForm({
  equipmentId,
  dailyPrice,
  availableQuantity,
  viewerRole,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  // Only Customer role can book
  const isCustomer = viewerRole === "customer";

  const today = getBangladeshToday();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const totalDays = getRentalDays(
    startDate,
    endDate
  );

  const totalPrice =
    totalDays * quantity * dailyPrice;

  const unavailable = availableQuantity < 1;

  const validRental =
    totalDays >= 1 &&
    totalDays <= 30 &&
    startDate >= today &&
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= availableQuantity;

  const disabled =
    !isCustomer || unavailable || submitting;

  // ===================================
  // Submit Booking
  // ===================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (disabled || !validRental) return;

    setSubmitting(true);

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        toast.error("Please log in as a customer.");

        router.push(
          `/login?next=${encodeURIComponent(
            `/equipment/${equipmentId}`
          )}`
        );

        return;
      }

      const apiURL =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("API URL is missing.");
      }

      const response = await fetch(
        `${apiURL.replace(/\/+$/, "")}/bookings/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            equipmentId,
            startDate,
            endDate,
            quantity,
            fullName,
            phone,
            division,
            district,
            address,
            notes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ||
            "Unable to start Stripe Checkout."
        );
      }

      // Redirect to hosted Stripe Checkout
      window.location.assign(result.url);
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

      {/* =============================
          ROLE RESTRICTION
      ============================= */}

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

      {/* Stock Restriction */}
      {unavailable && (
        <div className="mb-5 rounded-xl border border-destructive/20 bg-muted p-4 text-sm text-destructive">
          This equipment is currently unavailable.
        </div>
      )}

      {/* =============================
          BOOKING FORM
      ============================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Disable ALL inputs for non-customers */}
        <fieldset
          disabled={disabled}
          className="space-y-5 disabled:opacity-60"
        >
          {/* Rental Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays
                size={17}
                className="text-primary"
              />
              Rental Information
            </h3>

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
                    const nextDate = event.target.value;

                    setStartDate(nextDate);

                    if (endDate < nextDate) {
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
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  className={inputClass}
                />
              </label>
            </div>

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

            <p className="text-xs text-muted-foreground">
              Listed stock: {availableQuantity} units.
              Availability for your dates is checked
              before payment.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Phone
                size={17}
                className="text-primary"
              />
              Contact Information
            </h3>

            <label className="block text-sm font-medium">
              Full Name
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Your full name"
                className={inputClass}
              />
            </label>

            <label className="block text-sm font-medium">
              Contact Number
              <input
                type="tel"
                required
                maxLength={30}
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </label>
          </div>

          {/* Rental Address */}
          <div className="space-y-4 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin
                size={17}
                className="text-primary"
              />
              Rental Address
            </h3>

            {/* All Bangladesh Divisions */}
            <label className="block text-sm font-medium">
              Division

              <select
                required
                value={division}
                onChange={(event) =>
                  setDivision(event.target.value)
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
                  setDistrict(event.target.value)
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
                  setAddress(event.target.value)
                }
                placeholder="House, road, area, postal code..."
                className={inputClass}
              />
            </label>

            {/* Optional Notes */}
            <label className="block text-sm font-medium">
              Additional Notes (Optional)

              <textarea
                rows={2}
                maxLength={500}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Additional instructions"
                className={inputClass}
              />
            </label>
          </div>

          {/* Rental Summary */}
          <div className="rounded-xl bg-secondary p-4">
            <h3 className="mb-4 text-sm font-semibold">
              Rental Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Price / day
                </span>

                <span>
                  ৳{dailyPrice.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Rental Days
                </span>

                <span>{totalDays}</span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">
                  Quantity
                </span>

                <span>{quantity}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-2xl font-bold text-primary">
                ৳{totalPrice.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Stripe Checkout */}
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
            ) : !isCustomer ? (
              <LockKeyhole size={18} />
            ) : (
              <CreditCard size={18} />
            )}

            {submitting
              ? "Opening Stripe..."
              : !isCustomer
                ? "Customer Login Required"
                : "Proceed to Payment"}
          </button>

          <p className="text-center text-xs leading-5 text-muted-foreground">
            Booking is confirmed after successful
            Stripe payment verification.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
