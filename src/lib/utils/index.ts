import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rawBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/fahry-portfolio" : "");

export const BASE_PATH = rawBasePath.replace(/\/+$/, "");

/**
 * Resolves local asset paths to account for subpath deployments (e.g. GitHub Pages).
 * Preserves remote URLs (http/https), data URIs, and avoids duplicate basePath prefixes.
 */
export function getAssetPath(src: string): string {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  const cleanPath = src.startsWith("/") ? src : `/${src}`;
  if (BASE_PATH && (cleanPath === BASE_PATH || cleanPath.startsWith(`${BASE_PATH}/`))) {
    return cleanPath;
  }

  return BASE_PATH ? `${BASE_PATH}${cleanPath}` : cleanPath;
}