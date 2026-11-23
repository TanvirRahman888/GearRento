
import type { LucideIcon } from "lucide-react";

export interface OwnerStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface OwnerStepCardProps {
  step: OwnerStep;
}

export default function OwnerStepCard({
  step,
}: OwnerStepCardProps) {
  const Icon = step.icon;

  return (
    <div className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:p-5">

      {/* Step Icon */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-6" strokeWidth={1.8} />
      </div>

      {/* Step Content */}
      <div className="min-w-0 flex-1">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Step {step.number}
        </span>

        <h3 className="mt-1 text-base font-bold text-card-foreground">
          {step.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {step.description}
        </p>
      </div>

      {/* Step Number Decoration */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-3 text-3xl font-bold text-primary/10"
      >
        {step.number}
      </span>
    </div>
  );
}
