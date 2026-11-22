
"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  ImageIcon,
  Loader2,
  Package,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import { AdminEquipmentDetails } from "./admin-equipment-details";

import type {
  AdminEquipment,
  AdminEquipmentResponse,
  AdminEquipmentSort,
  AdminEquipmentStatus,
} from "./admin-equipment-types";

// ======================================
// Filter Options
// ======================================

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

// ======================================
// Helpers
// ======================================

function getApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not configured.");
  }

  return apiUrl.replace(/\/+$/, "");
}

async function getAccessToken() {
  const result = await authClient.token();
  const token = result.data?.token;

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return token;
}

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

function getStatusStyles(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      };

    case "pending":
      return {
        label: "Pending",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };

    case "rejected":
      return {
        label: "Rejected",
        className:
          "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      };

    default:
      return {
        label: status,
        className: "bg-muted text-muted-foreground",
      };
  }
}

function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

// ======================================
// Equipment Image
// ======================================

function EquipmentImage({
  equipment,
}: {
  equipment: AdminEquipment;
}) {
  const src =
    equipment.imageUrls.find(isImageUrl) || "";

  const [failedSrc, setFailedSrc] =
    useState<string | null>(null);

  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
      {src && failedSrc !== src ? (
        <Image
          src={src}
          alt={equipment.name}
          fill
          sizes="64px"
          unoptimized
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <ImageIcon
          size={24}
          className="text-muted-foreground"
        />
      )}
    </div>
  );
}

// ======================================
// All Equipment Table
// ======================================

export function AllEquipmentTable() {
  const [equipment, setEquipment] =
    useState<AdminEquipment[]>([]);

  const [stats, setStats] =
    useState<AdminEquipmentResponse["stats"] | null>(
      null
    );

  const [pagination, setPagination] =
    useState<
      AdminEquipmentResponse["pagination"] | null
    >(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<AdminEquipmentStatus>("all");

  const [category, setCategory] = useState("all");
  const [division, setDivision] = useState("all");

  const [sort, setSort] =
    useState<AdminEquipmentSort>("newest");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const searchTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  // ====================================
  // Fetch All Equipment
  // ====================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEquipment():
      Promise<AdminEquipmentResponse> {
      const token = await getAccessToken();

      if (controller.signal.aborted) {
        throw new Error("Request cancelled.");
      }

      const params = new URLSearchParams({
        page: String(page),
        status,
        category,
        division,
        sort,
      });

      if (search) {
        params.set("q", search);
      }

      const response = await fetch(
        `${getApiUrl()}/admin/equipment?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | AdminEquipmentResponse
        | null;

      if (
        !response.ok ||
        !result?.success ||
        !Array.isArray(result.equipment) ||
        !result.pagination ||
        !result.stats
      ) {
        throw new Error(
          result?.error ||
            `Unable to load equipment (HTTP ${response.status}).`
        );
      }

      return result;
    }

    void fetchEquipment()
      .then((result) => {
        if (controller.signal.aborted) return;

        const lastPage = Math.max(
          1,
          result.pagination.totalPages
        );

        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        setEquipment(result.equipment);
        setStats(result.stats);
        setPagination(result.pagination);
        setError("");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load equipment."
        );

        setEquipment([]);
        setPagination(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [
    page,
    status,
    category,
    division,
    sort,
    search,
    refreshKey,
  ]);

  // ====================================
  // Cleanup
  // ====================================

  useEffect(() => {
    return () => {
      if (searchTimer.current !== null) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  function clearSearchTimer() {
    if (searchTimer.current !== null) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
  }

  // ====================================
  // Refresh
  // ====================================

  function handleRefresh() {
    clearSearchTimer();

    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Search
  // ====================================

  function applySearch(value: string) {
    const nextSearch = value.trim();

    setLoading(true);
    setError("");
    setExpandedId(null);

    setPage(1);
    setSearch(nextSearch);

    if (nextSearch === search && page === 1) {
      setRefreshKey((current) => current + 1);
    }
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    clearSearchTimer();

    searchTimer.current = setTimeout(() => {
      applySearch(value);
    }, 450);
  }

  function handleSearchSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    clearSearchTimer();
    applySearch(searchInput);
  }

  // ====================================
  // Filters
  // ====================================

  function changeStatus(
    next: AdminEquipmentStatus
  ) {
    if (next === status) return;

    clearSearchTimer();
    setLoading(true);
    setError("");
    setExpandedId(null);
    setStatus(next);
    setPage(1);
  }

  function changeCategory(next: string) {
    if (next === category) return;

    clearSearchTimer();
    setLoading(true);
    setError("");
    setExpandedId(null);
    setCategory(next);
    setPage(1);
  }

  function changeDivision(next: string) {
    if (next === division) return;

    clearSearchTimer();
    setLoading(true);
    setError("");
    setExpandedId(null);
    setDivision(next);
    setPage(1);
  }

  function changeSort(
    next: AdminEquipmentSort
  ) {
    if (next === sort) return;

    clearSearchTimer();
    setLoading(true);
    setError("");
    setExpandedId(null);
    setSort(next);
    setPage(1);
  }

  function clearFilters() {
    clearSearchTimer();

    setSearchInput("");
    setSearch("");
    setStatus("all");
    setCategory("all");
    setDivision("all");
    setSort("newest");
    setPage(1);
    setExpandedId(null);

    setLoading(true);
    setError("");

    setRefreshKey((current) => current + 1);
  }

  // ====================================
  // Pagination
  // ====================================

  function handlePageChange(nextPage: number) {
    if (
      loading ||
      nextPage < 1 ||
      nextPage === page ||
      (pagination &&
        nextPage > pagination.totalPages)
    ) {
      return;
    }

    setLoading(true);
    setError("");
    setExpandedId(null);
    setPage(nextPage);
  }

  // ====================================
  // Statistics
  // ====================================

  const statCards = [
    {
      label: "Total Equipment",
      value: stats?.total,
      icon: Package,
      className: "text-primary",
    },
    {
      label: "Approved",
      value: stats?.approved,
      icon: BadgeCheck,
      className: "text-emerald-600",
    },
    {
      label: "Pending",
      value: stats?.pending,
      icon: Clock3,
      className: "text-amber-600",
    },
    {
      label: "Rejected",
      value: stats?.rejected,
      icon: XCircle,
      className: "text-red-600",
    },
  ];

  // ====================================
  // UI
  // ====================================

  return (
    <div className="space-y-6">

      {/* Summary Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {item.label}
                </p>

                <div className="rounded-xl bg-muted p-2.5">
                  <Icon
                    size={19}
                    className={item.className}
                  />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold">
                {item.value ?? "—"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Equipment Management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View and inspect equipment from every Owner.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/equipment-approvals"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            <Clock3 size={16} />
            Review Pending
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-0 xl:col-span-2"
          >
            <label
              htmlFor="admin-equipment-search"
              className="sr-only"
            >
              Search equipment
            </label>

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="admin-equipment-search"
              type="search"
              value={searchInput}
              maxLength={100}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Search name or category..."
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </form>

          <select
            aria-label="Filter equipment status"
            value={status}
            onChange={(event) =>
              changeStatus(
                event.target.value as AdminEquipmentStatus
              )
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            aria-label="Sort equipment"
            value={sort}
            onChange={(event) =>
              changeSort(
                event.target.value as AdminEquipmentSort
              )
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <select
            aria-label="Filter equipment category"
            value={category}
            onChange={(event) =>
              changeCategory(event.target.value)
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter rental division"
            value={division}
            onChange={(event) =>
              changeDivision(event.target.value)
            }
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All Divisions</option>

            {divisions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {pagination
            ? `${pagination.total} matching listings`
            : "Search and filter equipment listings."}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={28}
              className="animate-spin text-primary"
            />

            <p className="text-sm text-muted-foreground">
              Loading equipment...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-7"
        >
          <h3 className="font-semibold text-destructive">
            Unable to Load Equipment
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        equipment.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Package
              size={44}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No Equipment Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              No listings match your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Reset Filters
            </button>
          </div>
        )}

      {/* Equipment Table */}
      {!loading &&
        !error &&
        equipment.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-262.5 text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-4">Equipment</th>
                    <th className="px-4 py-4">Owner</th>
                    <th className="px-4 py-4">Price / Day</th>
                    <th className="px-4 py-4">Quantity</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Listed</th>
                    <th className="px-4 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {equipment.map((item) => {
                    const expanded =
                      expandedId === item._id;

                    const itemStatus =
                      getStatusStyles(item.status);

                    return (
                      <Fragment key={item._id}>
                        <tr className="transition-colors hover:bg-muted/30">
                          <td className="px-4 py-4 align-middle">
                            <div className="flex min-w-0 items-center gap-3">
                              <EquipmentImage
                                equipment={item}
                              />

                              <div className="min-w-0">
                                <p className="max-w-60 line-clamp-2 font-semibold">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {item.categories.join(", ") || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <p className="max-w-44 truncate font-medium">
                              {item.owner?.name ||
                                "Unavailable Owner"}
                            </p>

                            <p className="mt-1 max-w-44 truncate text-xs text-muted-foreground">
                              {item.owner?.email || "—"}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle font-semibold text-primary">
                            ৳{item.dailyPrice.toLocaleString("en-BD")}
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <p className="font-medium">
                              {item.quantity} units
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Available: {item.availableQuantity}
                            </p>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${itemStatus.className}`}
                            >
                              {itemStatus.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 align-middle text-muted-foreground">
                            {formatDate(item.createdAt)}
                          </td>

                          <td className="px-4 py-4 text-right align-middle">
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() =>
                                setExpandedId(
                                  expanded ? null : item._id
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-accent"
                            >
                              {expanded
                                ? "Hide Details"
                                : "View Details"}

                              {expanded ? (
                                <ChevronUp size={15} />
                              ) : (
                                <ChevronDown size={15} />
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {expanded && (
                          <tr>
                            <td
                              colSpan={7}
                              className="space-y-4 p-4 sm:p-5"
                            >
                              <AdminEquipmentDetails
                                equipment={item}
                              />

                              {/* Equipment Images */}
                              {item.imageUrls.some(isImageUrl) && (
                                <div className="rounded-xl border border-border p-4">
                                  <h3 className="mb-3 font-semibold">
                                    Equipment Images
                                  </h3>

                                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                    {item.imageUrls
                                      .filter(isImageUrl)
                                      .map((url, index) => (
                                        <a
                                          key={`${url}-${index}`}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="relative aspect-square overflow-hidden rounded-xl bg-muted"
                                        >
                                          <Image
                                            src={url}
                                            alt={`${item.name} image ${index + 1}`}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 50vw, 180px"
                                            className="object-cover"
                                          />
                                        </a>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <nav
            aria-label="Equipment pagination"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"
          >
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loading || page <= 1}
                onClick={() =>
                  handlePageChange(page - 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  loading ||
                  page >= pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(page + 1)
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </nav>
        )}
    </div>
  );
}
