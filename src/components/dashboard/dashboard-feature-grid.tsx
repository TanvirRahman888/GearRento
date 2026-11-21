
import { dashboardConfig, type DashboardRole } from "./dashboard-config";

type DashboardFeatureGridProps = {
  role: DashboardRole;
};

export function DashboardFeatureGrid({
  role,
}: DashboardFeatureGridProps) {
  const features = dashboardConfig[role].features;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">
          Your Workspace
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Tools and features for your account.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon size={20} />
              </div>

              <h3 className="text-sm font-semibold">
                {feature.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {feature.description}
              </p>

              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                Coming soon
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
