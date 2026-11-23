
"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import FEquipmentCard from "./FEquipmentCard";

import type { Equipment } from "@/types/equipment";

// ========================================
// Types
// ========================================

interface EquipmentCarouselProps {
  title: string;
  description: string;
  products: Equipment[];
  viewAllHref?: string;
  emptyMessage?: string;
}

// ========================================
// Component
// ========================================

export default function EquipmentCarousel({
  title,
  description,
  products,
  viewAllHref = "/equipment",
  emptyMessage = "No equipment available right now.",
}: EquipmentCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Maximum 10 unique products.
  const items = products.slice(0, 10);

  // Duplicate only small datasets to provide
  // enough slides for continuous looping.
  // This does not add new unique products.

  const slides = useMemo(() => {
    if (items.length <= 1 || items.length >= 5) {
      return items;
    }

    const copies = Math.ceil(8 / items.length);

    return Array.from(
      { length: copies },
      () => items
    ).flat();
  }, [items]);

  const canSlide = items.length > 1;

  return (
    <div className="w-full">

      {/* ====================================
          Carousel Header
      ==================================== */}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* View All */}

          <Link
            href={viewAllHref}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:opacity-75 sm:inline-flex"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>

          {/* Navigation Controls */}

          {canSlide && (
            <div className="flex items-center gap-2">

              <button
                type="button"
                aria-label={`Previous ${title}`}
                onClick={() =>
                  swiperRef.current?.slidePrev()
                }
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-sm transition hover:border-primary hover:bg-secondary hover:text-primary"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                aria-label={`Next ${title}`}
                onClick={() =>
                  swiperRef.current?.slideNext()
                }
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-sm transition hover:border-primary hover:bg-secondary hover:text-primary"
              >
                <ChevronRight className="size-5" />
              </button>

            </div>
          )}
        </div>
      </div>

      {/* ====================================
          Products Slider
      ==================================== */}

      {items.length > 0 ? (
        <Swiper
          modules={[Autoplay, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.15}
          spaceBetween={16}
          grabCursor={canSlide}
          loop={canSlide}
          speed={650}
          watchOverflow={true}
          autoplay={
            canSlide
              ? {
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          breakpoints={{
            520: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            800: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1150: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          a11y={{
            enabled: true,
          }}
          className="py-3!"
        >
          {slides.map((product, index) => (
            <SwiperSlide
              key={`${product._id}-${index}`}
              className="h-auto!"
            >
              <FEquipmentCard equipment={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <PackageOpen className="size-11 text-muted-foreground/50" />

          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      )}

      {/* Mobile View All */}

      <div className="mt-3 text-center sm:hidden">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          View All Equipment
          <ArrowRight className="size-4" />
        </Link>
      </div>

    </div>
  );
}
