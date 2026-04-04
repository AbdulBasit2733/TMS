import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const BASE_API_URL = '/api/v1';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
