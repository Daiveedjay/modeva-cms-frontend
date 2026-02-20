"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { getDetailedActivityDescription } from "@/lib/activity-descriptions";
import { capitaliseFirstLetter, getActionColor } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";
import { ApiResponse } from "@/lib/types";
import { ActivityLog } from "@/lib/types/admin";

interface ActivityLogsSearchResultsProps {
  logs: ActivityLog[];
  query: string;
  data: ApiResponse<{ logs: ActivityLog[] }> | undefined;
  isFetching: boolean;
  onActivityClick: (activity: ActivityLog) => void;
}

export function ActivityLogsSearchResults({
  logs,
  query,
  data,
  isFetching,
  onActivityClick,
}: ActivityLogsSearchResultsProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Showing {logs.length} result(s)
        {query && ` for "${query}"`}
      </p>
      <div className="overflow-auto max-h-[50vh] rounded-md border">
        <Table>
          <TableHeader className="bg-muted/30 sticky top-0">
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((activity) => {
              const description = getDetailedActivityDescription(
                activity.action,
                activity.resource_type,
                activity.resource_name,
                activity.changes,
              );
              const actionColor = getActionColor(activity.action);

              return (
                <TableRow key={activity.id}>
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
                      <p className="font-medium text-foreground">
                        {description}
                      </p>
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
                    {new Date(activity.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onActivityClick(activity)}
                      disabled={isFetching}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="border-t pt-4">
        <PaginationControls<ActivityLog>
          data={data ? { ...data, data: data?.data?.logs } : undefined}
          isFetching={isFetching}
        />
      </div>
    </>
  );
}