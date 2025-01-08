import { format } from "date-fns";

// Get the current time in PST (Pakistan Standard Time)
export function getCurrentTimeInPST(): Date {
  return new Date(); // The default JavaScript Date object uses the local timezone
}

// Convert a date from a specific timezone to UTC
export function convertToUTC(date: Date): Date {
  return new Date(date.toISOString()); // Convert date to UTC by using ISO format
}

// Convert a UTC date to PST (assuming the system is using local timezone or handling conversion elsewhere)
export function convertToPST(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
}

// Format a date in PST
export function formatTime(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss"); // Formats in local timezone
}
