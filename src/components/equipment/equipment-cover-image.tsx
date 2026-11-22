
"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string;
  alt: string;
};

export function EquipmentCoverImage({
  src,
  alt,
}: Props) {
  const [failedSrc, setFailedSrc] =
    useState<string | null>(null);

  const showImage = Boolean(
    src && failedSrc !== src
  );

  return (
    <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-muted">
      {showImage && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <ImageIcon
          size={42}
          className="text-muted-foreground/40"
        />
      )}
    </div>
  );
}
