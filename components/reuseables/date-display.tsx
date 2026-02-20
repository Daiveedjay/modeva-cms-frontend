// src/components/ui/DateDisplay.tsx
import React from "react";

export interface DateDisplayProps {
  /** the date to render; can be a Date object or an ISO/string date */
  date: Date | string;
  /**
   * optional formatting options, passed to toLocaleDateString.
   * by default it will use the browser locale with year, month, day.
   */
  formatOptions?: Intl.DateTimeFormatOptions;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  formatOptions = { year: "numeric", month: "short", day: "numeric" },
}) => {
  // coerce string -> Date
  const d = typeof date === "string" ? new Date(date) : date;
  // guard against invalid date
  if (isNaN(d.getTime())) return <>Invalid date</>;

  return <>{d.toLocaleDateString(undefined, formatOptions)}</>;
};
