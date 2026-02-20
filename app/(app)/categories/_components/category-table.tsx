import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DeleteCategoryModal } from "../_modals/delete-category-modal";

import { useState } from "react";
import { ReassignSubcategories } from "../_modals/reassign-sub-categories-modal";
import { ToggleCategoryStatus } from "../_modals/toggle-category-status-modal";
import { UpdateCategoryModal } from "../_modals/update-category-modal";
import { CategoryTableBody } from "./category-table-body";

import { SearchCategoriesModal } from "../_modals/search-categories-modal";
import { SearchBar } from "@/components/reuseables/component-search";

export default function CategoryTable() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>
          Manage your product categories and their hierarchical structure.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-8 items-center">
          <SearchBar
            onFocus={() => setOpen(true)}
            query={query}
            setQuery={setQuery}
            placeholder="Search categories..."
          />
        </div>
        {open && (
          <SearchCategoriesModal
            open={open}
            query={query}
            setQuery={setQuery}
            onClose={() => {
              setOpen(false);
              setQuery("");
            }}
          />
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <CategoryTableBody />
          </Table>
        </div>

        <UpdateCategoryModal />
        <DeleteCategoryModal />
        <ToggleCategoryStatus />
        <ReassignSubcategories />
      </CardContent>
    </Card>
  );
}
