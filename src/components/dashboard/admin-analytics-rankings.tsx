
import Link from "next/link";

import {
  ArrowUpRight,
  Package,
  Tags,
} from "lucide-react";

import type {
  CategoryAnalytics,
  TopEquipmentAnalytics,
} from "./admin-analytics-types";

type Props = {
  topEquipment: TopEquipmentAnalytics[];
  categories: CategoryAnalytics[];
};

export function AdminAnalyticsRankings({
  topEquipment,
  categories,
}: Props) {
  const largestCategoryCount = Math.max(
    1,
    ...categories.map((item) => item.paidBookings)
  );

  return (
    <div className="grid items-start gap-5 xl:grid-cols-2">

      {/* ===============================
          Top Rented Equipment
      =============================== */}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Package
            size={20}
            className="text-primary"
          />

          <div>
            <h2 className="text-lg font-bold">
              Top Rented Equipment
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Ranked by paid booking count
            </p>
          </div>
        </div>

        {topEquipment.length === 0 ? (
          <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
            No paid equipment rentals yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {topEquipment.map((item, index) => (
              <div
                key={item.equipmentId || index}
                className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-primary">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  {item.equipmentId ? (
                    <Link
                      href={`/equipment/${item.equipmentId}`}
                      className="inline-flex items-start gap-1 text-sm font-semibold hover:text-primary"
                    >
                      <span className="line-clamp-2">
                        {item.name}
                      </span>

                      <ArrowUpRight
                        size={14}
                        className="mt-0.5 shrink-0"
                      />
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold">
                      {item.name}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.paidBookings} paid bookings
                    {" · "}
                    {item.unitsRented} units rented
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-primary">
                    ৳
                    {item.grossPaidAmount.toLocaleString(
                      "en-BD"
                    )}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Gross paid
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===============================
          Popular Categories
      =============================== */}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Tags
            size={20}
            className="text-primary"
          />

          <div>
            <h2 className="text-lg font-bold">
              Category Performance
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Categories of paid equipment rentals
            </p>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
            No category rental data yet.
          </p>
        ) : (
          <div className="space-y-5">
            {categories.map((item) => {
              const percentage =
                (item.paidBookings /
                  largestCategoryCount) *
                100;

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-semibold">
                      {item.name}
                    </p>

                    <p className="shrink-0 text-xs font-medium text-muted-foreground">
                      {item.paidBookings} bookings
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.unitsRented} units rented
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Equipment may belong to more than one
          category. Counts are not exclusive.
        </p>
      </section>
    </div>
  );
}
