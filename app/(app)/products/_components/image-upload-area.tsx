"use client";

import { Button } from "@/components/ui/button";
import { useProductMediaStore } from "@/lib/store/product/use-product-media-store";
import { UploadCloud, ImageIcon, Sparkles } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

export const ImageUploadArea = () => {
  const { media, setOtherFile } = useProductMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const otherImages = useMemo(() => media.other ?? [], [media.other]);
  const disableAddImages = otherImages.every((m) => m.url !== "");

  // Fill first available empty "other" slots with incoming files
  const handleFiles = useCallback(
    (files: File[]) => {
      if (!files.length || disableAddImages) return;

      let nextIndex = otherImages.findIndex((m) => !m.url);
      files.forEach((file) => {
        if (nextIndex === -1) return; // no slot left
        setOtherFile(file, nextIndex);
        // find the next blank slot
        nextIndex = otherImages.findIndex((m) => !m.url);
      });
    },
    [disableAddImages, otherImages, setOtherFile]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files?.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  return (
    <motion.div
      className={`relative overflow-hidden w-[97.5%] border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      } ${
        disableAddImages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disableAddImages && fileInputRef.current?.click()}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with animation */}
        <motion.div
          animate={
            isDragging ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}
          }
          transition={{ duration: 0.5 }}
          className="relative inline-flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-20 animate-pulse" />
            <div className="relative bg-primary/10 p-4 rounded-2xl border border-primary/20">
              <UploadCloud className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Floating sparkles */}
          {!disableAddImages && (
            <>
              <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-1 -left-2">
                <Sparkles className="h-4 w-4 text-secondary" />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Text content */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragging ? "Drop your images here" : "Upload Product Images"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your images or click to browse
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
          <span>Supports: JPG, PNG, WEBP, GIF</span>
        </div>

        {/* Action button */}
        <Button
          variant="outline"
          size="lg"
          disabled={disableAddImages}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="relative overflow-hidden group/btn border-primary/20 hover:bg-primary/10 hover:border-primary/40">
          <span className="relative z-10 flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            {disableAddImages ? "All slots filled" : "Choose Files"}
          </span>
        </Button>

        {/* File input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleFiles(Array.from(e.target.files))
          }
        />

        {/* Helper text */}
        {!disableAddImages && (
          <p className="mt-4 text-xs text-muted-foreground">
            You can upload multiple images at once
          </p>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  );
};
