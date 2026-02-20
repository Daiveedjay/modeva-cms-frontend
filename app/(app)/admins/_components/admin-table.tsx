import AdminTableBody from "@/app/(app)/admins/_components/admin-table-body";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Users</CardTitle>
        <CardDescription>
          Manage admin accounts and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-17.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <AdminTableBody />
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
