"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type MobileReassignProps = {
  childrenfromCategory: Category[];
  availableParents: Category[];
  assignments: Record<string, string | undefined>;
  onAssign: (subId: string, parentId: string) => void;
  onUnassign: (subId: string) => void;
  isPending?: boolean;
};

export default function MobileReassignLayout({
  childrenfromCategory,
  availableParents,
  assignments,
  onAssign,
  onUnassign,
  isPending,
}: MobileReassignProps) {
  const assignedCount = Object.keys(assignments).filter(
    (k) => assignments[k],
  ).length;
  const total = childrenfromCategory.length;

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground">
          Assign each sub-category to a new parent before deleting.
        </p>
        <Badge
          variant={assignedCount === total ? "default" : "secondary"}
          className="shrink-0 ml-2">
          {assignedCount}/{total}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(assignedCount / total) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Sub-category cards */}
      <div className="flex flex-col gap-3 mt-2">
        {childrenfromCategory.map((sub, i) => {
          const assignedParentId = assignments[sub.id];
          const assignedParent = availableParents.find(
            (p) => p.id === assignedParentId,
          );
          const isAssigned = !!assignedParentId;

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              className={cn(
                "rounded-xl border-2 p-4 transition-colors duration-200",
                isAssigned
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card",
              )}>
              {/* Sub label row */}
              <div className="flex items-center gap-2 mb-3">
                <AnimatePresence mode="wait">
                  {isAssigned ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="circle"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="font-medium text-sm">{sub.name}</span>
                {isAssigned && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-xs border-primary/40 text-primary shrink-0">
                    Assigned
                  </Badge>
                )}
              </div>

              {/* Assignment row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Select
                    disabled={isPending}
                    value={assignedParentId ?? ""}
                    onValueChange={(val) => {
                      if (val === "__unassign__") {
                        onUnassign(sub.id);
                      } else {
                        onAssign(sub.id, val);
                      }
                    }}>
                    <SelectTrigger
                      className={cn(
                        "w-full text-sm h-9",
                        isAssigned && "border-primary/40 text-primary",
                      )}>
                      <SelectValue placeholder="Select a parent category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {isAssigned && (
                        <SelectItem value="__unassign__">
                          <span className="text-muted-foreground">
                            — Remove assignment
                          </span>
                        </SelectItem>
                      )}
                      {availableParents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Assigned-to summary */}
              <AnimatePresence>
                {isAssigned && assignedParent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5">
                      <span className="font-medium text-foreground">
                        {sub.name}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span className="font-medium text-primary">
                        {assignedParent.name}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
