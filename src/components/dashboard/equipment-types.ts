export type Equipment = {
  _id: string;
  name: string;
  categories: string[];
  condition: string;
  divisions: string[];
  imageUrls: string[];
  descriptionHtml?: string;
  descriptionText?: string;
  dailyPrice: number;
  quantity: number;
  availableQuantity: number;
  status: string;
  createdAt: string;
};

export type EquipmentPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};