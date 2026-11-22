"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";

import { X, ImageIcon, Plus, Trash2, Save, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import { MultiSelect } from "./multi-select";
import { RichTextEditor } from "./rich-text-editor";
import type { Equipment } from "./equipment-types";

const categories = [
  "Photography",
  "Power Tools",
  "Camping",
  "Audio & Video",
  "Events",
  "Sports",
  "Other",
  "Construction Equipment",
  "Gardening",
  "Computers & IT",
  "Home Appliances",
  "Musical Instruments",
  "Medical Equipment",
  "Automotive",
];

const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const conditions = [
  { value: "new", label: "Brand New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "very-good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "refurbished", label: "Refurbished" },
  { value: "used-tested", label: "Used & Tested" },
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

type EquipmentDialogProps = {
  mode: "view" | "edit" | null;
  equipment: Equipment | null;
  loading: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

function validImageUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

// =====================================
// View Equipment Details
// =====================================

function EquipmentDetails({ item }: { item: Equipment }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {item.imageUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-muted"
          >
            {url ? (
              <Image
                src={url}
                alt={`${item.name} image ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
            ) : (
              <ImageIcon size={28} />
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold">{item.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Approval Status: {item.status}
        </p>
      </div>

      <div className="grid gap-4 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground">Daily Price</p>
          <p className="font-semibold">
            ৳{item.dailyPrice.toLocaleString("en-BD")}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Condition</p>
          <p className="font-semibold">{item.condition}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Quantity</p>
          <p className="font-semibold">{item.quantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Available Quantity</p>
          <p className="font-semibold">{item.availableQuantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Categories</p>
          <p className="font-semibold">{item.categories.join(", ")}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Rental Divisions</p>
          <p className="font-semibold">{item.divisions.join(", ")}</p>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold">Equipment Description</h4>
        <div
          className="space-y-2 rounded-xl border border-border p-4 text-sm leading-7 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
          dangerouslySetInnerHTML={{
            __html: item.descriptionHtml || "",
          }}
        />
      </div>
    </div>
  );
}

// =====================================
// Update Equipment Form
// =====================================

function EquipmentEditForm({
  item,
  onUpdated,
  onCancel,
}: {
  item: Equipment;
  onUpdated: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [selectedCategories, setSelectedCategories] = useState(item.categories);
  const [condition, setCondition] = useState(item.condition);
  const [selectedDivisions, setSelectedDivisions] = useState(item.divisions);
  const [dailyPrice, setDailyPrice] = useState(String(item.dailyPrice));
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [imageUrls, setImageUrls] = useState(
    item.imageUrls.length ? item.imageUrls : [""],
  );

  const [descriptionHtml, setDescriptionHtml] = useState(
    item.descriptionHtml || "",
  );

  const [descriptionText, setDescriptionText] = useState(
    item.descriptionText ||
      (item.descriptionHtml || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
  );

  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const priceNumber = Number(dailyPrice);
    const quantityNumber = Number(quantity);
    const urls = imageUrls.map((url) => url.trim());

    if (
      name.trim().length < 3 ||
      name.trim().length > 120 ||
      selectedCategories.length === 0 ||
      selectedDivisions.length === 0 ||
      !conditions.some((option) => option.value === condition)
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (descriptionText.trim().length < 20 || descriptionText.length > 3000) {
      toast.error("Description must be 20–3000 characters.");
      return;
    }

    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0 ||
      priceNumber > 1000000 ||
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 1 ||
      quantityNumber > 10000
    ) {
      toast.error("Enter a valid price and quantity.");
      return;
    }

    if (
      urls.length < 1 ||
      urls.length > 5 ||
      urls.some((url) => !validImageUrl(url) || url.length > 1000)
    ) {
      toast.error("Provide 1–5 valid image URLs.");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        throw new Error("Equipment API is not configured.");
      }

      const response = await fetch(
        `${apiURL.replace(/\/$/, "")}/equipment/mine/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            categories: selectedCategories,
            condition,
            divisions: selectedDivisions,
            dailyPrice: priceNumber,
            quantity: quantityNumber,
            imageUrls: urls,
            descriptionHtml,
          }),
        },
      );

      const result: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Equipment update failed.");
      }

      toast.success("Equipment updated successfully.", {
        description: "Your listing is pending review.",
      });

      onUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update equipment.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Equipment Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={3}
          maxLength={120}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MultiSelect
          label="Categories"
          options={categories}
          value={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Select categories"
          disabled={saving}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">Condition</label>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className={inputClass}
          >
            {conditions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Daily Price (৳)
          </label>
          <input
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            required
            value={dailyPrice}
            onChange={(event) => setDailyPrice(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            max="10000"
            step="1"
            required
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <MultiSelect
        label="Rental Divisions"
        options={divisions}
        value={selectedDivisions}
        onChange={setSelectedDivisions}
        placeholder="Select divisions"
        selectAllLabel="All Divisions"
        disabled={saving}
      />

      {/* Dynamic Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Equipment Image URLs</h3>
          <button
            type="button"
            disabled={imageUrls.length >= 5 || saving}
            onClick={() => setImageUrls((current) => [...current, ""])}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary disabled:opacity-40"
          >
            <Plus size={16} />
            Add Image
          </button>
        </div>

        {imageUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="url"
              aria-label={`Image URL ${index + 1}`}
              value={url}
              onChange={(event) =>
                setImageUrls((current) =>
                  current.map((value, i) =>
                    i === index ? event.target.value : value,
                  ),
                )
              }
              required
              className={inputClass}
            />
            {imageUrls.length > 1 && (
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                onClick={() =>
                  setImageUrls((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Rich Text */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Equipment Description</p>

        <RichTextEditor
          initialContent={item.descriptionHtml || ""}
          onChange={(html, text) => {
            setDescriptionHtml(html);
            setDescriptionText(text);
          }}
        />

        <p className="text-right text-xs text-muted-foreground">
          {descriptionText.length}/3000 characters
        </p>
      </div>

      <p className="rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
        Updating equipment will return it to Pending Review.
      </p>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-4 py-2.5 text-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// =====================================
// Shared Native Dialog
// =====================================

export function EquipmentDialog({
  mode,
  equipment,
  loading,
  onClose,
  onUpdated,
}: EquipmentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (mode && !dialog.open) {
      dialog.showModal();
    } else if (!mode && dialog.open) {
      dialog.close();
    }
  }, [mode]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto max-h-[90dvh] w-[min(96vw,850px)] overflow-y-auto rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/55"
    >
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-card px-5 py-4">
        <h2 className="text-lg font-bold">
          {mode === "edit" ? "Update Equipment" : "Equipment Details"}
        </h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close dialog"
          className="rounded-lg p-2 hover:bg-accent"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary" />
            <span>Loading equipment...</span>
          </div>
        ) : equipment ? (
          mode === "edit" ? (
            <EquipmentEditForm
              key={equipment._id}
              item={equipment}
              onUpdated={onUpdated}
              onCancel={() => dialogRef.current?.close()}
            />
          ) : (
            <EquipmentDetails item={equipment} />
          )
        ) : null}
      </div>
    </dialog>
  );
}
