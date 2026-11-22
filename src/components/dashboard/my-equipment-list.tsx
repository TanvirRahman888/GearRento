
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Eye,
  Pencil,
  Trash2,
  PackagePlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import type {
  Equipment,
  EquipmentPagination,
} from "./equipment-types";

import { EquipmentDialog } from "./equipment-dialog";

type EquipmentResponse = {
  success: boolean;
  equipment: Equipment[];
  pagination: EquipmentPagination;
  error?: string;
};

function getStatus(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        className:
          "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      };
    case "rejected":
      return {
        label: "Rejected",
        className:
          "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };
    default:
      return {
        label: "Pending Review",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
  }
}

function EquipmentThumbnail({
  url,
  name,
}: {
  url?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
      {url && !failed ? (
        <Image
          src={url}
          alt={name}
          fill
          unoptimized
          sizes="56px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageIcon size={22} className="text-muted-foreground" />
      )}
    </div>
  );
}

export function MyEquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [pagination, setPagination] =
    useState<EquipmentPagination | null>(null);

  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Selected equipment dialog
  const [dialogMode, setDialogMode] =
    useState<"view" | "edit" | null>(null);
  const [selectedEquipment, setSelectedEquipment] =
    useState<Equipment | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const apiURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  // =====================================
  // Fetch equipment belonging to Owner
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadEquipment() {
      try {
        const { data, error } = await authClient.token();

        if (controller.signal.aborted) return;

        if (error || !data?.token) {
          throw new Error("Please sign in again.");
        }

        if (!apiURL) {
          throw new Error("Equipment API URL is not configured.");
        }

        const response = await fetch(
          `${apiURL}/equipment/mine?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result =
          (await response.json()) as EquipmentResponse;

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load equipment."
          );
        }

        if (controller.signal.aborted) return;

        setEquipment(result.equipment);
        setPagination(result.pagination);
        setErrorMessage("");
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load equipment."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadEquipment();

    return () => controller.abort();
  }, [page, reloadKey, apiURL]);

  function refreshEquipment() {
    setIsLoading(true);
    setReloadKey((current) => current + 1);
  }

  // =====================================
  // Open View / Edit dialog
  // =====================================

  async function openEquipment(
    id: string,
    mode: "view" | "edit"
  ) {
    setSelectedEquipment(null);
    setDialogMode(mode);
    setDialogLoading(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      if (!apiURL) {
        throw new Error("Equipment API is not configured.");
      }

      const response = await fetch(
        `${apiURL}/equipment/mine/${id}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        }
      );

      const result: {
        equipment?: Equipment;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.equipment) {
        throw new Error(
          result.error || "Unable to open equipment."
        );
      }

      setSelectedEquipment(result.equipment);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to open equipment."
      );
      setDialogMode(null);
    } finally {
      setDialogLoading(false);
    }
  }

  // =====================================
  // Delete equipment
  // =====================================

 
  // =====================================
  // 1. Show Delete Confirmation Toast
  // =====================================

  function handleDelete(item: Equipment) {
    if (deletingId) return;

    toast.warning(`Delete "${item.name}"?`, {
      description:
        "This equipment will be permanently deleted. This action cannot be undone.",

      duration: Infinity,

      // Prevent duplicate confirmation toasts
      id: `delete-equipment-${item._id}`,

      action: {
        label: "Yes, Delete",
        onClick: () => {
          void confirmDelete(item);
        },
      },

      cancel: {
        label: "Cancel",
        onClick: () => {
          // No deletion. Sonner closes the toast.
        },
      },
    });
  }

  // =====================================
  // 2. Delete Equipment After Confirmation
  // =====================================

  async function confirmDelete(item: Equipment) {
    if (deletingId) return;

    setDeletingId(item._id);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      if (!apiURL) {
        throw new Error("Equipment API is not configured.");
      }

      const response = await fetch(
        `${apiURL}/equipment/mine/${item._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result: { error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to delete equipment."
        );
      }

      toast.success("Equipment deleted successfully!");

      // If last item on the current page was deleted,
      // navigate to the previous page.
      if (equipment.length === 1 && page > 1) {
        setIsLoading(true);
        setPage((current) => current - 1);
      } else {
        refreshEquipment();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete equipment."
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <div className="space-y-5">
      {/* Page tools */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">
            Equipment Listings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination
              ? `${pagination.total} equipment listings`
              : "Manage your rental inventory"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshEquipment}
            disabled={isLoading}
            aria-label="Refresh equipment"
            className="flex size-10 items-center justify-center rounded-xl border border-border hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>

          <Link
            href="/dashboard/add-equipment"
            className="inline-flex items-center gap-2 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground hover:bg-cta/90"
          >
            <PackagePlus size={17} />
            Add Equipment
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-card p-6"
        >
          <p className="font-semibold text-destructive">
            Unable to load equipment
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={refreshEquipment}
            className="mt-4 rounded-lg border px-4 py-2 text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !errorMessage &&
        equipment.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h3 className="font-semibold">
              No equipment found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first equipment to get started.
            </p>
          </div>
        )}

      {/* =====================================
          EQUIPMENT MANAGEMENT TABLE
      ===================================== */}

      {!isLoading && !errorMessage &&
        equipment.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-220 text-left text-sm">
                <thead className="border-b border-border bg-muted/60">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-4 py-4">
                      Equipment
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Categories
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Price / Day
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {equipment.map((item) => {
                    const status = getStatus(item.status);

                    return (
                      <tr
                        key={item._id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        {/* Equipment thumbnail + name */}
                        <td className="px-4 py-3">
                          <div className="flex min-w-50 items-center gap-3">
                            <EquipmentThumbnail
                              key={`${item._id}-${item.imageUrls?.[0] ?? ""}`}
                              name={item.name}
                              url={item.imageUrls?.[0]}
                            />
                            <div className="min-w-0">
                              <p className="max-w-42.5 truncate font-semibold">
                                {item.name}
                              </p>
                              <p className="mt-1 max-w-42.5 truncate text-xs text-muted-foreground">
                                {item.divisions.join(", ")}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Categories */}
                        <td className="px-4 py-3">
                          <div className="flex max-w-40 flex-wrap gap-1">
                            {item.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                              >
                                {category}
                              </span>
                            ))}
                            {item.categories.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{item.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary">
                          ৳{item.dailyPrice.toLocaleString("en-BD")}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3">
                          {item.availableQuantity} / {item.quantity}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View Equipment"
                              aria-label={`View ${item.name}`}
                              onClick={() =>
                                openEquipment(item._id, "view")
                              }
                              className="flex size-9 items-center justify-center rounded-lg border border-border text-primary hover:bg-secondary"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Update Equipment"
                              aria-label={`Update ${item.name}`}
                              onClick={() =>
                                openEquipment(item._id, "edit")
                              }
                              className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-accent"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              title="Delete Equipment"
                              aria-label={`Delete ${item.name}`}
                              disabled={deletingId !== null}
                              onClick={() => handleDelete(item)}
                              className="flex size-9 items-center justify-center rounded-lg border border-destructive/25 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            >
                              {deletingId === item._id ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              Showing {equipment.length} of {pagination?.total ?? equipment.length} listings
            </div>
          </div>
        )}

      {/* Pagination */}
      {!isLoading && !errorMessage &&
        pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setIsLoading(true);
                  setPage((p) => p - 1);
                }}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => {
                  setIsLoading(true);
                  setPage((p) => p + 1);
                }}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      {/* View / Update dialog */}
      <EquipmentDialog
        mode={dialogMode}
        equipment={selectedEquipment}
        loading={dialogLoading}
        onClose={() => {
          setDialogMode(null);
          setSelectedEquipment(null);
        }}
        onUpdated={() => {
          setDialogMode(null);
          setSelectedEquipment(null);
          refreshEquipment();
        }}
      />
    </div>
  );
}
