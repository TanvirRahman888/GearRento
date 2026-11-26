
"use client";

import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Heart, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
  FavoriteApiError,
  favoritesRequest,
} from "@/lib/favorites";

type Props = {
  equipmentId: string;
};

type FavoriteStatus = {
  success: boolean;
  isFavorite: boolean;
};

export function FavoriteButton({
  equipmentId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // ====================================
  // Load Favorite Status
  // ====================================

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      setChecking(true);

      try {
        const data =
          await favoritesRequest<FavoriteStatus>(
            `/favorites/${equipmentId}/status`
          );

        if (active) {
          setIsFavorite(data.isFavorite);
        }
      } catch {
        // Guests can still browse equipment.
        // They will be asked to log in when
        // clicking the heart button.
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    void checkStatus();

    return () => {
      active = false;
    };
  }, [equipmentId]);

  // ====================================
  // Add / Remove Favorite
  // ====================================

  async function toggleFavorite() {
    if (loading || checking) return;

    setLoading(true);

    try {
      const method = isFavorite
        ? "DELETE"
        : "POST";

      const data =
        await favoritesRequest<FavoriteStatus>(
          `/favorites/${equipmentId}`,
          method
        );

      setIsFavorite(data.isFavorite);

      toast.success(
        data.isFavorite
          ? "Added to favorites!"
          : "Removed from favorites."
      );
    } catch (error) {
      if (
        error instanceof FavoriteApiError &&
        error.status === 401
      ) {
        router.push(
          `/login?next=${encodeURIComponent(
            pathname || "/equipment"
          )}`
        );

        return;
      }

      if (
        error instanceof FavoriteApiError &&
        error.status === 403
      ) {
        toast.error(
          "Only customers can save equipment."
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update favorites."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    // Prevent clicking the heart from
    // opening the equipment detail page.
    event.preventDefault();
    event.stopPropagation();

    void toggleFavorite();
  }

  const isBusy = checking || loading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBusy}
      aria-label={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
      aria-pressed={isFavorite}
      title={
        isFavorite
          ? "Remove from favorites"
          : "Save equipment"
      }
      className={[
        "flex size-10 items-center justify-center",
        "rounded-full border border-border",
        "bg-card/95 shadow-sm backdrop-blur-sm",
        "transition-all duration-200",
        "hover:scale-105 hover:border-rose-400",
        "disabled:cursor-wait disabled:opacity-60",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-ring",
      ].join(" ")}
    >
      {isBusy ? (
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
      ) : (
        <Heart
          className={
            isFavorite
              ? "size-5 fill-rose-500 text-rose-500"
              : "size-5 text-foreground hover:text-rose-500"
          }
        />
      )}
    </button>
  );
}
