import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";

export default function CategoriesLoading() {
  return (
    <SidebarInset>
      {/* Top header (sidebar + breadcrumb area) */}
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Separator orientation="vertical" className="h-4" />
        <Skeleton className="h-4 w-24" />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Page header + button */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Category stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>

        {/* Category table card */}
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-96 mb-6" />

            {/* Search bar */}
            <div className="flex items-center mb-6">
              <Skeleton className="h-10 w-80" />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              {/* Table header */}
              <div className="flex px-4 py-3 gap-4 border-b">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Table rows */}
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
