"use client";


import { ImageUploadArea } from "@/app/(app)/products/_components/image-upload-area";
import { UploadOtherImages } from "@/app/(app)/products/_components/upload-other-images";
import { UploadPrimaryImage } from "@/app/(app)/products/_components/upload-primary-image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import { motion } from "motion/react";

export default function MediaTab() {
  return (
    <Tabs defaultValue="media">
      <TabsContent value="media" className="mt-4 space-y-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-primary rounded-lg">
              <Camera className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Product Images
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload high-quality images to showcase your product
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <ImageUploadArea />

          {/* Primary Image */}
          <UploadPrimaryImage/>

          {/* Other Images */}
          <UploadOtherImages/>
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
