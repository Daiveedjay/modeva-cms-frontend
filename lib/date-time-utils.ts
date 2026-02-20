export function isIsoDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;

  // Strict ISO 8601 with optional milliseconds + Z
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

export function formatDateTime(
  value: string,
  timeStyle: "short" | "medium" | "long" = "short",
) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: timeStyle,
  });
}

export const getTime = (date?: string) =>
  date
    ? new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const getRelativeDays = (date?: string) => {
  if (!date) return "—";
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const loginDate = new Date(date);
  loginDate.setHours(0, 0, 0, 0); // Start of login day

  const diffDays = Math.round(
    (today.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export const getMonthYear = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";
