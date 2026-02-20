import { useGetAnalyticsOverview } from "@/app/_queries/analytics/get-analytics-overview";
import StatsSkeleton from "@/components/reuseables/stats-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";

function getGrowthMeta(value: number) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return {
    Icon: isPositive ? TrendingUp : TrendingDown,
    sign: isPositive ? "+" : "",
    className: isPositive
      ? "text-green-500"
      : isNegative
        ? "text-destructive"
        : "text-muted-foreground",
    formatted: Math.abs(value).toFixed(2),
  };
}

export default function AnalyticsStats() {
  const { data, isLoading } = useGetAnalyticsOverview();

  if (isLoading) return <StatsSkeleton length={3} />;

  const analytics = data?.data;

  const revenueGrowth = getGrowthMeta(analytics?.revenue_growth_percent ?? 0);
  const ordersGrowth = getGrowthMeta(analytics?.orders_growth_percent ?? 0);
  const inventoryGrowth = getGrowthMeta(
    analytics?.inventory_growth_percent ?? 0,
  );
  const customersGrowth = getGrowthMeta(
    analytics?.active_customers_growth_percent ?? 0,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(analytics?.total_revenue ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <revenueGrowth.Icon
              className={`h-3 w-3 ${revenueGrowth.className}`}
            />
            <span className={revenueGrowth.className}>
              {revenueGrowth.sign}
              {revenueGrowth.formatted}%
            </span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.total_orders ?? 0}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <ordersGrowth.Icon
              className={`h-3 w-3 ${ordersGrowth.className}`}
            />
            <span className={ordersGrowth.className}>
              {ordersGrowth.sign}
              {ordersGrowth.formatted}%
            </span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory</CardTitle>
          <Warehouse className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.total_inventory ?? 0}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <inventoryGrowth.Icon
              className={`h-3 w-3 ${inventoryGrowth.className}`}
            />
            <span className={inventoryGrowth.className}>
              {inventoryGrowth.sign}
              {inventoryGrowth.formatted}%
            </span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Active Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Customers
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.active_customers ?? 0}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <customersGrowth.Icon
              className={`h-3 w-3 ${customersGrowth.className}`}
            />
            <span className={customersGrowth.className}>
              {customersGrowth.sign}
              {customersGrowth.formatted}%
            </span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
