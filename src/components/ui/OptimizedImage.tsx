import Image from "next/image";
import { cn, getAssetPath } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  fill = false,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  placeholder = "blur",
  blurDataURL,
}: OptimizedImageProps) {
  const resolvedSrc = getAssetPath(src);
  const isSvg = resolvedSrc.endsWith(".svg");
  const effectivePlaceholder = isSvg ? "empty" : placeholder;
  const effectiveBlurDataURL = isSvg ? undefined : (blurDataURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect fill='%23e2e8f0' width='10' height='10'/%3E%3C/svg%3E`);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      placeholder={effectivePlaceholder}
      blurDataURL={effectiveBlurDataURL}
      className={cn(
        "transition-opacity duration-700 ease-out",
        fill && !className.includes("object-") ? "object-cover" : "",
        className
      )}
    />
  );
}