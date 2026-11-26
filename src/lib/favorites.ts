
export class FavoriteApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "FavoriteApiError";
  }
}

export type SavedEquipment = {
  _id: string;
  name: string;
  categories: string[];
  divisions: string[];
  condition: string;
  dailyPrice: number;
  imageUrls: string[];
  availableQuantity: number;
  isFeatured: boolean;
};

export type SavedFavorite = {
  _id: string;
  equipmentId: string;
  savedAt: string;
  equipment: SavedEquipment | null;
};

export type FavoritesResponse = {
  success: boolean;
  favorites: SavedFavorite[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ======================================
// Reusable authenticated API request
// ======================================

export async function favoritesRequest<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET"
): Promise<T> {
  const apiURL =
    process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  const tokenResponse = await fetch(
    "/api/auth/token",
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!tokenResponse.ok) {
    throw new FavoriteApiError(
      "Please sign in to continue.",
      tokenResponse.status
    );
  }

  const tokenData: { token?: string } =
    await tokenResponse.json();

  if (!tokenData.token) {
    throw new FavoriteApiError(
      "Authentication token is missing.",
      401
    );
  }

  const response = await fetch(
    `${apiURL.replace(/\/$/, "")}${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(
    () => ({
      error: "Unexpected server response.",
    })
  );

  if (!response.ok) {
    throw new FavoriteApiError(
      data.error || "Request failed.",
      response.status
    );
  }

  return data as T;
}
