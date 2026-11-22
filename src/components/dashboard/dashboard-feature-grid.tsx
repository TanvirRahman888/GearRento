
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import {
  dashboardConfig,
  type DashboardRole,
} from "./dashboard-config";

type DashboardFeatureGridProps = {
  role: DashboardRole;
};

export function DashboardFeatureGrid({
  role,
}: DashboardFeatureGridProps) {
  const features = dashboardConfig[role].features;

  return (
    <section>
      {/* Section Heading */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">
          Your Workspace
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Tools and features for your account.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="
                flex h-full flex-col
                rounded-xl border border-border
                bg-card p-4 shadow-sm
                transition-all duration-200
                hover:border-primary/30
                hover:shadow-md
              "
            >
              {/* Feature Icon */}
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon size={20} />
              </div>

              {/* Feature Title */}
              <h3 className="text-sm font-semibold">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {feature.description}
              </p>

              {/* Feature Action */}
              <div className="mt-auto pt-4">
                <div className="border-t border-border pt-3">
                  {feature.href ? (
                    <Link
                      href={feature.href}
                      className="
                        inline-flex items-center gap-1.5
                        text-xs font-semibold
                        text-primary
                        transition-colors
                        hover:underline
                      "
                    >
                      Open Feature
                      <ArrowUpRight size={15} />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
