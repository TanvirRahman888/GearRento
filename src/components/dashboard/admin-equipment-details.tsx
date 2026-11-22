
import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";

import type {
  AdminEquipment,
} from "./admin-equipment-types";

type Props = {
  equipment: AdminEquipment;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export function AdminEquipmentDetails({
  equipment,
}: Props) {
  return (
    <div className="grid gap-6 rounded-xl bg-muted/40 p-4 lg:grid-cols-2">

      {/* Equipment Information */}
      <div className="space-y-5">
        <div>
          <h3 className="mb-3 font-semibold">
            Equipment Information
          </h3>

          <p className="text-xs text-muted-foreground">
            Description
          </p>

          <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6">
            {equipment.descriptionText ||
              "No description available."}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Categories
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {equipment.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Available Rental Divisions
            </p>

            <p className="mt-1 text-sm font-medium">
              {equipment.divisions.join(", ") || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Package
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Inventory
            </p>

            <p className="mt-1 text-sm">
              Total Quantity:{" "}
              <strong>{equipment.quantity}</strong>
            </p>

            <p className="mt-1 text-sm">
              Available Quantity:{" "}
              <strong>
                {equipment.availableQuantity}
              </strong>
            </p>

            <p className="mt-1 text-sm">
              Condition:{" "}
              <strong className="capitalize">
                {equipment.condition.replaceAll("-", " ")}
              </strong>
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Daily Rental Price
          </p>

          <p className="mt-1 text-xl font-bold text-primary">
            ৳{equipment.dailyPrice.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      {/* Owner, Review, and Dates */}
      <div className="space-y-5">
        <h3 className="font-semibold">
          Owner & Review Information
        </h3>

        <div className="flex items-start gap-2">
          <UserRound
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Equipment Owner
            </p>

            <p className="mt-1 text-sm font-semibold">
              {equipment.owner?.name ||
                "Deleted or unavailable account"}
            </p>

            {equipment.owner?.email && (
              <p className="mt-1 break-all text-xs text-muted-foreground">
                {equipment.owner.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays
            size={17}
            className="mt-0.5 shrink-0 text-primary"
          />

          <div>
            <p className="text-xs text-muted-foreground">
              Listing Timeline
            </p>

            <p className="mt-1 text-sm">
              Created: {formatDate(equipment.createdAt)}
            </p>

            <p className="mt-1 text-sm">
              Updated: {formatDate(equipment.updatedAt)}
            </p>

            {equipment.reviewedAt && (
              <p className="mt-1 text-sm">
                Reviewed: {formatDate(equipment.reviewedAt)}
              </p>
            )}
          </div>
        </div>

        {equipment.reviewReason && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Review / Withdrawal Reason
            </p>

            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-amber-800 dark:text-amber-200">
              {equipment.reviewReason}
            </p>
          </div>
        )}

        <div className="space-y-2 border-t border-border pt-4 text-xs">
          <p>
            <strong>Equipment ID:</strong>{" "}
            <span className="break-all">
              {equipment._id}
            </span>
          </p>

          <p>
            <strong>Owner ID:</strong>{" "}
            <span className="break-all">
              {equipment.ownerId || "—"}
            </span>
          </p>
        </div>

        {equipment.status === "approved" && (
          <Link
            href={`/equipment/${equipment._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Open Public Equipment Page
            <ArrowUpRight size={16} />
          </Link>
        )}

        {equipment.status === "pending" && (
          <Link
            href="/dashboard/equipment-approvals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Go to Equipment Approvals
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
