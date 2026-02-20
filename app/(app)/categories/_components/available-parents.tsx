import React, { RefObject } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/types/category";

type AvailableParentsProps = {
  availableParents: Category[];
  activeSub: string | null;
  handleParentClick: (id: string) => void;
  assignments: Record<string, string | undefined>;
  parentRefs: RefObject<Record<string, HTMLElement>>;
};
export default function AvailableParents({
  availableParents,
  activeSub,
  handleParentClick,
  assignments,
  parentRefs,
}: AvailableParentsProps) {
  return (
    <div className="flex-1  max-h-fit  space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          Available parent categories
          <Badge variant="secondary">{availableParents.length}</Badge>
        </h4>
      </div>
      <div className="space-y-3 flex flex-col justify-end items-end">
        {availableParents.map((parent) => {
          const assignedCount = Object.values(assignments).filter(
            (id) => id === parent.id
          ).length;
          return (
            <motion.div
              key={parent.id}
              ref={(el) => {
                if (el) parentRefs.current[parent.id] = el;
              }}
              onClick={() => handleParentClick(parent.id)}
              className={cn(
                "group cursor-pointer w-3/4! p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
                !activeSub && "cursor-not-allowed opacity-60",
                activeSub &&
                  "hover:border-primary hover:bg-card-foreground hover:text-background ",
                assignedCount > 0 &&
                  "border-secondary text-background bg-primary"
              )}>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={assignedCount > 0}
                  className="data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
                />
                <span className="font-medium">{parent.name}</span>
                {assignedCount > 0 && (
                  <Badge className="ml-auto bg-sidebar-primary text-foreground">
                    {assignedCount} assigned
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
