
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  MonthlyAnalytics,
} from "./admin-analytics-types";

type Props = {
  monthly: MonthlyAnalytics[];
};

function getMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Date.UTC(
      Number(year),
      Number(monthNumber) - 1,
      1
    )
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-BD", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function AdminAnalyticsCharts({
  monthly,
}: Props) {
  const chartData = monthly.map((item) => ({
    ...item,
    label: getMonthLabel(item.month),
  }));

  return (
    <div className="grid gap-5 xl:grid-cols-2">

      {/* ===============================
          Monthly Gross Payments
      =============================== */}

      <section className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">
            Monthly Gross Payments
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recorded customer payments over the
            last six months, in BDT.
          </p>
        </div>

        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94A3B8"
                strokeOpacity={0.18}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={formatNumber}
              />

              <Tooltip
                formatter={(value) =>
                  `৳${Number(value ?? 0).toLocaleString(
                    "en-BD"
                  )}`
                }
              />

              <Bar
                dataKey="grossPaidAmount"
                name="Gross Paid"
                fill="#0E7490"
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ===============================
          Monthly Booking Activity
      =============================== */}

      <section className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">
            Monthly Booking Activity
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Compare total booking attempts with
            successfully paid bookings.
          </p>
        </div>

        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -25,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94A3B8"
                strokeOpacity={0.18}
              />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={28}
              />

              <Line
                type="monotone"
                dataKey="bookings"
                name="Booking Attempts"
                stroke="#0E7490"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="paidBookings"
                name="Paid Bookings"
                stroke="#FFB547"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
