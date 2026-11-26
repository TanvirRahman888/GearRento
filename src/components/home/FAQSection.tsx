
import Link from "next/link";

import {
  ArrowRight,
  CircleHelp,
  Headphones,
  MessageCircleQuestion,
  ShieldCheck,
} from "lucide-react";

import FAQItem from "./FAQItem";

import { faqs } from "@/data/faqs";

// ========================================
// FAQ Section
// ========================================

export default function FAQSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-cta/5 blur-3xl" />

      {/* Main Container */}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">

          {/* ====================================
              Left: Section Heading
          ==================================== */}

          <div className="lg:sticky lg:top-28 lg:col-span-5">

            {/* Badge */}

            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
              <CircleHelp className="size-4" />
              Help & Support
            </span>

            {/* Heading */}

            <h2
              id="faq-heading"
              className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Frequently Asked{" "}
              <span className="text-primary">
                Questions
              </span>
            </h2>

            {/* Description */}

            <p className="mt-5 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base">
              Have questions about renting equipment,
              payments, availability, or becoming an
              equipment owner? Find helpful answers
              about using GearRento.
            </p>

            {/* Help Features */}

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">

                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Reviewed Equipment Listings
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Listings are reviewed before publication.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Headphones className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Helpful Rental Information
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Learn how equipment rentals work.
                  </p>
                </div>

              </div>

            </div>

            {/* CTA */}

            <div className="mt-9">
              <Link
                href="/equipment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg"
              >
                Explore Equipment

                <ArrowRight className="size-4" />
              </Link>
            </div>

          </div>

          {/* ====================================
              Right: FAQ Accordion
          ==================================== */}

          <div className="lg:col-span-7">

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm dark:shadow-black/10 sm:p-7 lg:p-8">

              {/* Accordion Header */}

              <div className="mb-4 flex items-center gap-3 border-b border-border pb-5">

                <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MessageCircleQuestion className="size-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    Common Questions
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Everything you need to know about GearRento
                  </p>
                </div>

              </div>

              {/* FAQ Items */}

              <div>
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    defaultOpen={index === 0}
                  />
                ))}
              </div>

            </div>

            {/* Bottom Note */}

            <div className="mt-5 rounded-2xl border border-primary/10 bg-secondary/60 p-5">

              <div className="flex items-start gap-3">

                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                  <CircleHelp className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Have More Questions?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Need additional information? Check
                    the equipment details and rental terms
                    before completing your booking.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
