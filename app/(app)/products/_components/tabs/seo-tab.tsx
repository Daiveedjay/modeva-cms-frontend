import CharacterCounter from "@/components/reuseables/character-counter";
import RequiredTag from "@/components/reuseables/required-tag";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_SEO_DESCRIPTION_LENGTH,
  MAX_SEO_TITLE_LENGTH,
} from "@/lib/constants";
import { useProductSeoStore } from "@/lib/store/product/use-product-seo-store";

import { toastWarn } from "@/lib/utils";
import { motion } from "motion/react";
export default function SeoTab() {
  const { seo_title, seo_description } = useProductSeoStore(
    (state) => state.seo,
  );

  const setSeo = useProductSeoStore((state) => state.setSeo);
  return (
    <motion.div>
      <TabsContent value="seo" className="mt-0 p-4 space-y-4">
        <h3 className="text-lg font-semibold">Search Engine Optimization</h3>
        <div className="space-y-2">
          <Label htmlFor="seo-title">
            SEO Title <RequiredTag />
          </Label>
          <Input
            id="seo-title"
            placeholder="Enter SEO title"
            value={seo_title}
            onChange={(e) => {
              if (e.target.value.length > MAX_SEO_TITLE_LENGTH) {
                toastWarn(
                  `SEO title cannot exceed ${MAX_SEO_TITLE_LENGTH} characters`,
                );
                return;
              }
              setSeo({ seo_title: e.target.value });
            }}
          />

          <CharacterCounter
            dynamicLength={seo_title.length}
            fixedLength={MAX_SEO_TITLE_LENGTH}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo-description">
            SEO Description <RequiredTag />
          </Label>
          <Textarea
            id="seo-description"
            placeholder="Enter SEO description"
            value={seo_description}
            onChange={(e) => {
              if (e.target.value.length > MAX_SEO_DESCRIPTION_LENGTH) {
                toastWarn(
                  `SEO description cannot exceed ${MAX_SEO_DESCRIPTION_LENGTH} characters`,
                );
                return;
              }
              setSeo({ seo_description: e.target.value });
            }}
            rows={4}
          />

          <CharacterCounter
            dynamicLength={seo_description.length}
            fixedLength={MAX_SEO_DESCRIPTION_LENGTH}
          />
        </div>
      </TabsContent>
    </motion.div>
  );
}
