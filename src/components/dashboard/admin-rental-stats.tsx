
import {
  BadgeCheck,
  CalendarCheck2,
  CreditCard,
  ReceiptText,
  Wallet,
} from "lucide-react";

import type {
  AdminRentalStats as Stats,
} from "./admin-rental-types";

type Props = {
  stats: Stats | null;
};

export function AdminRentalStats({ stats }: Props) {
  const items = [
    {
      title: "Total Booking Records",
      value: stats?.totalBookings,
      icon: ReceiptText,
    },
    {
      title: "Paid Bookings",
      value: stats?.paidBookings,
      icon: CreditCard,
    },
    {
      title: "Confirmed Rentals",
      value: stats?.confirmedBookings,
      icon: BadgeCheck,
    },
    {
      title: "Completed Rentals",
      value: stats?.completedBookings,
      icon: CalendarCheck2,
    },
    {
      title: "Gross Paid (BDT)",
      value:
        stats !== null
          ? `৳${stats.grossPaidAmount.toLocaleString("en-BD")}`
          : undefined,
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {item.title}
              </p>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={17} />
              </div>
            </div>

            <p className="mt-3 wrap-break-word text-2xl font-bold">
              {item.value ?? "—"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
