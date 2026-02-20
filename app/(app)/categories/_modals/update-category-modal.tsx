"use client";

import { useGetCategoryById } from "@/app/_queries/categories/get-category-by-id";
import { useGetParentCategories } from "@/app/_queries/categories/get-parent-categories";
import { useUpdateCategory } from "@/app/_queries/categories/update-category";

import CharacterCounter from "@/components/reuseables/character-counter";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MAX_CATEGORY_DESCRIPTION_LENGTH,
  MAX_CATEGORY_NAME_LENGTH,
} from "@/lib/constants";
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { UpdateCategoryInput } from "@/lib/types/category";
import { toastSuccess } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { FormEvent, useState } from "react";

export function UpdateCategoryModal() {
  const categoryModal = useCategoriesModalStore((s) => s.categoryModal);
  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const isUpdateCategory = categoryModal?.type === "update-category";
  const isUpdateSub = categoryModal?.type === "update-sub-category";

  const category_id = categoryModal?.category_id;

  const open = Boolean(
    categoryModal && category_id && (isUpdateCategory || isUpdateSub),
  );

  const { data, isLoading, isError } = useGetCategoryById(
    String(category_id),
    open,
  );

  const category = data?.data;

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeCategoryModal();
      }}>
      <DialogContent
        key={`${categoryModal?.type}-${category_id}`}
        className="sm:max-w-106.25">
        {isLoading && (
          <div className="py-8 flex items-center justify-center gap-2">
            <Spinner width={4} height={4} />
            <span className="text-sm text-muted-foreground">Loading…</span>
          </div>
        )}

        {!isLoading && (isError || !category) && (
          <>
            <DialogHeader>
              <DialogTitle>Can&apos;t open details</DialogTitle>
              <DialogDescription>
                We could not load this category. Please try again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={closeCategoryModal}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}

        {!isLoading && category && (
          <>
            {isUpdateSub ? (
              <SubCategoryContent
                category={{
                  id: category.id,
                  name: category.name,
                  description: category.description ?? "",
                  parentName: category.parent_name ?? null,
                  parentId: category.parent_id ?? null,
                }}
              />
            ) : (
              <CategoryContent
                category={{
                  id: category.id,
                  name: category.name,
                  description: category.description ?? "",
                }}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CategoryContent({
  category,
}: {
  category: { id: string; name: string; description: string };
}) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const { mutateAsync: updateCategory, isPending } = useUpdateCategory(
    category.id,
  );

  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const changed =
    (newName.trim() && newName.trim() !== category.name) ||
    (newDescription.trim() && newDescription.trim() !== category.description);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    // Close silently if no changes
    if (!changed) {
      closeCategoryModal();
      return;
    }

    const payload: UpdateCategoryInput = {
      name: newName.trim() || category.name,
      description: newDescription.trim() || category.description,
    };

    try {
      await updateCategory(payload);

      toastSuccess("Category updated successfully");
      closeCategoryModal();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update category</DialogTitle>
        <DialogDescription>
          Update the category information. Changes apply immediately.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleUpdate} className="grid gap-4">
        <div className="grid gap-2">
          <Label>Current name</Label>
          <Input value={category.name} disabled className="bg-muted" />
        </div>

        <div className="grid gap-2">
          <Label>New name</Label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new category name"
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={newName.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="grid gap-2 pt-2">
          <Label>Current description</Label>
          <Textarea
            value={category.description}
            disabled
            className="bg-muted"
            rows={2}
          />
        </div>

        <div className="grid gap-2">
          <Label>New description</Label>
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new category description"
            rows={3}
            maxLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={newDescription.length}
            fixedLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
          />
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeCategoryModal}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={!changed || isPending}>
            {isPending && <Spinner width={4} height={4} />}
            {isPending ? "Updating..." : "Update category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function SubCategoryContent({
  category,
}: {
  category: {
    id: string;
    name: string;
    description: string;
    parentName: string | null;
    parentId: string | null;
  };
}) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newParentId, setNewParentId] = useState<string | null>(
    category.parentId,
  );

  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const changed =
    (newName.trim() && newName.trim() !== category.name) ||
    (newDescription.trim() && newDescription.trim() !== category.description) ||
    newParentId !== category.parentId;

  const { mutateAsync: updateCategory, isPending } = useUpdateCategory(
    category.id,
  );

  // Preload parent categories when modal opens
  const {
    data: parentCategories,
    isLoading: isLoadingParents,
    isError: isErrorParents,
    refetch: refetchParents,
  } = useGetParentCategories();

  const availableParents = parentCategories?.data ?? [];

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    // Close silently if no changes
    if (!changed) {
      closeCategoryModal();
      return;
    }

    const payload: UpdateCategoryInput = {
      name: newName.trim() || category.name,
      description: newDescription.trim() || category.description,
      parent_id: newParentId === category.parentId ? undefined : newParentId,
    };

    try {
      await updateCategory(payload);

      toastSuccess("Sub-category updated successfully");
      closeCategoryModal();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update sub-category</DialogTitle>
        <DialogDescription>
          Update the sub-category information. Changes apply immediately.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleUpdate} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label>Parent category</Label>
          <Input
            value={category.parentName || ""}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="grid gap-2">
          <Label>Current name</Label>
          <Input value={category.name} disabled className="bg-muted" />
        </div>

        <div className="grid gap-2">
          <Label>New name</Label>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new sub-category name"
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={newName.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="grid gap-2">
          <Label>Current description</Label>
          <Textarea
            value={category.description}
            disabled
            className="bg-muted"
            rows={2}
          />
        </div>

        <div className="grid gap-2">
          <Label>New description</Label>
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new sub-category description"
            rows={3}
            maxLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={newDescription.length}
            fixedLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Change parent category</Label>
            {isErrorParents && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => refetchParents()}
                      className="h-6 w-6 p-0">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Retry loading parent categories</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Select
            value={newParentId ?? ""}
            onValueChange={(val) => {
              if (val === "__loading" || val === "__error") return;
              setNewParentId(val);
            }}
            disabled={isPending}>
            <SelectTrigger className="w-full!">
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent className="w-full!">
              {isLoadingParents && (
                <SelectItem disabled value="__loading">
                  <div className="flex items-center gap-2">
                    <Spinner width={3} height={3} />
                    <span>Loading…</span>
                  </div>
                </SelectItem>
              )}
              {isErrorParents && (
                <SelectItem disabled value="__error">
                  Error loading parents
                </SelectItem>
              )}
              {!isLoadingParents &&
                !isErrorParents &&
                availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeCategoryModal}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={!changed || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Updating..." : "Update Sub-category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
