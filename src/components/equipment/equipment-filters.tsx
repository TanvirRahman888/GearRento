"use client";

import { useEffect, useRef, type ChangeEvent, type FormEvent } from "react";

import { useRouter } from "next/navigation";

import { Search, SlidersHorizontal } from "lucide-react";

import {
  equipmentCategories,
  rentalDivisions,
  equipmentConditions,
  type EquipmentFilters,
} from "@/lib/equipment";

type Props = {
  filters: EquipmentFilters;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function EquipmentFiltersPanel({ filters }: Props) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =====================================
  // Clear pending debounce
  // =====================================

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // =====================================
  // Apply Filters to URL
  // =====================================

  function applyFilters() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const params = new URLSearchParams();

    const filterKeys = [
      "q",
      "category",
      "division",
      "condition",
      "minPrice",
      "maxPrice",
      "sort",
    ];

    filterKeys.forEach((key) => {
      const value = String(formData.get(key) || "").trim();

      if (value) {
        params.set(key, value);
      }
    });

    // Page is omitted, so pagination resets to 1.
    const query = params.toString();

    const url = query ? `/equipment?${query}` : "/equipment";

    router.replace(url, {
      scroll: false,
    });
  }

  // =====================================
  // Filter Change Handler
  // =====================================

  function handleFilterChange(event: ChangeEvent<HTMLFormElement>) {
    const fieldName = event.target.getAttribute("name");

    if (!fieldName) return;

    clearTimer();

    // Debounce search and price inputs
    if (
      fieldName === "q" ||
      fieldName === "minPrice" ||
      fieldName === "maxPrice"
    ) {
      timerRef.current = setTimeout(() => {
        applyFilters();
      }, 500);

      return;
    }

    // Select dropdowns apply immediately
    applyFilters();
  }

  // =====================================
  // Handle Enter Key Submission
  // =====================================

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearTimer();
    applyFilters();
  }

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      {/* Heading */}
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={19} className="text-primary" />

        <h2 className="font-semibold">Filters</h2>
      </div>

      <form
        ref={formRef}
        action="/equipment"
        method="GET"
        onChange={handleFilterChange}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Search */}
        <div>
          <label
            htmlFor="equipment-search"
            className="mb-2 block text-sm font-medium"
          >
            Search Equipment
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="equipment-search"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="Camera, generator..."
              maxLength={100}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="equipment-category"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>

          <select
            id="equipment-category"
            name="category"
            defaultValue={filters.category}
            className={inputClass}
          >
            <option value="">All Categories</option>

            {equipmentCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Division */}
        <div>
          <label
            htmlFor="equipment-division"
            className="mb-2 block text-sm font-medium"
          >
            Rental Division
          </label>

          <select
            id="equipment-division"
            name="division"
            defaultValue={filters.division}
            className={inputClass}
          >
            <option value="">All Divisions</option>

            {rentalDivisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
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
            defaultValue={filters.condition}
            className={inputClass}
          >
            <option value="">All Conditions</option>

            {equipmentConditions.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <p className="mb-2 text-sm font-medium">Daily Rental Price (৳)</p>

          <div className="grid grid-cols-2 gap-2">
            {/* Minimum Price */}
            <div>
              <label
                htmlFor="min-price"
                className="mb-1 block text-xs text-muted-foreground"
              >
                Minimum
              </label>

              <input
                id="min-price"
                name="minPrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={filters.minPrice}
                placeholder="0"
                className={inputClass}
              />
            </div>

            {/* Maximum Price */}
            <div>
              <label
                htmlFor="max-price"
                className="mb-1 block text-xs text-muted-foreground"
              >
                Maximum
              </label>

              <input
                id="max-price"
                name="maxPrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={filters.maxPrice}
                placeholder="Any"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div>
          <label
            htmlFor="equipment-sort"
            className="mb-2 block text-sm font-medium"
          >
            Sort By
          </label>

          <select
            id="equipment-sort"
            name="sort"
            defaultValue={filters.sort}
            className={inputClass}
          >
            <option value="newest">Newest First</option>

            <option value="oldest">Oldest First</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Clear Filters */}
        <a
          href="/equipment"
          className="block rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-accent"
        >
          Clear All Filters
        </a>
      </form>

      {/* Auto Filter Message */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Filters apply automatically
      </p>
    </aside>
  );
}
