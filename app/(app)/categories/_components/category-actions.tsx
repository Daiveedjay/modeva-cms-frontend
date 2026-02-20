"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { Category } from "@/lib/types/category";
import { toastWarn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

export function CategoryActions({
  category,
  parentStatus,
}: {
  category: Category;
  parentStatus?: string;
}) {
  const openCategoryModal = useCategoriesModalStore(
    (store) => store.openCategoryModal
  );

  const isParent = category.parent_id === null;

  const handleSubCategoryToggle = () => {
    if (!isParent && parentStatus !== "Active") {
      toastWarn(
        "The parent category is inactive. Please activate it first",
        "You cannot change the status of sub-categories under an inactive parent."
      );
      return;
    }

    openCategoryModal({
      type: "toggle-category-status",
      category_id: category.id,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-8 flex justify-center items-center w-8 p-0 hover:bg-primary/20 rounded-sm cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-2 space-y-1 w-48" align="end" sideOffset={4}>
        {isParent ? (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                openCategoryModal({
                  type: "update-category",
                  category_id: category.id,
                });
              }}>
              Update Category
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                openCategoryModal({
                  type: "toggle-category-status",
                  category_id: category.id,
                });
              }}>
              Change Status
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                openCategoryModal({
                  type: "add-sub-category",
                  category_id: category.id,
                });
              }}>
              Add Sub-category
            </Button>

            <Button
              variant="ghost"
              className="w-full text-destructive justify-start hover:bg-destructive/10"
              onClick={() => {
                openCategoryModal({
                  type: "delete-category",
                  category_id: category.id,
                });
              }}>
              Delete Category
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                openCategoryModal({
                  type: "update-sub-category",
                  category_id: category.id,
                });
              }}>
              Update Sub-category
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSubCategoryToggle}>
              Change Status
            </Button>

            <Button
              variant="ghost"
              className="w-full text-destructive justify-start hover:bg-destructive/10"
              onClick={() => {
                openCategoryModal({
                  type: "delete-sub-category",
                  category_id: category.id,
                });
              }}>
              Delete Sub-category
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
