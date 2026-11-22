
"use client";

import { useState } from "react";
import Image from "next/image";

import {
  ImageIcon,
  MapPin,
  Package,
  Tag,
} from "lucide-react";

export type PublicEquipment = {
  _id: string;
  name: string;
  categories: string[];
  condition: string;
  divisions: string[];
  imageUrls: string[];
  dailyPrice: number;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
};

type EquipmentCardProps = {
  equipment: PublicEquipment;
};

function EquipmentImage({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-muted">
      {imageUrl && !failed ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageIcon
          size={42}
          className="text-muted-foreground/40"
        />
      )}
    </div>
  );
}

export function EquipmentCard({
  equipment,
}: EquipmentCardProps) {
  const {
    name,
    categories,
    condition,
    divisions,
    imageUrls,
    dailyPrice,
    availableQuantity,
  } = equipment;

  const conditionLabel = condition
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const divisionLabel =
    divisions.length === 8
      ? "All Bangladesh Divisions"
      : divisions.length <= 2
        ? divisions.join(", ")
        : `${divisions.slice(0, 2).join(", ")} +${divisions.length - 2} more`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      {/* Cover Image */}
      <EquipmentImage
        key={imageUrls[0] ?? ""}
        imageUrl={imageUrls[0]}
        name={name}
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Condition and Availability */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {conditionLabel}
          </span>

          <span
            className={`text-xs font-medium ${
              availableQuantity > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {availableQuantity > 0
              ? `${availableQuantity} available`
              : "Currently unavailable"}
          </span>
        </div>

        {/* Equipment Name */}
        <h3 className="line-clamp-2 text-base font-bold text-foreground">
          {name}
        </h3>

        {/* Categories */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Tag size={14} className="text-primary" />

          {categories.slice(0, 2).map((category) => (
            <span
              key={category}
              className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80"
            >
              {category}
            </span>
          ))}

          {categories.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{categories.length - 2}
            </span>
          )}
        </div>

        {/* Rental Divisions */}
        <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin size={15} className="shrink-0 text-primary" />

          <span>{divisionLabel}</span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Rental price
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              ৳{dailyPrice.toLocaleString("en-BD")}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                /day
              </span>
            </p>
          </div>

          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
            <Package size={19} />
          </div>
        </div>
      </div>
    </article>
  );
}
