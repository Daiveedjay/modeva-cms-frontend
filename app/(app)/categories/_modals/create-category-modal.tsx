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
import { toastSuccess } from "@/lib/utils";
import { FormEvent, useState } from "react";

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

  // Don't render modal if we're waiting for parent data
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

function CategoryContent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createCategory({
        name: name.trim(),
        description: description.trim(),
      });

      toastSuccess("Category added successfully");
      closeCategoryModal();
    } catch {
      // Error toast is handled in the API file
      // Keep modal open so user can retry
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className=" ">Add new category</DialogTitle>
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
            required
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={name.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none whitespace-pre-wrap wrap-break-word overflow-hidden"
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
          <Button type="submit" disabled={!name.trim() || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Adding category..." : "Add category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await createCategory({
        name: name.trim(),
        description: description.trim(),
        parent_id: parent_id ?? null,
      });

      toastSuccess("Sub-category added successfully");
      closeCategoryModal();
    } catch {
      // Error toast is handled in the API file
      // Keep modal open so user can retry
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Sub-category to &apos;{parent_name}&apos;</DialogTitle>
        <DialogDescription>
          Create a new Sub-category for your products. You can organise products
          better with categories.
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
            required
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            disabled={isPending}
          />
          <CharacterCounter
            dynamicLength={name.length}
            fixedLength={MAX_CATEGORY_NAME_LENGTH}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none wrap-break-word overflow-hidden"
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
          <Button type="submit" disabled={!name.trim() || isPending}>
            {isPending && <Spinner />}
            {isPending ? "Adding sub-category..." : "Add sub-category"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
