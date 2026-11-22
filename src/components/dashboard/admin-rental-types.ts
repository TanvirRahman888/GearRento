
export type AdminRentalStatus =
  | "all"
  | "checkout_pending"
  | "confirmed"
  | "completed"
  | "checkout_failed"
  | "payment_failed"
  | "expired"
  | "cancelled";

export type AdminPaymentFilter =
  | "all"
  | "paid"
  | "unpaid";

export type AdminRentalBooking = {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  imageUrl: string;

  ownerId: string;
  customerId: string;
  fullName: string;
  phone: string;

  division: string;
  district: string;
  address: string;
  notes?: string;

  startDate: string;
  endDate: string;
  totalDays: number;
  quantity: number;

  dailyPrice: number;
  totalPrice: number;
  currency: string;

  status: string;
  paymentStatus: string;

  stripeSessionId?: string | null;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
};

export type AdminRentalStats = {
  totalBookings: number;
  paidBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  grossPaidAmount: number;
};

export type AdminRentalsResponse = {
  success: boolean;

  bookings: AdminRentalBooking[];
  stats: AdminRentalStats;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  error?: string;
};
