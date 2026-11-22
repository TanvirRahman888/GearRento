
export const equipmentCategories = [
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

export const rentalDivisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export const equipmentConditions = [
  { value: "new", label: "Brand New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "very-good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "refurbished", label: "Refurbished" },
  { value: "used-tested", label: "Used & Tested" },
];

export type EquipmentFilters = {
  q: string;
  category: string;
  division: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  page: number;
};

export type PublicEquipment = {
  _id: string;
  name: string;
  categories: string[];
  condition: string;
  divisions: string[];
  imageUrls: string[];
  dailyPrice: number;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
};

export type EquipmentPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EquipmentResponse = {
  success: boolean;
  equipment: PublicEquipment[];
  pagination: EquipmentPagination;
  error?: string;
};

export type EquipmentSearchParams = Record<
  string,
  string | string[] | undefined
>;

// =====================================
// Parse URL Search Parameters
// =====================================

function getValue(value: string | string[] | undefined) {
  if (typeof value === "string") return value;

  return Array.isArray(value) ? (value[0] ?? "") : "";
}

export function parseEquipmentFilters(
  params: EquipmentSearchParams
): EquipmentFilters {
  const requestedPage = Number(getValue(params.page) || 1);

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage >= 1
      ? Math.min(requestedPage, 100000)
      : 1;

  return {
    q: getValue(params.q).trim().slice(0, 100),
    category: getValue(params.category),
    division: getValue(params.division),
    condition: getValue(params.condition),
    minPrice: getValue(params.minPrice),
    maxPrice: getValue(params.maxPrice),
    sort: getValue(params.sort) || "newest",
    page,
  };
}

// =====================================
// Build Query for API / Pagination
// =====================================

export function buildEquipmentQuery(
  filters: EquipmentFilters,
  page = filters.page
) {
  const params = new URLSearchParams();

  const keys = [
    "q",
    "category",
    "division",
    "condition",
    "minPrice",
    "maxPrice",
    "sort",
  ] as const;

  for (const key of keys) {
    if (filters[key]) {
      params.set(key, filters[key]);
    }
  }

  params.set("page", String(page));

  return params.toString();
}

// =====================================
// Server-Side Express API Request
// =====================================

export async function getApprovedEquipment(
  filters: EquipmentFilters
): Promise<{
  data: EquipmentResponse | null;
  error: string;
}> {
  const apiURL =
    process.env.EQUIPMENT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL;

  if (!apiURL) {
    return {
      data: null,
      error: "Equipment API is not configured.",
    };
  }

  try {
    const query = buildEquipmentQuery(filters);

    const response = await fetch(
      `${apiURL.replace(/\/+$/, "")}/equipment?${query}`,
      {
        cache: "no-store",
      }
    );

    const result = (await response.json()) as EquipmentResponse;

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Unable to load equipment."
      );
    }

    if (
      !Array.isArray(result.equipment) ||
      !result.pagination
    ) {
      throw new Error("Invalid equipment API response.");
    }

    return {
      data: result,
      error: "",
    };
  } catch (error) {
    console.error("Equipment fetch failed:", error);

    return {
      data: null,
      error: "Unable to load equipment. Please try again.",
    };
  }
}
