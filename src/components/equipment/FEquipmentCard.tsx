
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  PackageOpen,
} from "lucide-react";

import type { Equipment } from "@/types/equipment";

interface FEquipmentCardProps {
  equipment: Equipment;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(price);

export default function FEquipmentCard({
  equipment,
}: FEquipmentCardProps) {
  const {
    _id,
    name,
    imageUrls,
    categories,
    condition,
    divisions,
    dailyPrice,
    availableQuantity,
    isFeatured,
  } = equipment;

  const image = imageUrls?.[0];
  const category = categories?.[0] || "Equipment";
  const division = divisions?.[0];

  const isAvailable = availableQuantity > 0;

  const conditionLabel = condition
    ?.replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  // Update this path if your equipment detail
  // page uses a different route.
  const detailsHref = `/equipment/${_id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:shadow-black/10">

      {/* ====================================
          Product Image
      ==================================== */}

      <Link
        href={detailsHref}
        className="relative block aspect-4/3 overflow-hidden bg-muted"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <PackageOpen className="size-16 opacity-40" />
          </div>
        )}

        {/* Featured Badge */}

        {isFeatured && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-cta px-3 py-1.5 text-[11px] font-bold text-cta-foreground shadow-sm">
            <BadgeCheck className="size-3.5" />
            Featured
          </span>
        )}

        {/* Stock Status */}

        {!isAvailable && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-semibold text-white">
            Unavailable
          </span>
        )}
      </Link>

      {/* ====================================
          Card Content
      ==================================== */}

      <div className="flex flex-1 flex-col p-4">

        {/* Category and Condition */}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
            {category}
          </span>

          {conditionLabel && (
            <span className="text-[11px] capitalize text-muted-foreground">
              {conditionLabel}
            </span>
          )}
        </div>

        {/* Product Name */}

        <Link
          href={detailsHref}
          className="mt-3 block"
        >
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-card-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        {/* Location */}

        {division && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />

            <span className="truncate">
              {divisions.join(", ")}
            </span>
          </div>
        )}

        {/* Price */}

        <div className="mt-auto pt-4">
          <div className="border-t border-border pt-4">

            <div className="flex items-end justify-between gap-2">

              <div>
                <p className="text-xs text-muted-foreground">
                  Rental price
                </p>

                <div className="mt-1 flex flex-wrap items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight text-primary">
                    ৳{formatPrice(dailyPrice)}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    / day
                  </span>
                </div>
              </div>

              {/* View Product Button */}

              <Link
                href={detailsHref}
                aria-label={`View ${name}`}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-cta text-cta-foreground transition-all hover:brightness-95"
              >
                <ArrowUpRight className="size-5" />
              </Link>

            </div>

            {/* Availability */}

            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`size-2 rounded-full ${
                  isAvailable
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />

              <span className="text-muted-foreground">
                {isAvailable
                  ? `${availableQuantity} available for rent`
                  : "Currently unavailable"}
              </span>
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}
