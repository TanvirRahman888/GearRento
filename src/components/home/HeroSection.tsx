
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";



const banners = [
  {
    id: 1,
    src: "/hero/hero%201.png",
    alt: "Camera and photography equipment rental",
    title: "Camera Equipment",
  },
  {
    id: 2,
    src: "/hero/hero%202.png",
    alt: "Heavy construction equipment rental",
    title: "Construction Equipment",
  },
  {
    id: 3,
    src: "/hero/hero%203.png",
    alt: "Professional power tools rental",
    title: "Power Tools",
  },
  {
    id: 4,
    src: "/hero/hero%204.png",
    alt: "Event lighting and sound equipment",
    title: "Event Equipment",
  },
  {
    id: 5,
    src: "/hero/hero%205.png",
    alt: "Camping and outdoor equipment rental",
    title: "Outdoor Equipment",
  },
];



// ========================================
// Hero Section Component
// ========================================

export default function HeroSection() {
  const bannerSwiper = useRef<SwiperInstance | null>(null);

  const [activeBanner, setActiveBanner] = useState(0);

  // Duplicate small product sets to provide
  // enough slides for Swiper infinite loop.

  

  return (
    <section
      aria-label="GearRento rental highlights"
      className="bg-background pb-14 pt-5 sm:pb-20 sm:pt-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===================================
            Slider 1: Promotional Banners
        =================================== */}

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[#0a1924] shadow-xl shadow-black/10 sm:rounded-3xl dark:shadow-black/30">

          <Swiper
            modules={[Autoplay, A11y]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            speed={800}
            grabCursor={true}
            autoplay={{
              delay: 4800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => {
              bannerSwiper.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveBanner(swiper.realIndex);
            }}
            a11y={{ enabled: true }}
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner.id}>

                <Link
                  href="/equipment"
                  aria-label={`Browse ${banner.title}`}
                  className="relative block aspect-video w-full"
                >
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    preload={index === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-contain"
                  />
                </Link>

              </SwiperSlide>
            ))}
          </Swiper>

          {/* Previous Banner */}

          <button
            type="button"
            aria-label="Previous banner"
            onClick={() =>
              bannerSwiper.current?.slidePrev()
            }
            className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-cta sm:left-5 sm:size-11"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Next Banner */}

          <button
            type="button"
            aria-label="Next banner"
            onClick={() =>
              bannerSwiper.current?.slideNext()
            }
            className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-cta sm:right-5 sm:size-11"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Banner Pagination */}

          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/55 px-3 py-2 backdrop-blur-sm sm:bottom-4">

            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Show banner ${index + 1}`}
                aria-current={
                  index === activeBanner
                    ? "true"
                    : undefined
                }
                onClick={() =>
                  bannerSwiper.current?.slideToLoop(index)
                }
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeBanner === index
                    ? "w-6 bg-cta"
                    : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
