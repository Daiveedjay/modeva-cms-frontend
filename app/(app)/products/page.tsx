"use client";

import ProductStats from "@/app/(app)/products/_components/product-stats";
import ProductsTable from "@/app/(app)/products/_components/products-table";
import { DeleteProductModal } from "@/app/(app)/products/_modals/delete-product-modal";
import { UpdateProductModal } from "@/app/(app)/products/_modals/update-product-modal";
import { ViewProductDetailsModal } from "@/app/(app)/products/_modals/view-product-modal";
import PageHeader from "@/components/reuseables/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { Plus } from "lucide-react";
import { CreateProductModal } from "./_modals/create-product-modal";

export default function ProductsPage() {
  const openProductModal = useProductModalStore(
    (store) => store.openProductModal,
  );

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Products"
            subtitle=" Manage your product inventory"
          />
          <Button
            onClick={() =>
              openProductModal({ type: "add-product", product_id: null })
            }>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>

          <CreateProductModal />
        </div>

        <ProductStats />
        <ProductsTable />
        <ViewProductDetailsModal />
        <UpdateProductModal />
        <DeleteProductModal />
      </div>
    </SidebarInset>
  );
}
