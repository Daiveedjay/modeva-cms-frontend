import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ActivityChanges,
  getDetailedActivityDescription,
} from "@/lib/activity-descriptions";
import { Badge } from "@/components/ui/badge";

import { isIsoDateString, formatDateTime } from "@/lib/date-time-utils";
import { capitaliseFirstLetter } from "@/lib/utils";
import { ActivityLog } from "@/lib/types/admin";

function renderValue(value: unknown) {
  if (value == null) return "—";

  if (isIsoDateString(value)) {
    return <span>{formatDateTime(value)}</span>;
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

interface ActivityDetailsModalProps {
  activity: ActivityLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDetailsModal({
  activity,
  open,
  onOpenChange,
}: ActivityDetailsModalProps) {
  if (!activity) return null;

  const changes = activity.changes as ActivityChanges;
  const before = changes?.before || {};
  const after = changes?.after || {};

  const changedFields = Object.keys(after).filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {getDetailedActivityDescription(
              activity.action,
              activity.resource_type,
              activity.resource_name,
              activity.changes,
            )}
          </DialogTitle>
          <DialogDescription className=" flex gap-2">
            <span> {capitaliseFirstLetter(activity.admin_email)}</span>
            <span> {new Date(activity.created_at).toLocaleString()}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Changed Fields */}
          {changedFields.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Changed Fields</h3>
              <div className="space-y-3">
                {changedFields.map((field) => (
                  <div key={field} className="border rounded-lg p-3 space-y-2">
                    <p className="font-medium text-sm text-foreground">
                      {field}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {/* Before */}
                      <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded">
                        <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                          Before
                        </p>
                        <div className="wrap-break-word font-mono text-xs text-muted-foreground">
                          {renderValue(before[field])}
                        </div>
                      </div>

                      {/* After */}
                      <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                          After
                        </p>
                        <div className="wrap-break-word font-mono text-xs text-muted-foreground">
                          {renderValue(after[field])}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">IP Address</p>
                <p className="font-mono text-xs">{activity.ip_address}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <Badge
                  variant={
                    activity.status === "success" ? "default" : "destructive"
                  }>
                  {activity.status}
                </Badge>
              </div>

              {activity.error_message && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Error Message</p>
                  <p className="text-red-600 text-xs">
                    {activity.error_message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
