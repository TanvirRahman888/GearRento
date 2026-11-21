"use client";

import { useRef, useState, type FormEvent } from "react";

import { Loader2, PackagePlus, Plus, Trash2, ImageIcon } from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { MultiSelect } from "./multi-select";
import { RichTextEditor } from "./rich-text-editor";

// 7 original categories + 7 new categories
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

type ImageRow = {
  id: number;
  url: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function AddEquipmentForm() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);

  const [imageRows, setImageRows] = useState<ImageRow[]>([{ id: 0, url: "" }]);

  const nextImageId = useRef(1);

  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [descriptionText, setDescriptionText] = useState("");

  const [editorVersion, setEditorVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Add another image field
  function addImageField() {
    if (imageRows.length >= 5) return;

    setImageRows((current) => [
      ...current,
      {
        id: nextImageId.current++,
        url: "",
      },
    ]);
  }

  // Update a particular image URL
  function updateImage(id: number, url: string) {
    setImageRows((current) =>
      current.map((image) => (image.id === id ? { ...image, url } : image)),
    );
  }

  // Remove an image field
  function removeImage(id: number) {
    setImageRows((current) => current.filter((image) => image.id !== id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const imageUrls = imageRows.map((image) => image.url.trim());

    const equipment = {
      name: String(formData.get("name") || "").trim(),
      categories: selectedCategories,
      condition: String(formData.get("condition") || ""),
      divisions: selectedDivisions,
      descriptionHtml,
      dailyPrice: Number(formData.get("dailyPrice")),
      quantity: Number(formData.get("quantity")),
      imageUrls,
    };

    // Required fields
    if (
      equipment.name.length < 3 ||
      equipment.categories.length === 0 ||
      equipment.divisions.length === 0 ||
      !conditions.some((item) => item.value === equipment.condition)
    ) {
      toast.error("Please complete all required equipment details.");
      return;
    }

    // Rich text validation
    if (descriptionText.trim().length < 20 || descriptionText.length > 3000) {
      toast.error("Description must contain 20–3000 characters.");
      return;
    }

    // Price and quantity
    if (
      !Number.isFinite(equipment.dailyPrice) ||
      equipment.dailyPrice <= 0 ||
      !Number.isInteger(equipment.quantity) ||
      equipment.quantity < 1
    ) {
      toast.error("Enter a valid daily price and quantity.");
      return;
    }

    // Image validation
    if (
      imageUrls.length < 1 ||
      imageUrls.length > 5 ||
      imageUrls.some((url) => !isValidUrl(url))
    ) {
      toast.error("Provide between 1 and 5 valid image URLs.");
      return;
    }

    setIsLoading(true);

    try {
      // Obtain a signed JWT using the Better Auth session
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please sign in again.");
        return;
      }

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      if (!apiURL) {
        toast.error("Equipment API URL is not configured.");
        return;
      }

      // Express verifies the JWT and Owner permission
      const response = await fetch(
        `${apiURL.replace(/\/$/, "")}/equipment/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify(equipment),
        },
      );

      const result: { error?: string; message?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        toast.error(result.error || "Unable to add equipment.");
        return;
      }

      toast.success("Equipment submitted for approval!");

      // Reset the form
      form.reset();
      setSelectedCategories([]);
      setSelectedDivisions([]);
      setImageRows([{ id: nextImageId.current++, url: "" }]);
      setDescriptionHtml("");
      setDescriptionText("");
      setEditorVersion((version) => version + 1);
    } catch (error) {
      console.error("Equipment submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
    >
      <div>
        <h2 className="text-lg font-semibold">Equipment Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the details to submit a rental listing.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="equipment-name"
            className="mb-2 block text-sm font-medium"
          >
            Equipment Name
          </label>
          <input
            id="equipment-name"
            name="name"
            required
            minLength={3}
            maxLength={120}
            placeholder="e.g. Professional DSLR Camera"
            className={inputClass}
          />
        </div>

        {/* Multiple Categories */}
        <div>
          <MultiSelect
            label="Categories"
            options={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select categories"
            disabled={isLoading}
          />
        </div>

        {/* Condition */}
        <div>
          <label
            htmlFor="equipment-condition"
            className="mb-2 block text-sm font-medium"
          >
            Equipment Condition
          </label>
          <select
            id="equipment-condition"
            name="condition"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select condition
            </option>
            {conditions.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Price */}
        <div>
          <label
            htmlFor="daily-price"
            className="mb-2 block text-sm font-medium"
          >
            Daily Rental Price (৳)
          </label>
          <input
            id="daily-price"
            name="dailyPrice"
            type="number"
            required
            min="0.01"
            max="1000000"
            step="0.01"
            placeholder="500"
            className={inputClass}
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="equipment-quantity"
            className="mb-2 block text-sm font-medium"
          >
            Available Quantity
          </label>
          <input
            id="equipment-quantity"
            name="quantity"
            type="number"
            required
            min="1"
            max="10000"
            step="1"
            placeholder="1"
            className={inputClass}
          />
        </div>

        {/* Multiple Divisions */}
        <div className="sm:col-span-2">
          <MultiSelect
            label="Available Rental Divisions"
            options={divisions}
            value={selectedDivisions}
            onChange={setSelectedDivisions}
            placeholder="Select rental divisions"
            selectAllLabel="All Divisions"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Select where customers can rent this equipment.
          </p>
        </div>
      </div>

      {/* Dynamic Image URL Inputs */}
      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Equipment Images</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Add between 1 and 5 image URLs.
            </p>
          </div>

          <button
            type="button"
            onClick={addImageField}
            disabled={isLoading || imageRows.length >= 5}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Image ({imageRows.length}/5)
          </button>
        </div>

        {imageRows.map((image, index) => (
          <div key={image.id}>
            <label
              htmlFor={`image-${image.id}`}
              className="mb-2 block text-sm font-medium"
            >
              Image {index + 1}
              {index === 0 ? " (Cover Image)" : ""}
            </label>

            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <ImageIcon
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary"
                />

                <input
                  id={`image-${image.id}`}
                  type="url"
                  value={image.url}
                  onChange={(event) =>
                    updateImage(image.id, event.target.value)
                  }
                  required
                  disabled={isLoading}
                  placeholder="https://example.com/equipment.jpg"
                  className={`${inputClass} pl-11`}
                />
              </div>

              {imageRows.length > 1 && (
                <button
                  type="button"
                  title="Remove image"
                  aria-label={`Remove image ${index + 1}`}
                  disabled={isLoading}
                  onClick={() => removeImage(image.id)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-destructive/25 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rich Text Description */}
      <div className="space-y-3 border-t border-border pt-6">
        <div>
          <h3 className="text-base font-semibold">Equipment Description</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Describe the equipment, accessories, and rental conditions.
          </p>
        </div>

        <RichTextEditor
          key={editorVersion}
          onChange={(html, text) => {
            setDescriptionHtml(html);
            setDescriptionText(text);
          }}
        />

        <p className="text-right text-xs text-muted-foreground">
          {descriptionText.length}/3000 characters
        </p>
      </div>

      <div className="rounded-xl border border-primary/15 bg-secondary p-4 text-sm text-secondary-foreground">
        Your listing will be reviewed by an administrator before appearing in
        the public equipment catalog.
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground hover:bg-cta/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PackagePlus size={18} />
              Submit Equipment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
