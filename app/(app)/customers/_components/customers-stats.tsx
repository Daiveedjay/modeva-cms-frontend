import { useGetCustomersStats } from "@/app/_queries/customers/get-customers-stats";
import StatsSkeleton from "@/components/reuseables/stats-skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, growthTextColorClass } from "@/lib/utils";
import { Users, UserPlus, Star } from "lucide-react";

export default function CustomersStats() {
  const { data, isLoading, isError, isFetching, refetch } =
    useGetCustomersStats();

  if (isLoading) return <StatsSkeleton length={3} />;

  const stats = data?.data;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_customers || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={growthTextColorClass(
                stats?.new_customers_growth_percentage,
              )}>
              {stats?.new_customers_growth_percentage ?? 0}%{" "}
            </span>
            since last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.new_customers_this_month || 0}
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Customers
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.active_customers || 0}
          </div>
          <p className="text-xs text-muted-foreground">High-value customers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Order Value
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats?.avg_order_value ?? 0)}
          </div>
          <p className="text-xs text-muted-foreground">Per customer</p>
        </CardContent>
      </Card>
    </div>
  );
}
