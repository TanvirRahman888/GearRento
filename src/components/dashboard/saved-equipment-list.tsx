
"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Heart,
  LoaderCircle,
  PackageSearch,
  Trash2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";

import {
  favoritesRequest,
  type FavoritesResponse,
  type SavedFavorite,
} from "@/lib/favorites";

// ======================================
// Saved Equipment List
// ======================================

export function SavedEquipmentList() {
  const [favorites, setFavorites] = useState<
    SavedFavorite[]
  >([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  // ====================================
  // Fetch Saved Equipment
  // ====================================

  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError("");

        const data =
          await favoritesRequest<FavoritesResponse>(
            `/favorites?page=${page}`
          );

        if (!active) return;

        setFavorites(data.favorites);

        setTotal(data.pagination.total);

        setTotalPages(
          Math.max(
            1,
            data.pagination.totalPages
          )
        );
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load favorites."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      active = false;
    };
  }, [page, refreshKey]);

  // ====================================
  // Remove Favorite
  // ====================================

  async function handleRemove(
    equipmentId: string
  ) {
    try {
      setRemovingId(equipmentId);

      await favoritesRequest(
        `/favorites/${equipmentId}`,
        "DELETE"
      );

      toast.success(
        "Equipment removed from favorites."
      );

      // If the last item on this page was
      // removed, go back to the previous page.

      if (
        favorites.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey(
          (current) => current + 1
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to remove equipment."
      );
    } finally {
      setRemovingId(null);
    }
  }

  // ====================================
  // Loading State
  // ====================================

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-border bg-card">
        <LoaderCircle className="size-5 animate-spin text-primary" />

        <span className="text-sm text-muted-foreground">
          Loading saved equipment...
        </span>
      </div>
    );
  }

  // ====================================
  // Error State
  // ====================================

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-destructive">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            setRefreshKey((n) => n + 1)
          }
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ====================================
  // Empty State
  // ====================================

  if (total === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary">
          <Heart className="size-8 text-primary" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          No Saved Equipment Yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Explore GearRento and save equipment
          you are interested in renting. Your
          favorite items will appear here.
        </p>

        <Link
          href="/equipment"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-3 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90"
        >
          Browse Equipment
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    );
  }

  // ====================================
  // Favorites Grid
  // ====================================

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Your Saved Equipment
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {total} saved equipment{" "}
          {total === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {favorites.map((favorite) => {
          const equipment = favorite.equipment;

          return (
            <article
              key={favorite._id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {equipment ? (
                <>
                  <Link
                    href={`/equipment/${favorite.equipmentId}`}
                    className="block"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                      {equipment.imageUrls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={equipment.imageUrls[0]}
                          alt={equipment.name}
                          className="size-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <PackageSearch className="size-12 text-muted-foreground" />
                        </div>
                      )}

                      {equipment.isFeatured && (
                        <span className="absolute left-3 top-3 rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {equipment.categories[0] ||
                          "Equipment"}
                      </span>

                      <h3 className="line-clamp-2 min-h-12 font-semibold text-card-foreground">
                        {equipment.name}
                      </h3>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Daily Rental Price
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                          ৳
                          {new Intl.NumberFormat(
                            "en-BD"
                          ).format(
                            equipment.dailyPrice
                          )}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            / day
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-border p-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          favorite.equipmentId
                        )
                      }
                      disabled={
                        removingId ===
                        favorite.equipmentId
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50"
                    >
                      {removingId ===
                      favorite.equipmentId ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}

                      Remove from Favorites
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col justify-between gap-5 p-5">
                  <div className="space-y-3">
                    <PackageSearch className="size-10 text-muted-foreground" />

                    <h3 className="font-semibold">
                      Equipment Unavailable
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      This listing is no longer
                      available for rental.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(
                        favorite.equipmentId
                      )
                    }
                    disabled={
                      removingId ===
                      favorite.equipmentId
                    }
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:text-destructive disabled:opacity-50"
                  >
                    Remove from Favorites
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={page === 1}
            className="rounded-lg border border-border bg-card p-2 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5" />
          </button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={page === totalPages}
            className="rounded-lg border border-border bg-card p-2 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
