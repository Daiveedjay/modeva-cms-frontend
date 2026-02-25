"use client";

import { useCreateCategory } from "@/app/_queries/categories/create-category";
import { useGetCategoryById } from "@/app/_queries/categories/get-category-by-id";
import CharacterCounter from "@/components/reuseables/character-counter";
import RequiredTag from "@/components/reuseables/required-tag";
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
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_CATEGORY_DESCRIPTION_LENGTH,
  MAX_CATEGORY_NAME_LENGTH,
  MIN_CATEGORY_NAME_LENGTH,
} from "@/lib/constants";
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { toastError, toastSuccess } from "@/lib/utils";
import { FormEvent, useMemo, useState } from "react";

export function CreateCategoryModal() {
  const categoryModal = useCategoriesModalStore((s) => s.categoryModal);
  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const open =
    categoryModal?.type === "add-category" ||
    categoryModal?.type === "add-sub-category";

  const category_id = categoryModal?.category_id;

  const shouldFetchParent =
    open && categoryModal?.type === "add-sub-category" && Boolean(category_id);

  const { data: parentData, isLoading: isLoadingParent } = useGetCategoryById(
    category_id!,
    shouldFetchParent,
  );

  const parent = parentData?.data;

  if (!open) return null;
  if (shouldFetchParent && isLoadingParent) return null;

  return (
    <Dialog open={open} onOpenChange={closeCategoryModal}>
      <DialogContent
        key={`${categoryModal?.type}-${parent?.id ?? "new"}`}
        className="sm:max-w-106.25] data-[state=open]:zoom-in-100! data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-300">
        {categoryModal?.type === "add-category" ? (
          <CategoryContent />
        ) : (
          parent && (
            <SubCategoryContent
              parent_id={parent.id}
              parent_name={parent.name}
            />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ========================= CATEGORY ========================= */

function CategoryContent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  const isFormValid = useMemo(
    () => Boolean(trimmedName && trimmedDescription),
    [trimmedName, trimmedDescription],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toastError("Missing fields", "Name and description are required.");
      return;
    }

    try {
      await createCategory({
        name: trimmedName,
        description: trimmedDescription,
      });

      toastSuccess("Category added successfully");
      closeCategoryModal();
    } catch {
      // Error handled in API file
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add new category</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Category name <RequiredTag />
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter category name (min ${MIN_CATEGORY_NAME_LENGTH}, max ${MAX_CATEGORY_NAME_LENGTH} characters)`}
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={name.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Description <RequiredTag />
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Enter description"
            maxLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={description.length}
            fixedLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeCategoryModal}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Adding category..." : "Add category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

/* ====================== SUB CATEGORY ====================== */

function SubCategoryContent({
  parent_id,
  parent_name,
}: {
  parent_id: string;
  parent_name: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const { mutateAsync: createCategory, isPending } = useCreateCategory({
    parent_id,
  });

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  const isFormValid = useMemo(
    () => Boolean(trimmedName && trimmedDescription),
    [trimmedName, trimmedDescription],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toastError("Missing fields", "Name and description are required.");
      return;
    }

    try {
      await createCategory({
        name: trimmedName,
        description: trimmedDescription,
        parent_id,
      });

      toastSuccess("Sub-category added successfully");
      closeCategoryModal();
    } catch {
      // Error handled in API file
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Sub-category to &apos;{parent_name}&apos;</DialogTitle>
        <DialogDescription>
          Create a new sub-category for your products.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Sub-category name <RequiredTag />
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter subcategory name (min ${MIN_CATEGORY_NAME_LENGTH}, max ${MAX_CATEGORY_NAME_LENGTH} characters)`}
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={name.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Description <RequiredTag />
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter description"
            maxLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={description.length}
            fixedLength={MAX_CATEGORY_DESCRIPTION_LENGTH}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeCategoryModal}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isFormValid || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Adding sub-category..." : "Add sub-category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
