"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteCategory } from "@/app/_queries/categories/delete-category";
import { useDeleteCategoryWithOptions } from "@/app/_queries/categories/delete-category-with-options";
import { useGetCategoryById } from "@/app/_queries/categories/get-category-by-id";
import { Spinner } from "@/components/reuseables/spinner";
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { toastSuccess } from "@/lib/utils";

export function DeleteCategoryModal() {
  const categoryModal = useCategoriesModalStore((s) => s.categoryModal);
  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );
  const openCategoryModal = useCategoriesModalStore((s) => s.openCategoryModal);

  const category_id = categoryModal?.category_id;

  const open =
    categoryModal?.type === "delete-category" ||
    categoryModal?.type === "delete-sub-category";

  const shouldFetchCategory = open && Boolean(category_id);

  const { data, isLoading } = useGetCategoryById(
    category_id ?? "",
    shouldFetchCategory,
  );

  const category = data?.data;

  // Keep modal closed until category data loads
  if (!open) return null;
  if (shouldFetchCategory && isLoading) return null;
  if (!category?.id) return null;

  const numberOfChildren = category?.children ? category.children.length : 0;

  const mode =
    categoryModal?.type === "delete-sub-category" ? "sub-category" : "category";

  const onCancel = () => closeCategoryModal();

  const onReassign = () => {
    if (numberOfChildren > 0) {
      onCancel();
      openCategoryModal({
        type: "reassign-before-delete",
        category_id: category.id,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeCategoryModal}>
      <DialogContent className="max-w-3xl! w-full!">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action will delete the {mode} <strong>{category?.name}</strong>{" "}
            permanently.
            {!!category?.products && (
              <ProductWarning productCount={category?.products} />
            )}
            {numberOfChildren > 0 && <ChildWarning count={numberOfChildren} />}
          </DialogDescription>
        </DialogHeader>

        {numberOfChildren > 0 ? (
          <ReassignButtons
            onCancel={onCancel}
            onReassign={onReassign}
            categoryId={category.id}
          />
        ) : (
          <DefaultButtons
            mode={mode}
            onCancel={onCancel}
            categoryId={category.id}
            parentId={category?.parent_id}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DefaultButtons({
  onCancel,
  mode,
  categoryId,
  parentId,
}: {
  categoryId: string;
  onCancel: () => void;
  mode: "category" | "sub-category";
  parentId?: string | null;
}) {
  const { mutateAsync: deleteCategory, isPending } = useDeleteCategory(
    categoryId,
    parentId,
  );

  const handleDelete = async () => {
    try {
      await deleteCategory();

      toastSuccess("Category deleted successfully");
      onCancel();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}>
        Cancel
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-destructive hover:text-foreground/80 hover:bg-destructive/70">
        {isPending && <Spinner />}
        {isPending ? "Deleting..." : `Delete ${mode}`}
      </Button>
    </DialogFooter>
  );
}

function ReassignButtons({
  onCancel,
  onReassign,
  categoryId,
}: {
  onCancel: () => void;
  onReassign: () => void;
  categoryId: string;
}) {
  const { mutateAsync: deleteCategoryWithOptions, isPending } =
    useDeleteCategoryWithOptions(categoryId);

  const handleIgnoreAndDelete = async () => {
    try {
      await deleteCategoryWithOptions({ mode: "cascade" });

      toastSuccess("Category and sub-categories deleted successfully");
      onCancel();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <DialogFooter className="justify-between!">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}>
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button
          onClick={onReassign}
          disabled={isPending}
          className="bg-muted-foreground hover:bg-muted-foreground/70">
          Reassign before delete
        </Button>
        <Button
          variant="destructive"
          onClick={handleIgnoreAndDelete}
          disabled={isPending}>
          {isPending && <Spinner />}
          {isPending ? "Deleting..." : "Ignore and delete"}
        </Button>
      </div>
    </DialogFooter>
  );
}

function ProductWarning({ productCount }: { productCount: number }) {
  return (
    <span className="block mt-2">
      Warning:{" "}
      <span className="text-destructive font-medium">
        {productCount} product{productCount > 1 ? "s" : ""}
      </span>{" "}
      {productCount > 1 ? "are" : "is"} associated with this category.
    </span>
  );
}

function ChildWarning({ count }: { count: number }) {
  return (
    <span className="text-muted-foreground">
      {" "}
      Along with{" "}
      <span className="text-destructive font-medium">
        {count} sub-categor{count > 1 ? "ies" : "y"}
      </span>{" "}
      which will also be deleted.
    </span>
  );
}
