"use client";

import { useDeleteCategoryWithOptions } from "@/app/_queries/categories/delete-category-with-options";
import { useGetCategoryById } from "@/app/_queries/categories/get-category-by-id";
import { useGetParentCategories } from "@/app/_queries/categories/get-parent-categories";
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
import { Separator } from "@/components/ui/separator";
import { useCategoriesModalStore } from "@/lib/store/categories/use-categories-modal-store";
import { toastSuccess } from "@/lib/utils";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import AvailableParents from "../_components/available-parents";
import ReassignSubCategories from "../_components/reassign-sub-categories";
import { ReassignmentLines } from "../_components/reassignment-lines";

import { BoxPositions } from "../_hooks/get-connection-path";
import { useBoxPositions } from "../_hooks/use-box-positions";
import { Reassignment } from "@/lib/types/category";
import MobileReassignLayout from "@/app/(app)/categories/_components/mobile-reassign-sub-categories";

export interface Connection {
  id: string;
  subId: string;
  parentId: string;
}

export function ReassignSubcategoriesModal() {
  const categoryModal = useCategoriesModalStore((s) => s.categoryModal);
  const closeCategoryModal = useCategoriesModalStore(
    (s) => s.closeCategoryModal,
  );

  const category_id = categoryModal?.category_id;

  const open = useMemo(
    () => categoryModal?.type === "reassign-before-delete" && !!category_id,
    [categoryModal, category_id],
  );

  const { data: categoryData, isLoading: isLoadingCategory } =
    useGetCategoryById(String(category_id), open);

  const { data: availableParentCategories, isLoading: isLoadingParents } =
    useGetParentCategories();

  const { mutateAsync: deleteWithOptions, isPending } =
    useDeleteCategoryWithOptions(category_id ?? "");

  // Local UI state
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [boxPositions, setBoxPositions] = useState<BoxPositions>({
    sub: {},
    parent: {},
  });

  // Refs for drawing lines
  const containerRef = useRef<HTMLDivElement>(null);
  const subRefs = useRef<Record<string, HTMLElement>>({});
  const parentRefs = useRef<Record<string, HTMLElement>>({});

  const categoryToDelete = categoryData?.data;

  const childrenfromCategory = useMemo(
    () => (categoryToDelete ? (categoryToDelete.children ?? []) : []),
    [categoryToDelete],
  );

  const availableParents = useMemo(() => {
    if (!availableParentCategories?.data) return [];
    return availableParentCategories.data.filter(
      (c) => c.id !== (categoryToDelete?.id ?? ""),
    );
  }, [availableParentCategories, categoryToDelete?.id]);

  const allAssigned = useMemo(() => {
    return (
      childrenfromCategory.length > 0 &&
      childrenfromCategory.every(
        (sub) => assignments[sub.id] && assignments[sub.id] !== "",
      )
    );
  }, [childrenfromCategory, assignments]);

  useBoxPositions({
    isOpen: open,
    categoryToDelete: categoryToDelete ?? null,
    childrenfromCategory,
    availableParents,
    containerRef,
    subRefs,
    parentRefs,
    setBoxPositions,
  });

  if (!open) return null;
  if (isLoadingCategory || isLoadingParents) return null;
  if (!categoryToDelete) return null;

  // ── Desktop line-drawing handlers ──────────────────────────────────────────

  const handleSubClick = (subId: string) => {
    if (isPending) return;
    if (activeSub === subId) {
      setConnections((prev) => prev.filter((conn) => conn.subId !== subId));
      setAssignments((prev) => {
        const copy = { ...prev };
        delete copy[subId];
        return copy;
      });
      setActiveSub(null);
    } else {
      setActiveSub(subId);
    }
  };

  const handleParentClick = (parentId: string) => {
    if (!activeSub || isPending) return;
    const connectionId = `${activeSub}-${parentId}`;
    setConnections((prev) => [
      ...prev.filter((c) => c.subId !== activeSub),
      { id: connectionId, subId: activeSub, parentId },
    ]);
    setAssignments((prev) => ({ ...prev, [activeSub]: parentId }));
    setActiveSub(null);
  };

  // ── Mobile select handlers ──────────────────────────────────────────────────

  const handleMobileAssign = (subId: string, parentId: string) => {
    if (isPending) return;
    const connectionId = `${subId}-${parentId}`;
    setConnections((prev) => [
      ...prev.filter((c) => c.subId !== subId),
      { id: connectionId, subId, parentId },
    ]);
    setAssignments((prev) => ({ ...prev, [subId]: parentId }));
  };

  const handleMobileUnassign = (subId: string) => {
    if (isPending) return;
    setConnections((prev) => prev.filter((c) => c.subId !== subId));
    setAssignments((prev) => {
      const copy = { ...prev };
      delete copy[subId];
      return copy;
    });
  };

  // ── Shared ─────────────────────────────────────────────────────────────────

  const clearSelections = () => {
    setConnections([]);
    setAssignments({});
    setActiveSub(null);
  };

  const handleCancel = () => {
    clearSelections();
    closeCategoryModal();
  };

  const handleReassign = async () => {
    if (!allAssigned || !categoryToDelete) return;

    const reassignments: Reassignment[] = childrenfromCategory.map((child) => ({
      child_id: child.id,
      new_parent_id: assignments[child.id],
    }));

    try {
      await deleteWithOptions({ mode: "reassign", reassignments });
      toastSuccess(
        "Category deleted and sub-categories reassigned successfully",
      );
      clearSelections();
      closeCategoryModal();
    } catch {
      // Error toast handled in API file — keep modal open for retry
    }
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : handleCancel}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[calc(100vw-2rem)] max-w-6xl!
          max-h-[85dvh] lg:max-h-[70vh]
          overflow-y-auto
          pt-0
        ">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <DialogHeader className="flex flex-row items-start justify-between gap-4 sticky top-0 bg-background pt-5 pb-2 z-20">
          <div className="min-w-0">
            <DialogTitle className="text-xl lg:text-2xl leading-tight">
              Reassign Sub-categories
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              Before deleting &quot;{categoryToDelete.name}&quot;, reassign its
              sub-categories to new parent categories.
            </DialogDescription>
          </div>
          <button
            aria-label="Close"
            disabled={isPending}
            onClick={isPending ? undefined : handleCancel}
            className="shrink-0 p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
            <X size={18} />
          </button>
        </DialogHeader>

        <Separator />

        {/* ── Body ─────────────────────────────────────────────────────────── */}

        {/* Mobile layout (< lg) */}
        <div className="lg:hidden px-1">
          <MobileReassignLayout
            childrenfromCategory={childrenfromCategory}
            availableParents={availableParents}
            assignments={assignments}
            onAssign={handleMobileAssign}
            onUnassign={handleMobileUnassign}
            isPending={isPending}
          />
        </div>

        {/* Desktop layout (≥ lg) */}
        <div
          ref={containerRef}
          className="relative hidden lg:flex gap-12 py-8 min-h-100">
          <ReassignmentLines
            connections={connections}
            boxPositions={boxPositions}
          />

          <ReassignSubCategories
            childrenfromCategory={categoryToDelete.children ?? []}
            categories={availableParentCategories?.data ?? []}
            activeSub={activeSub}
            handleSubClick={handleSubClick}
            subRefs={subRefs}
            assignments={assignments}
          />

          <div className="flex flex-col items-center justify-center px-4">
            <Separator orientation="vertical" className="h-full" />
            <div className="absolute bg-background p-2">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          <AvailableParents
            availableParents={availableParents}
            activeSub={activeSub}
            handleParentClick={handleParentClick}
            assignments={assignments}
            parentRefs={parentRefs}
          />
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <Separator />
        <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelections}
              disabled={Object.keys(assignments).length === 0 || isPending}
              className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {Object.keys(assignments).length} of {childrenfromCategory.length}{" "}
              assigned
            </span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={handleCancel}
              disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 sm:flex-none"
              onClick={handleReassign}
              disabled={!allAssigned || isPending}>
              {isPending && <Spinner />}
              {isPending ? "Deleting…" : "Confirm & Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
