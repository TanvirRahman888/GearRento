
import { Plus } from "lucide-react";

import type { FAQ } from "@/data/faqs";

interface FAQItemProps {
  faq: FAQ;
  defaultOpen?: boolean;
}

export default function FAQItem({
  faq,
  defaultOpen = false,
}: FAQItemProps) {
  return (
    <details
      name="gearrento-faq"
      open={undefined}
      className="group border-b border-border last:border-b-0"
      {...(defaultOpen ? { defaultOpen: true } : {})}
    >
      {/* ===================================
          Question
      =================================== */}

      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden sm:py-6">

        <h3 className="text-sm font-semibold leading-6 text-card-foreground transition-colors group-open:text-primary sm:text-base">
          {faq.question}
        </h3>

        {/* Plus / Close Icon */}

        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-primary transition-all duration-300 group-open:rotate-45 group-open:border-primary/30 group-open:bg-primary group-open:text-primary-foreground">
          <Plus
            className="size-4 transition-transform duration-300"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>

      </summary>

      {/* ===================================
          Answer
      =================================== */}

      <div className="pb-6 pr-12">
        <p className="text-sm leading-7 text-muted-foreground">
          {faq.answer}
        </p>
      </div>

    </details>
  );
}
