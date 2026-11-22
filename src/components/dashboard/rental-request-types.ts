
export type OwnerRentalStatus =
  | "all"
  | "confirmed"
  | "completed";

export type OwnerRentalBooking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  imageUrl: string;

  customerId: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  address: string;
  notes: string;

  startDate: string;
  endDate: string;
  totalDays: number;
  quantity: number;

  dailyPrice: number;
  totalPrice: number;
  currency: string;

  status: "confirmed" | "completed";
  paymentStatus: "paid";
  createdAt: string;
  completedAt?: string;
};

export type OwnerRentalsResponse = {
  success: boolean;
  bookings: OwnerRentalBooking[];

  stats: {
    total: number;
    confirmed: number;
    completed: number;
  };

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  error?: string;
};
