
import {
  BadgeCheck,
  CalendarCheck2,
  CreditCard,
  ReceiptText,
  Wallet,
} from "lucide-react";

import type {
  AdminAnalyticsStats,
} from "./admin-analytics-types";

type Props = {
  stats: AdminAnalyticsStats;
};

export function AdminAnalyticsStatsCards({
  stats,
}: Props) {
  const cards = [
    {
      label: "Total Booking Records",
      value: stats.totalBookings.toLocaleString(
        "en-BD"
      ),
      icon: ReceiptText,
      description: "All booking attempts",
    },
    {
      label: "Paid Bookings",
      value: stats.paidBookings.toLocaleString(
        "en-BD"
      ),
      icon: CreditCard,
      description: "Successful payments",
    },
    {
      label: "Confirmed Rentals",
      value: stats.confirmedRentals.toLocaleString(
        "en-BD"
      ),
      icon: BadgeCheck,
      description: "Paid and confirmed",
    },
    {
      label: "Completed Rentals",
      value: stats.completedRentals.toLocaleString(
        "en-BD"
      ),
      icon: CalendarCheck2,
      description: "Marked completed by Owners",
    },
    {
      label: "Gross Paid Amount",
      value: `৳${stats.grossPaidAmount.toLocaleString(
        "en-BD"
      )}`,
      icon: Wallet,
      description: "Recorded BDT payments",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-muted-foreground">
                {card.label}
              </p>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={19} />
              </div>
            </div>

            <p className="mt-4 wrap-break-word text-2xl font-bold tracking-tight">
              {card.value}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
