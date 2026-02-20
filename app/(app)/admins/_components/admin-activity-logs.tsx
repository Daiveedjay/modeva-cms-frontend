"use client";

import { ActivityLogsTableBody } from "@/app/(app)/admins/_components/activity-logs-table-body";
import { SearchActivityLogsModal } from "@/app/(app)/admins/_modal/search-activity-logs-modal";
import { SearchBar } from "@/components/reuseables/component-search";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export function AdminActivityLogs() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            View all admin activities across the system.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-8 items-center">
            <SearchBar
              onFocus={() => setOpen(true)}
              placeholder="Search activity logs..."
            />
          </div>

          {open && (
            <SearchActivityLogsModal
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            />
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <ActivityLogsTableBody />
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
    </>
  );
}
