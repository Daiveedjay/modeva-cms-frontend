"use client";

import { useGetSalesMetrics } from "@/app/_queries/analytics/get-sales-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, TrendingUp } from "lucide-react";

export function SalesMetrics() {
  const { data, isLoading, isError } = useGetSalesMetrics();

  const metrics = data?.data;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">Failed to load sales metrics</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {" "}
        <div className="grid gap-2 grid-cols-1">
          {/* Average Order Value */}
          <MetricCard
            icon={DollarSign}
            label="Average Order Value"
            value={metrics?.average_order_value}
            isCurrency
            isLoading={isLoading}
          />

          {/* Customer Lifetime Value */}
          <MetricCard
            icon={Users}
            label="Customer Lifetime Value"
            value={metrics?.customer_lifetime_value}
            isCurrency
            isLoading={isLoading}
          />

          {/* Return Customer Rate */}
          <MetricCard
            icon={TrendingUp}
            label="Return Customer Rate"
            value={metrics?.return_customer_rate}
            isPercentage
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: number;
  isCurrency?: boolean;
  isPercentage?: boolean;
  isLoading?: boolean;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  isCurrency = false,
  isPercentage = false,
  isLoading = false,
}: MetricCardProps) {
  const formatValue = (val?: number): string => {
    if (val === undefined) return "-";
    if (isCurrency) {
      return `$${val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    if (isPercentage) {
      return `${val.toFixed(1)}%`;
    }
    return val.toFixed(2);
  };

  return (
    <div className={`rounded-lg border p-2`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {/* <Icon className="h-3 w-3 opacity-50" /> */}
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-sm font-bold">{formatValue(value)}</p>
        )}
      </div>
    </div>
  );
}
