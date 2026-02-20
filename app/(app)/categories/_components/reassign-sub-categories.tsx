import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { RefObject } from "react";

type ReassignSubCategoriesProps = {
  childrenfromCategory: Category[];
  activeSub: string | null;
  handleSubClick: (id: string) => void;
  subRefs: RefObject<Record<string, HTMLElement>>;
  assignments: Record<string, string | undefined>;
  categories: Category[];
};
export default function ReassignSubCategories({
  childrenfromCategory,
  activeSub,
  handleSubClick,
  subRefs,
  assignments,
  categories,
}: ReassignSubCategoriesProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          Sub-categories to reassign
          <Badge variant="secondary">{childrenfromCategory.length}</Badge>
        </h4>
      </div>
      <div className="space-y-3">
        {childrenfromCategory.map((sub) => (
          <motion.div
            key={sub.id}
            ref={(el) => {
              if (el) subRefs.current[sub.id] = el;
            }}
            onClick={() => handleSubClick(sub.id)}
            className={cn(
              "group w-3/4! cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
              activeSub === sub.id
                ? "border-primary bg-card-foreground text-background shadow-md"
                : "border-border hover:border-secondary hover:bg-secondary/10",
              assignments[sub.id] &&
                "border-secondary hover:bg-primary/80 bg-primary hover:border-foreground text-background",
            )}>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={!!assignments[sub.id]}
                className="data-[state=checked]:bg-sidebar-primary data-[state=checked]:border-sidebar-primary"
              />
              <span className="font-medium">{sub.name}</span>
              {assignments[sub.id] && (
                <Badge
                  variant="outline"
                  className="ml-auto text-sidebar-primary border-sidebar-primary">
                  Assigned to{" "}
                  {categories.find((c) => c.id === assignments[sub.id])?.name}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeSub && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-primary text-background rounded-lg">
            <p className="text-sm font-medium">
              Click on an available category to assign &quot;
              {childrenfromCategory.find((c) => c.id === activeSub)?.name}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
