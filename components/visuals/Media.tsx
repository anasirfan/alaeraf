import Image from "next/image";

/**
 * Single seam for every photograph on the page.
 * Swap `src` for real Al Aeraf product photography later — nothing else changes.
 */
export type MediaProps = {
  src: string;
  alt: string;
  /** Tailwind classes for the frame (aspect ratio, radius, shadow). */
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Extra classes on the <img> itself, e.g. object-position. */
  imgClassName?: string;
};

export function Media({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 92vw, 46vw",
  priority = false,
  quality = 82,
  imgClassName = "",
}: MediaProps) {
  return (
    <div className={`relative overflow-hidden bg-cream ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}
