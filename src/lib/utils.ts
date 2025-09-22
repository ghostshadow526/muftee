// Core utility functions for className merging and conditional styling
import { type ClassValue } from "clsx";

declare const clsx: (...inputs: ClassValue[]) => string;
declare const twMerge: (classNames: string) => string;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}