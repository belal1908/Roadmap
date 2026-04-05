import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function demandFromCount(openRoles: number): "High" | "Medium" | "Low" {
  if (openRoles >= 2000) {
    return "High";
  }

  if (openRoles >= 700) {
    return "Medium";
  }

  return "Low";
}

export function completionPercentage(completed: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}
