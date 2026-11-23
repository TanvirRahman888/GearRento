
import type {
  Equipment,
  EquipmentApiResponse,
} from "@/types/equipment";

// ========================================
// API Configuration
// ========================================

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const MAX_RECENT_PRODUCTS = 10;

// ========================================
// Fetch Recently Added Equipment
// ========================================

export async function getRecentlyAddedEquipment(): Promise<
  Equipment[]
> {
  try {
    const url = new URL(
      `${API_BASE_URL}/equipment`
    );

    // Sort by newest equipment first
    url.searchParams.set("sort", "newest");

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Recently added equipment request failed: ${response.status}`
      );
    }

    const data =
      (await response.json()) as EquipmentApiResponse;

    if (
      !data.success ||
      !Array.isArray(data.equipment)
    ) {
      throw new Error("Invalid equipment API response");
    }

    // Return maximum 10 products
    // Backend already includes approved products only
    return data.equipment
      .filter((item) => Boolean(item._id))
      .slice(0, MAX_RECENT_PRODUCTS);

  } catch (error) {
    console.error(
      "Failed to fetch recently added equipment:",
      error
    );

    return [];
  }
}
