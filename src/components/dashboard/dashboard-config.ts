import {
  Users,
  ShieldCheck,
  Package,
  PackagePlus,
  ClipboardList,
  BarChart3,
  CalendarDays,
  Wallet,
  Heart,
  CreditCard,
  Settings,
  TicketPercent,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "admin" | "owner" | "customer";

export type DashboardFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
};

export type DashboardConfig = {
  label: string;
  title: string;
  description: string;
  features: DashboardFeature[];
};

export const dashboardConfig: Record<DashboardRole, DashboardConfig> = {
  admin: {
    label: "Administrator",
    title: "Admin Dashboard",
    description:
      "Manage GearRento users, equipment approvals, rentals, and platform activities.",
    features: [
      {
        title: "Manage Users",
        description: "View users and manage account roles.",
        icon: Users,
        href: "/dashboard/manage-users",
      },
      {
        title: "Equipment Approvals",
        description: "Review equipment listings.",
        icon: ShieldCheck,
        href: "/dashboard/equipment-approvals",
      },
      {
        title: "All Equipment",
        description: "View and inspect every equipment listing.",
        icon: Package,
        href: "/dashboard/all-equipment",
      },
      {
        title: "All Rentals",
        description: "Monitor customer bookings and payments.",
        icon: ClipboardList,
        href: "/dashboard/all-rentals",
      },
      {
        title: "Analytics",
        description: "View booking trends and rental performance.",
        icon: BarChart3,
        href: "/dashboard/analytics",
      },
      {
        title: "Platform Settings",
        description: "Manage platform preferences.",
        icon: Settings,
      },
    ],
  },

  owner: {
    label: "Product Owner",
    title: "Owner Dashboard",
    description: "Manage your equipment, rental requests, and earnings.",
    features: [
      {
        title: "Add Equipment",
        description: "Create new equipment listings.",
        icon: PackagePlus,
        href: "/dashboard/add-equipment",
      },
      {
        title: "My Equipment",
        description: "Manage your equipment listings.",
        icon: Package,
        href: "/dashboard/my-equipment",
      },
      {
        title: "Rental Requests",
        description: "Manage paid rentals and customer bookings.",
        icon: ClipboardList,
        href: "/dashboard/rental-requests",
      },
      {
        title: "Availability",
        description: "Manage equipment rental dates.",
        icon: CalendarDays,
      },
      {
        title: "My Earnings",
        description: "Review rental earnings.",
        icon: Wallet,
      },
      {
        title: "Discounts & Offers",
        description: "Manage rental discounts.",
        icon: TicketPercent,
      },
    ],
  },

  customer: {
    label: "Customer",
    title: "Customer Dashboard",
    description: "Explore equipment and manage your rentals.",
    features: [
      {
        title: "My Bookings",
        description: "Track your equipment bookings and payments.",
        icon: CalendarDays,
        href: "/dashboard/my-bookings",
      },
      {
        title: "Rental History",
        description: "Review previous rentals.",
        icon: ClipboardList,
      },
      {
        title: "Saved Equipment",
        description: "Access your saved equipment.",
        icon: Heart,
      },
      {
        title: "My Payments",
        description: "View payments and transactions.",
        icon: CreditCard,
      },
      {
        title: "Delivery Tracking",
        description: "Track equipment deliveries.",
        icon: Truck,
      },
      {
        title: "Account Settings",
        description: "Manage account information.",
        icon: Settings,
      },
    ],
  },
};
