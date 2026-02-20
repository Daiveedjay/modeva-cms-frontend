"use client";
import { useProductMediaStore } from "@/lib/store/product/use-product-media-store";
import { Button } from "@/components/ui/button";
import { Plus, Star, Upload } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import RequiredTag from "@/components/reuseables/required-tag";

export const UploadPrimaryImage = () => {
  const { media, setPrimaryFile } = useProductMediaStore();
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const primaryImage = media.primary.url;
  const [isReplacing, setIsReplacing] = useState(false);

  const handlePrimaryFile = async (files: FileList | null) => {
    if (!files?.length) return;
    const oldPrimary = media.primary; // keep a backup
    try {
      setIsReplacing(true);
      // Simulate validation or upload if needed
      setPrimaryFile(files[0]);
    } catch (error) {
      console.error("Error replacing primary image:", error);
      // Revert to old image
      setPrimaryFile(oldPrimary.file);
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h4 className="text-lg font-semibold text-foreground">
            Primary Image
          </h4>
        </div>
        <RequiredTag />
      </div>

      <p className="text-sm text-muted-foreground">
        This will be the main image displayed for your product
      </p>

      <div className="mt-4">
        {primaryImage ? (
          <motion.div className="relative group w-full max-w-sm">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border-2 border-border">
              <Image
                src={primaryImage}
                alt="Primary"
                fill
                className="object-cover"
              />

              <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3 fill-current" />
                Primary
              </div>

              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={isReplacing}
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={() => primaryInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <input
              type="file"
              ref={primaryInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handlePrimaryFile(e.target.files)}
            />
          </motion.div>
        ) : (
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-sm aspect-4/3 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden"
            onClick={() => primaryInputRef.current?.click()}
          >
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-sm mt-2 text-muted-foreground group-hover:text-primary">
              Add Primary Image
            </p>
            <input
              type="file"
              ref={primaryInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handlePrimaryFile(e.target.files)}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
