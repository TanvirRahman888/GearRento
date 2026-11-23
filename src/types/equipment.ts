
export interface Equipment {
  _id: string;
  name: string;
  categories: string[];
  condition: string;
  divisions: string[];
  imageUrls: string[];
  dailyPrice: number;
  quantity: number;
  availableQuantity: number;
  isFeatured?: boolean;
  featureExpiresAt?: string | null;
}

export interface EquipmentApiResponse {
  success: boolean;
  equipment: Equipment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
