"use client";

import CustomersStats from "@/app/(app)/customers/_components/customers-stats";
import CustomersTable from "@/app/(app)/customers/_components/customers-table";
import { BanCustomerModal } from "@/app/(app)/customers/_modals/ban-customer-modal";
import { DeleteCustomerModal } from "@/app/(app)/customers/_modals/delete-customer-modal";
import { SendCustomerEmailModal } from "@/app/(app)/customers/_modals/send-customer-email-modal";
import { UnbanCustomerModal } from "@/app/(app)/customers/_modals/unban-customer-modal";
import { UpdateCustomerProfileModal } from "@/app/(app)/customers/_modals/update-customer-profile-modal";
import { ViewCustomerOrdersModal } from "@/app/(app)/customers/_modals/view-customer-orders-modal";
import { ViewCustomerProfileModal } from "@/app/(app)/customers/_modals/view-customer-profile-modal";
import PageHeader from "@/components/reuseables/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function CustomersPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Customers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Customers"
            subtitle="Manage your customer relationships"
          />
        </div>

        <CustomersStats />
        <CustomersTable />

        <ViewCustomerProfileModal />
        <ViewCustomerOrdersModal />
        <SendCustomerEmailModal />

        <BanCustomerModal />
        <UnbanCustomerModal />
        <DeleteCustomerModal />

        <UpdateCustomerProfileModal />
      </div>
    </SidebarInset>
  );
}
