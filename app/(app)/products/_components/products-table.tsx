import { SearchBar } from "@/components/reuseables/component-search";
import ProductsTableBody from "@/app/(app)/products/_components/products-table-body";
import { SearchProductsModal } from "@/app/(app)/products/_modals/search-products-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useState } from "react";

export default function ProductsTable() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Inventory</CardTitle>
        <CardDescription>
          A list of all products in your store including their name, category,
          price, and stock status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-8 items-center">
          <SearchBar
            onFocus={() => setOpen(true)}
            query={query}
            setQuery={setQuery}
            placeholder="Search products..."
          />
        </div>

        {open && (
          <SearchProductsModal
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
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Sub-category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <ProductsTableBody />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
