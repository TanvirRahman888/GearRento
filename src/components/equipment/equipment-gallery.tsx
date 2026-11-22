
"use client";

import { useState } from "react";
import Image from "next/image";

import { ImageIcon } from "lucide-react";

type EquipmentGalleryProps = {
  images: string[];
  name: string;
};

export function EquipmentGallery({
  images,
  name,
}: EquipmentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] =
    useState<string[]>([]);

  const activeImage = images[activeIndex];

  function markImageFailed(url: string) {
    setFailedImages((current) =>
      current.includes(url)
        ? current
        : [...current, url]
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
        {activeImage &&
        !failedImages.includes(activeImage) ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={`${name} - image ${activeIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 650px"
            className="object-contain"
            onError={() =>
              markImageFailed(activeImage)
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon size={48} />
            <p className="text-sm">
              Image unavailable
            </p>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition-colors ${
                activeIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/40"
              }`}
            >
              {url && !failedImages.includes(url) ? (
                <Image
                  src={url}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  sizes="110px"
                  className="object-cover"
                  onError={() =>
                    markImageFailed(url)
                  }
                />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <ImageIcon
                    size={20}
                    className="text-muted-foreground"
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
