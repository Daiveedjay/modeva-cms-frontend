"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, Target } from "motion/react";

type Side = "bottom" | "top" | "left" | "right";
type Align = "start" | "center" | "end";

type TriggerRenderArgs = {
  open: boolean;
  props: {
    ref: (node: HTMLElement | null) => void;
    onClick: React.MouseEventHandler;
    "aria-expanded": boolean;
    "aria-haspopup": "dialog";
    "aria-controls": string;
  };
};

type ChildrenRender = (args: { close: () => void }) => React.ReactNode;

export type FloatingPopoverProps = {
  renderTrigger: (args: TriggerRenderArgs) => React.ReactNode;
  /** You can pass normal React children or a function that receives { close } */
  children?: React.ReactNode | ChildrenRender;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  side?: Side;
  align?: Align;
  sideOffset?: number;
  className?: string;
  contentClassName?: string;
  zIndexClassName?: string;
};

export function FloatingPopover({
  renderTrigger,
  children,
  open: controlledOpen,
  onOpenChange,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  className,
  contentClassName,
  zIndexClassName = "z-50",
}: FloatingPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const id = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (rootRef.current?.contains(t)) return; // inside wrapper => ignore
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [open, setOpen]);

  // escape to close + restore focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus?.();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, setOpen]);

  // focus first focusable in panel
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      el?.focus?.();
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const sidePos: Record<Side, string> = {
    bottom: `top-[calc(100%+${sideOffset}px)]`,
    top: `bottom-[calc(100%+${sideOffset}px)]`,
    left: `right-[calc(100%+${sideOffset}px)]`,
    right: `left-[calc(100%+${sideOffset}px)]`,
  };

  const alignPos: Record<Align, string> = {
    start:
      side === "left" || side === "right"
        ? "top-0"
        : side === "top" || side === "bottom"
          ? "left-0"
          : "",
    center:
      side === "left" || side === "right"
        ? "top-1/2 -translate-y-1/2"
        : "left-1/2 -translate-x-1/2",
    end:
      side === "left" || side === "right"
        ? "bottom-0"
        : side === "top" || side === "bottom"
          ? "right-0"
          : "",
  };

  const initialBySide: Record<Side, Target> = {
    bottom: { opacity: 0, y: -6, scale: 0.98 },
    top: { opacity: 0, y: 6, scale: 0.98 },
    left: { opacity: 0, x: 6, scale: 0.98 },
    right: { opacity: 0, x: -6, scale: 0.98 },
  };

  const isFnChild = typeof children === "function";

  return (
    <div
      ref={rootRef}
      className={["relative inline-block w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      {renderTrigger({
        open,
        props: {
          ref: (node) => (triggerRef.current = node),
          onClick: () => setOpen(!open),
          "aria-expanded": open,
          "aria-haspopup": "dialog",
          "aria-controls": id,
        },
      })}

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id={id}
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            initial={initialBySide[side]}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className={[
              "absolute",
              zIndexClassName,
              sidePos[side],
              alignPos[align],
              "rounded-md border bg-background shadow-md",
              "p-2",
              "outline-none",
              contentClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isFnChild
              ? (children as ChildrenRender)({ close: () => setOpen(false) })
              : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
