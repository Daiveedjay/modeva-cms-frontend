"use client";

import AdminActions from "@/app/(app)/admins/_components/admin-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { getMonthYear, getTime } from "@/lib/date-time-utils";
import { Admin } from "@/lib/types/admin";
import { capitaliseFirstLetter } from "@/lib/utils";

import { User } from "lucide-react";

export default function AdminRow({ admin }: { admin: Admin }) {
  return (
    <>
      <TableRow key={admin.id} className="">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={admin.avatar || "/placeholder.svg"}
                alt={admin.name}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{admin.name}</div>
              <div className="text-sm text-muted-foreground">
                {admin.role === "super_admin" ? "Super Admin" : "Admin"}
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell>
          {admin.email.charAt(0).toUpperCase() + admin.email.slice(1)}
        </TableCell>
        <TableCell>
          <Badge
            variant={
              admin.status === "active"
                ? "default"
                : admin.status === "inactive"
                  ? "secondary"
                  : "destructive"
            }>
            {capitaliseFirstLetter(admin.status)}
          </Badge>
        </TableCell>
        <TableCell className="text-sm">
          {getTime(admin?.last_login_at || undefined)}
        </TableCell>
        <TableCell className="text-sm">
          {getMonthYear(admin?.joined_at)}
        </TableCell>
        <TableCell>
          <AdminActions admin={admin} />
        </TableCell>
      </TableRow>
    </>
  );
}
