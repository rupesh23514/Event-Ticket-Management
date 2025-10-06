import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into one string and merges Tailwind CSS classes efficiently
 * @param {string[]} inputs - Class names to be combined
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}