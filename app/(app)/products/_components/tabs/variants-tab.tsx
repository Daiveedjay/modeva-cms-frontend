import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  useProductVariantsStore,
} from "@/lib/store/product/use-product-variant-store";
import { ProductVariant } from "@/lib/types/product";

import { toastWarn } from "@/lib/utils";
import { Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

export default function VariantsTab() {
  const { variants, setVariants } = useProductVariantsStore((store) => store);

  const [newVariantType, setNewVariantType] = useState("");
  const [newVariantOption, setNewVariantOption] = useState<
    Record<string, string>
  >({});

  const handleAddVariantType = useCallback(() => {
    const type = newVariantType.trim();
    if (
      !type ||
      variants.some((v) => v.type.toLowerCase() === type.toLowerCase())
    ) {
      toastWarn("Please enter a valid and unique variant type");
      return;
    }

    setVariants([...variants, { type, options: [] }]);
    setNewVariantType("");
    setNewVariantOption((prev) => ({ ...prev, [type]: "" }));
  }, [newVariantType, variants, setVariants]);

  return (
    <motion.div>
      <TabsContent value="variants" className="mt-0 p-4 space-y-4">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        {variants.map((variant) => (
          <VariantOptionList
            key={variant.type}
            variant={variant}
            newVariantOption={newVariantOption}
            setNewVariantOption={setNewVariantOption}
          />
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Add new variant type (e.g., Material)"
            value={newVariantType}
            onChange={(e) => setNewVariantType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddVariantType();
              }
            }}
          />
          <Button
            disabled={newVariantType.trim().length === 0}
            onClick={handleAddVariantType}
          >
            Add Variant Type
          </Button>
        </div>
      </TabsContent>
    </motion.div>
  );
}

type VariantOptionListProps = {
  variant: ProductVariant;
  setNewVariantOption: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  newVariantOption: Record<string, string>;
};

function VariantOptionList({
  variant,
  newVariantOption,
  setNewVariantOption,
}: VariantOptionListProps) {
  const { variants, setVariants } = useProductVariantsStore((store) => store);

  const handleAddVariantOption = useCallback(
    (variantType: string) => {
      const option = newVariantOption[variantType]?.trim();
      if (!option) return;

      setVariants(
        variants.map((v) =>
          v.type === variantType && !v.options.includes(option)
            ? { ...v, options: [...v.options, option] }
            : v,
        ),
      );
      setNewVariantOption((prev) => ({ ...prev, [variantType]: "" }));
    },
    [newVariantOption, variants, setVariants, setNewVariantOption],
  );

  const handleRemoveVariantOption = useCallback(
    (variantType: string, optionToRemove?: string) => {
      if (!optionToRemove) {
        setVariants(variants.filter((v) => v.type !== variantType));
        setNewVariantOption((prev) => {
          const clone = { ...prev };
          delete clone[variantType];
          return clone;
        });
      } else {
        setVariants(
          variants.map((v) =>
            v.type === variantType
              ? {
                  ...v,
                  options: v.options.filter((opt) => opt !== optionToRemove),
                }
              : v,
          ),
        );
      }
    },
    [variants, setVariants, setNewVariantOption],
  );

  return (
    <div className="space-y-2 border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <Label className="font-medium">{variant.type}</Label>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/60"
          onClick={() => handleRemoveVariantOption(variant.type)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {variant.options.map((option) => (
          <Badge
            key={option}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {option}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => handleRemoveVariantOption(variant.type, option)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={`Add ${variant.type.toLowerCase()} option`}
          value={newVariantOption[variant.type] || ""}
          onChange={(e) =>
            setNewVariantOption((prev) => ({
              ...prev,
              [variant.type]: e.target.value,
            }))
          }
          onKeyDown={(e) =>
            e.key === "Enter" && handleAddVariantOption(variant.type)
          }
        />
        <Button
          // disabled={newVariantOption[variant.type]?.trim().length === 0}
          disabled={
            !newVariantOption[variant.type] ||
            newVariantOption[variant.type].trim().length === 0
          }
          onClick={() => handleAddVariantOption(variant.type)}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
