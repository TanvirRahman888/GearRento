
export type AdminAnalyticsStats = {
  totalBookings: number;
  paidBookings: number;
  confirmedRentals: number;
  completedRentals: number;
  grossPaidAmount: number;
};

export type MonthlyAnalytics = {
  month: string;
  bookings: number;
  paidBookings: number;
  grossPaidAmount: number;
};

export type TopEquipmentAnalytics = {
  equipmentId: string;
  name: string;
  paidBookings: number;
  unitsRented: number;
  grossPaidAmount: number;
};

export type CategoryAnalytics = {
  name: string;
  paidBookings: number;
  unitsRented: number;
};

export type AdminAnalyticsResponse = {
  success: boolean;
  stats: AdminAnalyticsStats;
  monthly: MonthlyAnalytics[];
  topEquipment: TopEquipmentAnalytics[];
  categories: CategoryAnalytics[];
  error?: string;
};
