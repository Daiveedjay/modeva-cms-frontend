"use client";

import { useGetGeographicData } from "@/app/_queries/analytics/get-geographic-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GeographicDataTable() {
  const { data, isLoading, isError } = useGetGeographicData();

  const countries = data?.data;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">Failed to load geographic data</p>
      </div>
    );
  }

  return (
    <Card>
      {" "}
      <CardHeader>
        <CardTitle>Geographic Data</CardTitle>
      </CardHeader>
      <CardContent className="">
        {" "}
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </>
            ) : countries && countries.length > 0 ? (
              countries.map((country) => (
                <div key={country.country} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {country.country}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {country.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {country.order_count.toLocaleString()}{" "}
                    {country.order_count === 1 ? "order" : "orders"}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No geographic data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
