import { useGetCategoriesStats } from "@/app/_queries/categories/get-categories-stats";
import StatsSkeleton from "@/components/reuseables/stats-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderTree } from "lucide-react";

export default function CategoryStats() {
  const { data, isLoading } = useGetCategoriesStats();

  if (isLoading) {
    return <StatsSkeleton length={3} />;
  }

  const stats = data?.data;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Categories
          </CardTitle>
          <FolderTree className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_categories ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.parent_categories ?? 0} parent categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Categories
          </CardTitle>
          <FolderTree className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.active_categories ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.percentage_active_categories?.toFixed(1)}% of total categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Parent Categories
          </CardTitle>
          <FolderTree className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.active_parent_categories ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.percentage_active_parents?.toFixed(1)}% of parent categories
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
