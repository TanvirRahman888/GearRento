"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type PendingEquipment = {
  _id: string;
  name: string;
  categories: string[];
  divisions: string[];
  condition: string;
  dailyPrice: number;
  quantity: number;
  imageUrls: string[];
  ownerId: string;
  descriptionText: string;
  createdAt: string;
};

type Pagination = {
  page: number;
  total: number;
  totalPages: number;
};

type EquipmentResponse = {
  equipment?: PendingEquipment[];
  pagination?: Pagination;
  error?: string;
};

const apiURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

function EquipmentPhoto({ url, name }: { url?: string; name: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
      {url && !failed ? (
        <Image
          src={url}
          alt={name}
          fill
          unoptimized
          sizes="48px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageIcon size={20} className="text-muted-foreground" />
      )}
    </div>
  );
}

export function EquipmentApprovalsTable() {
  const [equipment, setEquipment] = useState<PendingEquipment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // ======================================
  // Load Pending Equipment
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadEquipment() {
      try {
        const { data, error } = await authClient.token();

        if (controller.signal.aborted) return;

        if (error || !data?.token) {
          throw new Error("Please log in again.");
        }

        if (!apiURL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${apiURL}/equipment/pending?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result = (await response.json()) as EquipmentResponse;

        if (!response.ok) {
          throw new Error(result.error || "Unable to load equipment.");
        }

        if (controller.signal.aborted) return;

        setEquipment(result.equipment ?? []);
        setPagination(result.pagination ?? null);
        setErrorMessage("");
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadEquipment();

    return () => controller.abort();
  }, [page, reloadKey]);

  function refresh() {
    setLoading(true);
    setReloadKey((current) => current + 1);
  }

  // ======================================
  // Submit Approval / Rejection
  // ======================================

  async function submitReview(
    id: string,
    decision: "approve" | "reject",
    rejectionReason = "",
  ) {
    if (busyId) return;

    setBusyId(id);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Please sign in again.");
      }

      if (!apiURL) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${apiURL}/equipment/review/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          decision,
          reason: rejectionReason,
        }),
      });

      const result: {
        error?: string;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to review equipment.");
      }

      toast.success(result.message || "Review completed successfully.");

      setExpandedId(null);
      setRejectingId(null);
      setReason("");

      // Return to previous page if this was
      // the last listing on the current page.
      if (equipment.length === 1 && page > 1) {
        setLoading(true);
        setPage((current) => current - 1);
      } else {
        refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Review failed.");
    } finally {
      setBusyId(null);
    }
  }

  // ======================================
  // Confirm Approval Using Sonner
  // ======================================

  function confirmApproval(item: PendingEquipment) {
    toast.warning(`Approve "${item.name}"?`, {
      description:
        "This listing will be eligible to appear in the public marketplace.",
      duration: Infinity,
      id: `approve-${item._id}`,
      action: {
        label: "Approve",
        onClick: () => {
          void submitReview(item._id, "approve");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  // ======================================
  // Confirm Rejection Using Sonner
  // ======================================

  function confirmRejection(item: PendingEquipment) {
    const cleanReason = reason.trim();

    if (cleanReason.length < 5 || cleanReason.length > 500) {
      toast.error("Rejection reason must be 5–500 characters.");
      return;
    }

    toast.warning(`Reject "${item.name}"?`, {
      description: "The owner will be able to see the rejection reason.",
      duration: Infinity,
      id: `reject-${item._id}`,
      action: {
        label: "Reject",
        onClick: () => {
          void submitReview(item._id, "reject", cleanReason);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Pending Equipment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination
              ? `${pagination.total} listings awaiting review`
              : "Review equipment submitted by owners"}
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading || busyId !== null}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-card p-5"
        >
          <p className="font-semibold text-destructive">
            Unable to load approvals
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !errorMessage && equipment.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <Check size={36} className="mx-auto text-primary" />
          <h3 className="mt-3 font-semibold">No pending equipment</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            All submitted listings have been reviewed.
          </p>
        </div>
      )}

      {/* Approvals Table */}
      {!loading && !errorMessage && equipment.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Equipment
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Owner
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Price / Day
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Submitted
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {equipment.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <EquipmentPhoto
                          url={item.imageUrls?.[0]}
                          name={item.name}
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.categories.join(", ")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span title={item.ownerId}>
                        {item.ownerId.slice(0, 12)}...
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-primary">
                      ৳{item.dailyPrice.toLocaleString("en-BD")}
                    </td>

                    <td className="px-4 py-3">{item.quantity}</td>

                    <td className="px-4 py-3 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("en-BD")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View Details"
                          aria-label={`View ${item.name}`}
                          onClick={() =>
                            setExpandedId(
                              expandedId === item._id ? null : item._id,
                            )
                          }
                          className="rounded-lg border border-border p-2 text-primary hover:bg-secondary"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => confirmApproval(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50"
                        >
                          {busyId === item._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Check size={15} />
                          )}
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => {
                            setExpandedId(item._id);
                            setRejectingId(item._id);
                            setReason("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Review Details */}
          {equipment
            .filter((item) => item._id === expandedId)
            .map((item) => (
              <div
                key={item._id}
                className="space-y-4 border-t border-border bg-muted/20 p-5"
              >
                <h3 className="font-semibold">Review: {item.name}</h3>

                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Condition</p>
                    <p>{item.condition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rental Divisions</p>
                    <p>{item.divisions.join(", ")}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Description</p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {item.descriptionText}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.imageUrls.map((url, index) => (
                    <a
                      key={`${url}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border px-3 py-2 text-xs text-primary hover:bg-secondary"
                    >
                      View Image {index + 1}
                    </a>
                  ))}
                </div>

                {rejectingId === item._id && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <label
                      htmlFor="rejection-reason"
                      className="block text-sm font-semibold"
                    >
                      Reason for Rejection
                    </label>

                    <textarea
                      id="rejection-reason"
                      rows={3}
                      maxLength={500}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder="Explain what the owner needs to correct..."
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => confirmRejection(item)}
                        disabled={busyId !== null}
                        className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Confirm Rejection
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(null);
                          setReason("");
                        }}
                        className="rounded-lg border border-border px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !errorMessage && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || busyId !== null}
              onClick={() => {
                setLoading(true);
                setPage((current) => current - 1);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages || busyId !== null}
              onClick={() => {
                setLoading(true);
                setPage((current) => current + 1);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
