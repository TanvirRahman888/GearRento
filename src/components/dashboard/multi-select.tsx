
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type MultiSelectProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  selectAllLabel?: string;
  disabled?: boolean;
};

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  selectAllLabel,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const allSelected =
    options.length > 0 &&
    options.every((option) => value.includes(option));

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function toggleOption(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  }

  function toggleAll() {
    onChange(allSelected ? [] : [...options]);
  }

  const selectedLabel =
    allSelected && selectAllLabel
      ? selectAllLabel
      : value.length === 0
        ? placeholder
        : `${value.length} selected`;

  return (
    <div ref={containerRef} className="relative min-w-0">
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-60"
      >
        <span
          className={`truncate ${
            value.length === 0
              ? "text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {selectedLabel}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {item}
            </span>
          ))}

          {value.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
              +{value.length - 3} more
            </span>
          )}
        </div>
      )}

      {open && (
        <div
          id={listId}
          className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-xl"
        >
          {selectAllLabel && (
            <label className="mb-1 flex cursor-pointer items-center gap-3 rounded-lg border-b border-border px-3 py-3 text-sm font-semibold hover:bg-accent">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="size-4 accent-primary"
              />
              {selectAllLabel}
            </label>
          )}

          {options.map((option) => {
            const checked = value.includes(option);

            return (
              <label
                key={option}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(option)}
                    className="size-4 accent-primary"
                  />
                  <span>{option}</span>
                </span>

                {checked && (
                  <Check size={15} className="shrink-0 text-primary" />
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
