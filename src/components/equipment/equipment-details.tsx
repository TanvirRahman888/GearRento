
import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Package,
  Tag,
} from "lucide-react";

import type { PublicEquipmentDetails } from "@/lib/get-equipment-details";

import { EquipmentGallery } from "./equipment-gallery";
import { BookingRequestForm } from "./booking-request-form";

type Props = {
  equipment: PublicEquipmentDetails;
  viewerRole: string | null;
  isLoggedIn: boolean;
};

export function EquipmentDetails({
  equipment,
  viewerRole,
  isLoggedIn,
}: Props) {
  const conditionLabel = equipment.condition
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const available = equipment.availableQuantity > 0;

  const allDivisions = equipment.divisions.length === 8;

  return (
    <section className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">

        {/* Back Navigation */}
        <Link
          href="/equipment"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to All Equipment
        </Link>

        {/* Main Two-Column Layout */}
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">

          {/* =============================
              LEFT: EQUIPMENT DETAILS
          ============================= */}

          <div className="min-w-0 space-y-7">

            {/* Image Gallery */}
            <EquipmentGallery
              images={equipment.imageUrls}
              name={equipment.name}
            />

            {/* Equipment Information */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">

              {/* Status */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                  <BadgeCheck size={15} />
                  Approved Listing
                </span>

                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                  {conditionLabel}
                </span>
              </div>

              {/* Equipment Name */}
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {equipment.name}
              </h1>

              {/* Categories */}
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Tag
                    size={16}
                    className="text-primary"
                  />
                  Categories
                </p>

                <div className="flex flex-wrap gap-2">
                  {equipment.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment Rental Divisions */}
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <MapPin
                    size={16}
                    className="text-primary"
                  />
                  Rental Locations
                </p>

                {allDivisions ? (
                  <p className="text-sm text-muted-foreground">
                    Available across all Bangladesh divisions
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {equipment.divisions.map((division) => (
                      <span
                        key={division}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs"
                      >
                        {division}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-6 rounded-xl bg-secondary p-5">
                <p className="text-xs font-medium text-secondary-foreground/80">
                  Daily Rental Price
                </p>

                <p className="mt-1 text-3xl font-bold text-primary">
                  ৳{equipment.dailyPrice.toLocaleString("en-BD")}

                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /day
                  </span>
                </p>
              </div>

              {/* Available Quantity */}
              <div className="mt-5 flex items-center justify-between gap-3 border-b border-border pb-5">
                <div className="flex items-center gap-2 text-sm">
                  <Package
                    size={18}
                    className="text-primary"
                  />
                  Available Quantity
                </div>

                <span
                  className={`text-sm font-semibold ${
                    available
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {available
                    ? `${equipment.availableQuantity} units`
                    : "Unavailable"}
                </span>
              </div>

              {/* Added Date */}
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={16} />

                <span>
                  Listed on{" "}
                  {new Date(
                    equipment.createdAt
                  ).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* =============================
                EQUIPMENT DESCRIPTION
            ============================= */}

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-xl font-bold">
                Equipment Description
              </h2>

              {equipment.descriptionHtml ? (
                <div
                  className="
                    space-y-3 text-sm leading-7
                    text-foreground/85
                    [&_h2]:mt-5
                    [&_h2]:text-xl
                    [&_h2]:font-bold
                    [&_h3]:mt-4
                    [&_h3]:text-lg
                    [&_h3]:font-semibold
                    [&_ul]:list-disc
                    [&_ul]:pl-6
                    [&_ol]:list-decimal
                    [&_ol]:pl-6
                    [&_blockquote]:border-l-4
                    [&_blockquote]:border-primary
                    [&_blockquote]:pl-4
                  "
                  dangerouslySetInnerHTML={{
                    __html: equipment.descriptionHtml,
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No description provided.
                </p>
              )}
            </div>
          </div>

          {/* =============================
              RIGHT: BOOKING FORM
          ============================= */}

          <aside className="min-w-0 lg:sticky lg:top-24">
            <BookingRequestForm
              equipmentId={equipment._id}
              dailyPrice={equipment.dailyPrice}
              availableQuantity={equipment.availableQuantity}
              viewerRole={viewerRole}
              isLoggedIn={isLoggedIn}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
