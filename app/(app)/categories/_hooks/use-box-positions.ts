import { Category } from "@/lib/types/category";
import { RefObject, useEffect } from "react";

export interface BoxPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Custom hook for updating box positions when items, parents, or dialog state changes.
 */
export function useBoxPositions({
  isOpen,
  categoryToDelete,
  childrenfromCategory,
  availableParents,
  containerRef,
  subRefs,
  parentRefs,
  setBoxPositions,
}: {
  isOpen: boolean;
  categoryToDelete: Category | null;
  childrenfromCategory: Category[];
  availableParents: Category[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  subRefs: RefObject<Record<string, HTMLElement>>;
  parentRefs: RefObject<Record<string, HTMLElement>>;
  setBoxPositions: React.Dispatch<
    React.SetStateAction<{
      sub: Record<string, BoxPosition>;
      parent: Record<string, BoxPosition>;
    }>
  >;
}) {
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const subPositions: Record<string, BoxPosition> = {};
      const parentPositions: Record<string, BoxPosition> = {};

      Object.entries(subRefs.current).forEach(([id, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          subPositions[id] = {
            x: rect.right - containerRect.left, // Right edge of sub box
            y: rect.top - containerRect.top + rect.height / 2, // Center of sub box
            width: rect.width,
            height: rect.height,
          };
        }
      });

      Object.entries(parentRefs.current).forEach(([id, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          parentPositions[id] = {
            x: rect.left - containerRect.left, // Left edge of parent box
            y: rect.top - containerRect.top + rect.height / 2, // Center of parent box
            width: rect.width,
            height: rect.height,
          };
        }
      });

      setBoxPositions({ sub: subPositions, parent: parentPositions });
    };

    if (isOpen && categoryToDelete) {
      // Small delay to ensure DOM is ready
      setTimeout(updatePositions, 100);
      window.addEventListener("resize", updatePositions);
    }

    return () => {
      window.removeEventListener("resize", updatePositions);
    };
  }, [
    childrenfromCategory,
    availableParents,
    isOpen,
    categoryToDelete,
    containerRef,
    parentRefs,
    setBoxPositions,
    subRefs,
  ]);
}
