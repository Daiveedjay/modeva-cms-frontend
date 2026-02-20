"use client";
import { Button } from "@/components/ui/button";
import { useProductMediaStore } from "@/lib/store/product/use-product-media-store";
import { Images, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export const UploadOtherImages = () => {
  const { media, setOtherFile } = useProductMediaStore();
  const otherImages = [
    ...media.other,
    ...Array(Math.max(0, 3 - media.other.length)).fill({
      url: "",
      file: null,
      order: media.other.length + 1,
    }),
  ].slice(0, 3);
  const otherInputRefs = useRef<HTMLInputElement[]>([]);

  const handleFile = (files: FileList | null, i: number) => {
    if (!files?.length) return;
    setOtherFile(files[0], i);
  };

  return (
    <motion.div className="space-y-3">
      <div className="flex items-center gap-2">
        <Images className="h-5 w-5 text-primary" />
        <h4 className="text-lg font-semibold text-foreground">
          Additional Images
        </h4>
      </div>

      <div className="grid w-[98%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {otherImages.map((img, i) => (
          <motion.div key={i} className="relative group">
            {img.url ? (
              <div className="relative aspect-4/3 overflow-hidden rounded-lg border-2 border-border">
                <Image
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setOtherFile(null, i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="aspect-4/3 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                onClick={() => otherInputRefs.current[i]?.click()}
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    if (el) otherInputRefs.current[i] = el;
                  }}
                  onChange={(e) => handleFile(e.target.files, i)}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
