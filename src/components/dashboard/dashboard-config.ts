import {
  Users,
  ShieldCheck,
  Package,
  PackagePlus,
  ClipboardList,
  ChartNoAxesCombined,
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
        description: "Manage customers and product owners.",
        icon: Users,
      },
      {
        title: "Equipment Approvals",
        description: "Review equipment listings.",
        icon: ShieldCheck,
        href: "/dashboard/equipment-approvals",
      },
      {
        title: "All Equipment",
        description: "Manage marketplace equipment.",
        icon: Package,
      },
      {
        title: "All Rentals",
        description: "Monitor rental bookings.",
        icon: ClipboardList,
      },
      {
        title: "Platform Analytics",
        description: "Review marketplace performance.",
        icon: ChartNoAxesCombined,
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
        description: "Review booking requests.",
        icon: ClipboardList,
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
