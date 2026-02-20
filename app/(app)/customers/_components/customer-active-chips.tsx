import { useSearchCustomersStore } from "@/app/(app)/customers/_hooks/use-search-customers-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CustomerActiveChips() {
  const {
    name,
    email,
    country,
    status,
    useDateRange,
    dateRange,
    exactJoinedDate,
    useExactSpending,
    exactSpending,
    spendingRange,
    setName,
    setEmail,
    setCountry,
    setStatus,
    setDateRange,
    setExactJoinedDate,
    setUseExactSpending,
    setExactSpending,
    setSpendingRange,
    reset,
  } = useSearchCustomersStore();

  const chips = [];

  if (name) chips.push({ label: `Name: ${name}`, onRemove: () => setName("") });
  if (email)
    chips.push({ label: `Email: ${email}`, onRemove: () => setEmail("") });
  if (country)
    chips.push({
      label: `Country: ${country}`,
      onRemove: () => setCountry(""),
    });
  if (status !== "all")
    chips.push({
      label: `Status: ${status}`,
      onRemove: () => setStatus("all"),
    });

  // Joined date filters
  if (useDateRange) {
    if (dateRange.from)
      chips.push({
        label: `From: ${dateRange.from.toLocaleDateString()}`,
        onRemove: () => setDateRange(undefined, dateRange.to),
      });
    if (dateRange.to)
      chips.push({
        label: `To: ${dateRange.to.toLocaleDateString()}`,
        onRemove: () => setDateRange(dateRange.from, undefined),
      });
  } else if (exactJoinedDate) {
    chips.push({
      label: `Joined: ${exactJoinedDate.toLocaleDateString()}`,
      onRemove: () => setExactJoinedDate(undefined),
    });
  }

  if (useExactSpending)
    chips.push({
      label: `Spent: $${exactSpending}`,
      onRemove: () => setUseExactSpending(false),
    });
  if (
    !useExactSpending &&
    (spendingRange[0] > 0 || spendingRange[1] < 10000000)
  ) {
    chips.push({
      label: `Spending: $${spendingRange[0]} - $${spendingRange[1]}`,
      onRemove: () => setSpendingRange(0, 10000000),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {chips.map((chip) => (
        <Badge key={chip.label} variant="secondary" className="pl-2">
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-1 hover:text-foreground transition-colors">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={reset}
        className="text-xs text-muted-foreground hover:text-foreground">
        Clear all
      </Button>
    </div>
  );
}
