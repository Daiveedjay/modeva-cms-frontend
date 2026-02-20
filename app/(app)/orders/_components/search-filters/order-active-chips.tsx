"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSearchOrdersStore } from "@/app/(app)/orders/_hooks/use-search-order-store";
import { formatNiceDate } from "@/lib/utils";

export function OrderActiveChips() {
  const store = useSearchOrdersStore();

  const chips = useMemo(() => {
    const result: Array<{
      key: string;
      label: string;
      onRemove: () => void;
    }> = [];

    if (store.orderNumber.trim()) {
      result.push({
        key: "order_number",
        label: `order: ${store.orderNumber.trim()}`,
        onRemove: () => store.clearOrderNumber(),
      });
    }

    if (store.customer.trim()) {
      result.push({
        key: "customer",
        label: `customer: ${store.customer.trim()}`,
        onRemove: () => store.clearCustomer(),
      });
    }

    if (store.email.trim()) {
      result.push({
        key: "email",
        label: `email: ${store.email.trim()}`,
        onRemove: () => store.clearEmail(),
      });
    }

    if (store.status !== "all") {
      result.push({
        key: "status",
        label: `status: ${store.status}`,
        onRemove: () => store.clearStatus(),
      });
    }

    if (store.useExactPrice && typeof store.exactPrice === "number") {
      result.push({
        key: "price",
        label: `price: ${store.exactPrice}`,
        onRemove: () => store.clearPrice(),
      });
    } else if (store.priceRange[0] !== 0 || store.priceRange[1] !== 10000) {
      result.push({
        key: "price_range",
        label: `price: ${store.priceRange[0]} - ${store.priceRange[1]}`,
        onRemove: () => store.clearPrice(),
      });
    }

    if (store.dateRange?.from || store.dateRange?.to) {
      const from = store.dateRange?.from
        ? formatNiceDate(store.dateRange.from)
        : "any";
      const to = store.dateRange?.to
        ? formatNiceDate(store.dateRange.to)
        : "any";

      result.push({
        key: "date_range",
        label: `date: ${from} → ${to}`,
        onRemove: () => store.clearDateRange(),
      });
    }

    return result;
  }, [store]);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge key={chip.key} variant="secondary" className="gap-1">
          <span className="truncate max-w-65">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="ml-1 rounded hover:bg-muted/50 p-0.5"
            aria-label={`remove ${chip.label}`}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => store.clearAllFilters()}>
        Clear all
      </Button>
    </div>
  );
}
