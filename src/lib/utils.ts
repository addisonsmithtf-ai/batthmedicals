import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Not available";
  
  try {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Normalize common Postgres format with space between date and time
      date = new Date(dateString.replace(" ", "T"));
    }
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString('en-GB');
  } catch {
    return "Invalid date";
  }
}
