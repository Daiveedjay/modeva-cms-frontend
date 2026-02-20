"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";


import PageHeader from "@/components/reuseables/page-header";
import AnalyticsStats from "./_components/analytics-stats";
import TopProducts from "./_components/top-products";
import { SalesMetrics } from "@/app/(app)/analytics/_components/sales-metrics";
import { GeographicDataTable } from "@/app/(app)/analytics/_components/geographic-data";
import { DeviceAnalytics } from "@/app/(app)/analytics/_components/device-analytics";

export default function AnalyticsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageHeader
          title="Analytics"
          subtitle="Track your store performance and insights"
        />

        <AnalyticsStats />

        <TopProducts />

        <div className="grid gap-4 md:grid-cols-3">
          <SalesMetrics />

          <GeographicDataTable />

          <DeviceAnalytics />
        </div>
      </div>
    </SidebarInset>
  );
}
