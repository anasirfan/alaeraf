import Image from "next/image";

type ProductPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductPhoto({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 80vw, 400px",
}: ProductPhotoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

type FullBackgroundProps = {
  src: string;
  alt?: string;
  overlay?: "light" | "cream" | "mist" | "dark" | "forest";
  className?: string;
  priority?: boolean;
};

const overlayStyles = {
  light: "bg-ivory/75",
  cream: "bg-cream/80",
  mist: "bg-mist/70",
  dark: "bg-charcoal/55",
  forest: "bg-forest/70",
};

export function FullBackground({
  src,
  alt = "",
  overlay = "light",
  className = "",
  priority = false,
}: FullBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className={`absolute inset-0 ${overlayStyles[overlay]}`} />
      {(overlay === "light" || overlay === "cream" || overlay === "mist") && (
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/35 via-transparent to-ivory/45" />
      )}
    </div>
  );
}
