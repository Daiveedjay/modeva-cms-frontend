import { SearchBar } from "@/components/reuseables/component-search";
import OrdersTableBody from "@/app/(app)/orders/_components/orders-table-body";
import { SearchOrdersModal } from "@/app/(app)/orders/_modals/search-orders-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useState } from "react";

export default function OrdersTable() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          A list of recent orders from your customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-8 items-center">
          <SearchBar
            onFocus={() => setOpen(true)}
            query={query}
            setQuery={setQuery}
            placeholder="Search orders..."
          />
        </div>

        {open && (
          <SearchOrdersModal open={open} onClose={() => setOpen(false)} />
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total (USD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <OrdersTableBody />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
