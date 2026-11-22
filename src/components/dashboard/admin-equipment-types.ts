
export type AdminEquipmentStatus =
  | "all"
  | "pending"
  | "approved"
  | "rejected";

export type AdminEquipmentSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-low"
  | "price-high";

export type AdminEquipmentOwner = {
  id: string;
  name: string;
  email: string;
};

export type AdminEquipment = {
  _id: string;
  name: string;

  categories: string[];
  divisions: string[];
  condition: string;

  descriptionText: string;

  imageUrls: string[];

  dailyPrice: number;
  quantity: number;
  availableQuantity: number;

  ownerId: string;
  owner: AdminEquipmentOwner | null;

  status: string;
  reviewReason: string;
  reviewedAt: string | null;

  createdAt: string | null;
  updatedAt: string | null;
};

export type AdminEquipmentResponse = {
  success: boolean;

  equipment: AdminEquipment[];

  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  error?: string;
};
