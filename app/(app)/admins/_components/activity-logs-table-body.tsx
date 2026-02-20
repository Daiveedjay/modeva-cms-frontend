"use client";

import { useState } from "react";
import { useGetAllAdminActivityLogs } from "@/app/_queries/admin/get-all-admin-activity-logs";
import { ActivityDetailsModal } from "@/app/(app)/admins/_modal/activity-details-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getDetailedActivityDescription } from "@/lib/activity-descriptions";
import { capitaliseFirstLetter, getActionColor } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ActivityLog } from "@/lib/types/admin";
import { PaginationControls } from "@/components/reuseables/pagination-controls";

export function ActivityLogsTableBody() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 5;

  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetAllAdminActivityLogs({
    page,
    limit,
  });

  const response = data?.data;
  const activityLogs = response?.logs || [];

  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            <p className="text-muted-foreground">Loading activity logs...</p>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!response || activityLogs.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            <p className="text-muted-foreground">No activity logs found</p>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {activityLogs.map((activity) => {
          const description = getDetailedActivityDescription(
            activity.action,
            activity.resource_type,
            activity.resource_name,
            activity.changes,
          );
          const actionColor = getActionColor(activity.action);

          return (
            <TableRow
              key={activity.id}
              className="border-border hover:bg-muted/40 transition-colors">
              <TableCell className="py-4">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={actionColor} variant="outline">
                      {activity.action.includes("created")
                        ? "Created"
                        : activity.action.includes("deleted")
                          ? "Deleted"
                          : "Updated"}
                    </Badge>
                  </div>
                  <p className="font-medium text-foreground">{description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.resource_type}
                  </p>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  {activity.status === "success" ? (
                    <Badge variant="default">Success</Badge>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <Badge variant="destructive">Error</Badge>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground py-4">
                {capitaliseFirstLetter(activity.admin_email)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground py-4">
                {new Date(activity.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell className="py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedActivity(activity);
                    setDetailsOpen(true);
                  }}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}

        <TableRow>
          <TableCell colSpan={6}>
            <PaginationControls<ActivityLog>
              data={data ? { ...data, data: data?.data?.logs } : undefined}
              isFetching={isFetching}
            />
          </TableCell>
        </TableRow>
      </TableBody>

      {/* Pagination and Details Modal - outside table */}
      <ActivityDetailsModal
        activity={selectedActivity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
