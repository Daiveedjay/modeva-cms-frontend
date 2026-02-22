"use client";

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
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { Plus } from "lucide-react";
import CategoryStats from "./_components/category-stats";
import CategoryTable from "./_components/category-table";
import { CreateCategoryModal } from "./_modals/create-category-modal";
import { AdminOnly } from "@/components/reuseables/admin-only";

export default function CategoriesPage() {
  const openCategoryModal = useCategoriesModalStore(
    (store) => store.openCategoryModal,
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
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Categories"
            subtitle="Organize your products into categories"
          />
          <AdminOnly>
            {" "}
            <Button
              onClick={() =>
                openCategoryModal({ type: "add-category", category_id: null })
              }>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </AdminOnly>

          <CreateCategoryModal />
        </div>

        <CategoryStats />
        <CategoryTable />
      </div>
    </SidebarInset>
  );
}
