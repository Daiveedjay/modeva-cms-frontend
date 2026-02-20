"use client";

import { useGetMonthlyRevenue } from "@/app/_queries/analytics/get-monthly-revenue";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function MonthlyRevenueChart() {
  const { data, isLoading, isError } = useGetMonthlyRevenue();
  const chartData = data?.data ?? [];

  const [barColor] = useState("oklch(0.92 0.05 67.14)");

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">
          Failed to load monthly revenue data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={<RevenueTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="revenue" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        )}
      </div>
    </div>
  );
}

interface RevenueTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

function RevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;

  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">${Number(value).toLocaleString()}</p>
    </div>
  );
}
