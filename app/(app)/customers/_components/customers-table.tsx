import { SearchBar } from "@/components/reuseables/component-search";
import CustomerTableBody from "@/app/(app)/customers/_components/customer-table-body";
import { SearchCustomersModal } from "@/app/(app)/customers/_modals/search-customers-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// import { getOrderStatusVariant } from "@/lib/utils";
import { useState } from "react";
import { AdminOnly } from "@/components/reuseables/admin-only";

export default function CustomersTable() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Directory</CardTitle>
        <CardDescription>
          A comprehensive list of all your customers and their purchase history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 items-center">
          <SearchBar
            onFocus={() => setOpen(true)}
            query={query}
            setQuery={setQuery}
            placeholder="Search customers..."
          />
        </div>

        {open && (
          <SearchCustomersModal open={open} onClose={() => setOpen(false)} />
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent (USD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <AdminOnly>
                  {" "}
                  <TableHead className="w-17.5">Actions</TableHead>
                </AdminOnly>
              </TableRow>
            </TableHeader>

            <CustomerTableBody />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
