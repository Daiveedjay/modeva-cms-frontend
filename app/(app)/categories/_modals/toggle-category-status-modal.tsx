"use client";

import { useGetCategoryById } from "@/app/_queries/categories/get-category-by-id";
import { useToggleCategoryStatus } from "@/app/_queries/categories/toggle-category-status";
import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { Category } from "@/lib/types/category";
import { toastSuccess } from "@/lib/utils";
import { useState } from "react";

export function ToggleCategoryStatus() {
  const categoryModal = useCategoriesModalStore((s) => s.categoryModal);
  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );
  const category_id = categoryModal?.category_id ?? null;

  const open =
    categoryModal?.type === "toggle-category-status" && !!categoryModal;

  const { data, isLoading } = useGetCategoryById(String(category_id), open);

  const category = data?.data;

  // Keep modal closed until data loads
  if (!open || !category_id) return null;
  if (isLoading) return null;
  if (!category) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeCategoryModal();
      }}>
      <DialogContent key={category_id} className="sm:max-w-106.25">
        <ToggleInner
          category={category}
          closeCategoryModal={closeCategoryModal}
        />
      </DialogContent>
    </Dialog>
  );
}

function ToggleInner({
  category,
  closeCategoryModal,
}: {
  category: Category;
  closeCategoryModal: () => void;
}) {
  const { mutateAsync: toggleCategoryStatus, isPending } =
    useToggleCategoryStatus(category?.id ?? "");

  const switchId = `toggle-status-${category.id}`;
  const [localEnabled, setLocalEnabled] = useState(
    category.status === "Active",
  );

  const onSwitchChange = (newChecked: boolean) => {
    setLocalEnabled(newChecked);
  };

  const handleSubmit = async () => {
    const originalEnabled = category.status === "Active";

    // Close silently if no changes
    if (localEnabled === originalEnabled) {
      closeCategoryModal();
      return;
    }

    const newStatus: "Active" | "Inactive" = localEnabled
      ? "Active"
      : "Inactive";

    try {
      await toggleCategoryStatus({ status: newStatus });

      toastSuccess(`Category set to ${newStatus}`);
      closeCategoryModal();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const hasChanges = localEnabled !== (category.status === "Active");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Toggle category status</DialogTitle>
        <DialogDescription>
          Quickly enable or disable <strong>{category.name}</strong>.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2 py-4">
        <Switch
          id={switchId}
          checked={localEnabled}
          onCheckedChange={onSwitchChange}
          disabled={isPending}
        />
        <Label htmlFor={switchId} className="cursor-pointer">
          {localEnabled ? "Category is Active" : "Category is Inactive"}
        </Label>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={closeCategoryModal}
          disabled={isPending}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !hasChanges}>
          {isPending && <Spinner />}
          {isPending
            ? localEnabled
              ? "Activating..."
              : "Deactivating..."
            : localEnabled
              ? "Activate"
              : "Deactivate"}
        </Button>
      </DialogFooter>
    </>
  );
}
