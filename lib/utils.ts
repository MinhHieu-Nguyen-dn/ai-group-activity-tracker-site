import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkMonthReset(lastResetDateStr: string | null): boolean {
  // Get current date in GMT+7
  const now = new Date()
  const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000)

  // If no last reset date, set it now and return false
  if (!lastResetDateStr) {
    localStorage.setItem("lastResetDate", now.toISOString())
    return false
  }

  const lastResetDate = new Date(lastResetDateStr)
  const lastResetGmt7 = new Date(lastResetDate.getTime() + 7 * 60 * 60 * 1000)

  // Check if we're in a new month compared to the last reset
  return lastResetGmt7.getMonth() !== gmt7Date.getMonth() || lastResetGmt7.getFullYear() !== gmt7Date.getFullYear()
}

