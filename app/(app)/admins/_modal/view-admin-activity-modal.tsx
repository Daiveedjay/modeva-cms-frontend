"use client";

import { useState } from "react";
import { useGetSingleAdminActivityLogs } from "@/app/_queries/admin/get-admin-activity-logs-by-id";

import { PaginationControls } from "@/components/reuseables/pagination-controls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { AlertCircle, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getDetailedActivityDescription } from "@/lib/activity-descriptions";
import { formatDateTime } from "@/lib/date-time-utils";
import { ActivityDetailsModal } from "@/app/(app)/admins/_modal/activity-details-modal";
import { getActionColor } from "@/lib/utils";
import { ActivityLog } from "@/lib/types/admin";

export function ViewAdminActivityModal() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;
  const adminModal = useAdminModalStore((s) => s.adminModal);
  const closeAdminModal = useAdminModalStore((s) => s.closeAdminModal);

  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const open =
    !!adminModal?.admin_id && adminModal.type === "view-admin-activity";
  const admin = adminModal?.admin_id ?? null;
  const adminId = adminModal?.admin_id ?? "";

  const { data, isLoading, isError, error, isFetching } =
    useGetSingleAdminActivityLogs(adminId || "", page, limit);

  const response = data?.data;
  const adminData = response?.admin;
  const activityLogs = response?.logs || [];

  if (isLoading) return null;

  if (isError) {
    return (
      <div className="p-4">Error loading activity logs: {error.message}</div>
    );
  }

  if (response === null || response === undefined) return null;
  if (!open || !admin) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) closeAdminModal();
        }}>
        <DialogContent className="w-[calc(100vw-2rem)] min-w-0 lg:min-w-4xl max-h-[90dvh] overflow-hidden flex flex-col p-0">
          {/* Header */}
          <div className="border-b border-border bg-background px-5 sm:px-8 py-5 sm:py-8 shrink-0">
            <div className="flex items-start gap-4 sm:gap-6">
              {adminData && (
                <>
                  <Avatar className="h-16 w-16 sm:h-24 sm:w-24 shrink-0 shadow-lg">
                    <AvatarImage
                      src={adminData.avatar || "/placeholder.svg"}
                      alt={adminData.name}
                    />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold">
                      {adminData.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 pt-1 sm:pt-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h2 className="text-lg sm:text-2xl font-bold truncate">
                        {adminData.name}
                      </h2>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {adminData.role === "super_admin"
                          ? "Super Admin"
                          : "Admin"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm truncate">
                      {adminData.email}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto px-4 sm:px-8">
            <div className="py-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-muted hover:bg-transparent">
                      <TableHead className="font-semibold text-foreground">
                        Activity
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-semibold text-foreground whitespace-nowrap">
                        Date
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
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
                                <Badge
                                  className={actionColor}
                                  variant="outline">
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
                          <TableCell className="text-right text-sm text-muted-foreground py-4 whitespace-nowrap">
                            {formatDateTime(activity.created_at)}
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
                  </TableBody>
                </Table>
              </div>
              <div className="border-t">
                <PaginationControls<ActivityLog>
                  data={data ? { ...data, data: data?.data?.logs } : undefined}
                  isFetching={isFetching}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ActivityDetailsModal
        activity={selectedActivity}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
