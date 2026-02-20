import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSkeleton({ length = 4 }: { length?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-25" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-15 mb-1" />
            <Skeleton className="h-3 w-30" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
