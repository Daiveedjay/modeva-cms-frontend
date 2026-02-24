"use client";

import { useGetOrdersStats } from "@/app/_queries/orders/get-order-stats";
import StatsSkeleton from "@/components/reuseables/stats-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { growthTextColorClass } from "@/lib/utils";
import { Clock, Package, CheckCircle, ShoppingCart } from "lucide-react";

export default function OrdersStats() {
  const { data, isLoading } = useGetOrdersStats();

  if (isLoading) return <StatsSkeleton length={4} />;

  const stats = data?.data;

  const totalOrders = stats?.total_orders ?? 0;
  const percentChange = stats?.change_percent_from_last_month ?? null;

  const pending = stats?.pending.count ?? 0;
  const processing = stats?.processing.count ?? 0;
  const completed = stats?.completed.count ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : totalOrders}
          </div>
          <p className="text-xs text-muted-foreground">
            {percentChange !== null ? (
              <>
                <span className={growthTextColorClass(percentChange)}>
                  {percentChange.toFixed(1)}%
                </span>{" "}
                from last month
              </>
            ) : (
              "No data"
            )}
          </p>
        </CardContent>
      </Card>

      {/* Pending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : pending}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.pending.description ?? "Awaiting processing"}
          </p>
        </CardContent>
      </Card>

      {/* Processing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : processing}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.processing.description ?? "Being prepared"}
          </p>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : completed}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.completed.description ?? "Successfully delivered"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
