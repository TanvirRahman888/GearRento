
"use client";

import Link from "next/link";

import {
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import CategoryCard from "@/components/equipment/CategoryCard";

import {
  equipmentCategories,
} from "@/data/equipment-categories";

// ======================================
// Framer Motion Variants
// ======================================

const containerVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ======================================
// Category Section
// ======================================

export default function CategorySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="relative overflow-hidden bg-background py-14 sm:py-20"
    >
      {/* ===================================
          Background Decorations
      =================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -left-24 top-20
          size-72 rounded-full
          bg-primary/5 blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-24 bottom-10
          size-80 rounded-full
          bg-primary/5 blur-3xl
        "
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================================
            Section Heading
        =================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="
            mb-9 flex flex-col gap-5
            sm:mb-10
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            {/* ===================================
                Section Badge
            =================================== */}

            <span
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-primary/10
                bg-secondary
                px-4 py-2
                text-xs font-semibold
                uppercase tracking-wider
                text-secondary-foreground
              "
            >
              <LayoutGrid className="size-4" />

              Explore Our Categories
            </span>

            {/* ===================================
                Main Heading
            =================================== */}

            <h2
              id="categories-heading"
              className="
                mt-4 text-3xl font-bold
                tracking-tight text-foreground
                sm:text-4xl
              "
            >
              Browse by{" "}
              <span className="text-primary">
                Category
              </span>
            </h2>

            {/* ===================================
                Description
            =================================== */}

            <p
              className="
                mt-3 max-w-xl
                text-sm leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              Explore a wide range of rental
              equipment. Find the right tools,
              technology, and gear for your
              next project.
            </p>
          </div>

          {/* ===================================
              View All Button
          =================================== */}

          <Link
            href="/equipment"
            className="
              group inline-flex w-fit
              items-center gap-2
              rounded-xl
              border border-border
              bg-card
              px-4 py-2.5
              text-sm font-semibold
              text-foreground
              shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-primary/40
              hover:bg-secondary
              hover:text-primary
              hover:shadow-md
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-ring
            "
          >
            View All Equipment

            <ArrowRight
              className="
                size-4
                transition-transform duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </motion.div>

        {/* ===================================
            Categories Grid
        =================================== */}

        <motion.div
          variants={containerVariants}
          initial={
            shouldReduceMotion
              ? false
              : "hidden"
          }
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            grid grid-cols-2 gap-3
            sm:grid-cols-3 sm:gap-4
            lg:grid-cols-4
            xl:grid-cols-7
          "
        >
          {equipmentCategories.map((category) => (
            <motion.div
              key={category.name}
              variants={cardVariants}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -6,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
              }}
              className="h-full min-w-0"
            >
              {/* Reuse Existing Category Card */}

              <CategoryCard
                category={category}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ===================================
            Bottom Explore Link
        =================================== */}

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 16,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.55,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Looking for something specific?{" "}

            <Link
              href="/equipment"
              className="
                group inline-flex
                items-center gap-1
                font-semibold
                text-primary
                transition-colors duration-300
                hover:text-primary/80
                focus-visible:underline
              "
            >
              Explore all equipment

              <ArrowRight
                className="
                  size-4
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
