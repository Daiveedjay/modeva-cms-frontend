import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AnalyticsLoading() {
  return (
    <SidebarInset>
      {/* Top header (sidebar + breadcrumb area) */}
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Separator orientation="vertical" className="h-4" />
        <Skeleton className="h-4 w-24" />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Page header */}
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Analytics overview stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Top products + monthly chart */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top products */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-6" />

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly financials */}
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-56 mb-6" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        </div>

        {/* Sales metrics, geographic data, device analytics */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Sales metrics */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Geographic data */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>

          {/* Device analytics */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
