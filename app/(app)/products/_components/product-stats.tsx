import { useGetProductsStats } from "@/app/_queries/products/get-product-stats";
import StatsSkeleton from "@/components/reuseables/stats-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ClipboardList,
  Package,
  TrendingUp,
} from "lucide-react";

export default function ProductStats() {
  const { data, isLoading } = useGetProductsStats();

  if (isLoading) return <StatsSkeleton length={3} />;

  const stats = data?.data?.[0];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.active_products || 0} active
          </p>
        </CardContent>
      </Card>

      {/* Active Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.active_products || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.percentage_active?.toFixed(1)}% of all products
          </p>
        </CardContent>
      </Card>

      {/* Total Stock */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_inventory || 0}
          </div>
          <p className="text-xs text-muted-foreground">Items in stock</p>
        </CardContent>
      </Card>

      {/* Low Stock Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Products
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.low_stock_products || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.percentage_low_stock?.toFixed(1)}% of all products
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
