
import type {
  Equipment,
  EquipmentApiResponse,
} from "@/types/equipment";

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const MAX_PRODUCTS = 10;
const PREFERRED_PER_GROUP = 5;

// ========================================
// Fetch Equipment From Backend
// ========================================

async function fetchEquipment(
  params?: URLSearchParams
): Promise<Equipment[]> {
  const query = params?.toString();

  const url = `${API_BASE_URL}/equipment${
    query ? `?${query}` : ""
  }`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Equipment API failed: ${response.status}`
    );
  }

  const data =
    (await response.json()) as EquipmentApiResponse;

  if (!data.success || !Array.isArray(data.equipment)) {
    throw new Error("Invalid equipment API response");
  }

  return data.equipment;
}

// ========================================
// Get Combined Popular Equipment
// ========================================

export async function getHomeEquipment(): Promise<
  Equipment[]
> {
  const results = await Promise.allSettled([
    // Default sort: featured equipment first
    fetchEquipment(),

    // Highest daily rental prices first
    fetchEquipment(
      new URLSearchParams({
        sort: "price-high",
      })
    ),
  ]);

  const [featuredResult, topPriceResult] = results;

  if (featuredResult.status === "rejected") {
    console.error(
      "Featured equipment fetch failed:",
      featuredResult.reason
    );
  }

  if (topPriceResult.status === "rejected") {
    console.error(
      "Top-priced equipment fetch failed:",
      topPriceResult.reason
    );
  }

  const featured =
    featuredResult.status === "fulfilled"
      ? featuredResult.value.filter(
          (item) => item.isFeatured === true
        )
      : [];

  const topPriced =
    topPriceResult.status === "fulfilled"
      ? topPriceResult.value
      : [];

  // ========================================
  // Merge Products Without Duplicates
  // ========================================

  const selected: Equipment[] = [];
  const selectedIds = new Set<string>();

  const addProduct = (product: Equipment): boolean => {
    if (
      !product?._id ||
      selectedIds.has(product._id) ||
      selected.length >= MAX_PRODUCTS
    ) {
      return false;
    }

    selectedIds.add(product._id);
    selected.push(product);

    return true;
  };

  // First: add up to 5 featured products
  for (const product of featured.slice(
    0,
    PREFERRED_PER_GROUP
  )) {
    addProduct(product);
  }

  // Second: add up to 5 distinct top-priced products
  let topPriceAdded = 0;

  for (const product of topPriced) {
    if (topPriceAdded >= PREFERRED_PER_GROUP) {
      break;
    }

    if (addProduct(product)) {
      topPriceAdded++;
    }
  }

  // Fill remaining slots from either collection
  for (const product of [...featured, ...topPriced]) {
    if (selected.length >= MAX_PRODUCTS) {
      break;
    }

    addProduct(product);
  }

  return selected;
}
