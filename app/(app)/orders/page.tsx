"use client";

import OrdersStats from "@/app/(app)/orders/_components/orders-stats";
import OrdersTable from "@/app/(app)/orders/_components/orders-table";
import { CancelOrderModal } from "@/app/(app)/orders/_modals/cancel-order-modal";
import { ManageInvoiceModal } from "@/app/(app)/orders/_modals/manage-invoice-modal";
import { UpdateOrderStatusModal } from "@/app/(app)/orders/_modals/update-order-status-modal";
import { ViewOrderDetailsModal } from "@/app/(app)/orders/_modals/view-order-details-modal";

import PageHeader from "@/components/reuseables/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function OrdersPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Orders"
            subtitle="Manage and track customer orders"
          />
        </div>
        <OrdersStats />
        <OrdersTable />

        <>
          <ViewOrderDetailsModal />
          <UpdateOrderStatusModal />
          <ManageInvoiceModal />
          <CancelOrderModal />
        </>
      </div>
    </SidebarInset>
  );
}
