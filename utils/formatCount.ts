/**
 * Formats a number into a human-readable string with suffixes (k, M, B).
 * Examples:
 *  - 950 -> "950"
 *  - 1,200 -> "1.2k"
 *  - 1,000,000 -> "1M"
 *  - 1,500,000,000 -> "1.5B"
 *
 * @param value - The number to format (can be null/undefined)
 * @returns A formatted string.
 */
export function formatCount(value?: number | null): string {
  if (value == null || isNaN(value)) return "0"; // Handle undefined, null, or NaN
  
  const absValue = Math.abs(value); // Handle negative numbers correctly
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000)
    return sign + (absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (absValue >= 1_000_000)
    return sign + (absValue / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (absValue >= 1_000)
    return sign + (absValue / 1_000).toFixed(1).replace(/\.0$/, "") + "k";

  return sign + absValue.toString();
}
