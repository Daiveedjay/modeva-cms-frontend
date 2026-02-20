import { useGetSubCategories } from "@/app/_queries/categories/get-sub-categories";
import CharacterCounter from "@/components/reuseables/character-counter";
import RequiredTag from "@/components/reuseables/required-tag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
} from "@/lib/constants";
import {
  ProductStatus,
  useProductBasicInfoStore,
} from "@/lib/store/product/use-product-basic-info-store";
import { toastWarn } from "@/lib/utils";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function BasicInfoTab() {
  const { basic_info, setBasicInfo } = useProductBasicInfoStore((s) => s);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !basic_info.tags.includes(newTag.trim())) {
      setBasicInfo({ tags: [...basic_info.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setBasicInfo({
      tags: basic_info.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <motion.div>
      <TabsContent value="basic-info" className="mt-0 p-4 space-y-4">
        <h3 className="text-lg font-semibold">Product Information</h3>
        <div className="grid gap-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="product-name">
              Product Name <RequiredTag />
            </Label>
            <Input
              id="product-name"
              placeholder="Enter product name"
              value={basic_info.name}
              onChange={(e) => {
                if (e.target.value.length > MAX_PRODUCT_NAME_LENGTH) {
                  toastWarn(
                    `Product name cannot exceed ${MAX_PRODUCT_NAME_LENGTH} characters`
                  );
                  return;
                }
                setBasicInfo({ name: e.target.value });
              }}
            />

            <CharacterCounter
              dynamicLength={basic_info.name.length}
              fixedLength={MAX_PRODUCT_NAME_LENGTH}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              wrap="soft"
              className="w-full resize-none wrap-break-word overflow-hidden"
              placeholder="Enter product  description"
              value={basic_info.description}
              onChange={(e) => {
                if (e.target.value.length > MAX_DESCRIPTION_LENGTH) {
                  toastWarn(
                    `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
                  );
                  return;
                }
                setBasicInfo({ description: e.target.value });
              }}
              rows={4}
            />

            <CharacterCounter
              dynamicLength={basic_info.description.length}
              fixedLength={MAX_DESCRIPTION_LENGTH}
            />
          </div>

          {/* Composition */}
          <CompositionFields
            composition={basic_info.composition}
            setBasicInfo={setBasicInfo}
          />

          {/* Price & Category */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                min={0}
                step="1"
                value={basic_info.price.toString()}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Allow typing an empty string (temporarily clears input)
                  if (inputValue === "") {
                    setBasicInfo({ price: 0 });
                    return;
                  }

                  // Convert input to number or fallback to 0
                  const parsed = Number(inputValue) || 0;
                  setBasicInfo({ price: parsed });
                }}
              />
            </div>
            <SubCategorySelect
              value={basic_info.sub_category_id}
              onChange={(val) => setBasicInfo({ sub_category_id: val })}
            />
            <StatusSelect
              value={basic_info.status}
              onChange={(val) => setBasicInfo({ status: val })}
            />
          </div>

          {/* Tags */}
          <TagsInput
            tags={basic_info.tags}
            onAdd={handleAddTag}
            onRemove={handleRemoveTag}
            newTag={newTag}
            setNewTag={setNewTag}
          />
        </div>
      </TabsContent>
    </motion.div>
  );
}

function CompositionFields({
  composition,
  setBasicInfo,
}: {
  composition: { label: string; content: string }[];
  setBasicInfo: (
    info: Partial<{ composition: { label: string; content: string }[] }>
  ) => void;
}) {
  const handleAddComposition = () => {
    setBasicInfo({
      composition: [...composition, { label: "", content: "" }],
    });
  };

  const handleRemoveComposition = (index: number) => {
    setBasicInfo({
      composition: composition.filter((_, i) => i !== index),
    });
  };
  return (
    <div className="space-y-2">
      <Label>
        Composition <RequiredTag />
      </Label>
      {composition.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            className="w-1/4"
            placeholder="Label (e.g. Style)"
            value={item.label}
            onChange={(e) =>
              setBasicInfo({
                composition: composition.map((comp, i) =>
                  i === index ? { ...comp, label: e.target.value } : comp
                ),
              })
            }
          />
          <Input
            className="flex-1"
            placeholder="Content (e.g. Casual)"
            value={item.content}
            onChange={(e) =>
              setBasicInfo({
                composition: composition.map((comp, i) =>
                  i === index ? { ...comp, content: e.target.value } : comp
                ),
              })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveComposition(index)}
            className="text-destructive hover:text-red-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={handleAddComposition}>
        + Add Composition Field
      </Button>
    </div>
  );
}

function SubCategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const { data: subCategories } = useGetSubCategories();

  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        Sub-category <RequiredTag />
      </Label>
      <Select value={value} defaultValue={value} onValueChange={onChange}>
        <SelectTrigger id="category" className="w-full!">
          <SelectValue placeholder="Select Sub-category" />
        </SelectTrigger>
        <SelectContent>
          {subCategories?.data?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.category_path}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: ProductStatus;
  onChange: (val: ProductStatus) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="status" className="w-full!">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function TagsInput({
  tags,
  onAdd,
  onRemove,
  newTag,
  setNewTag,
}: {
  tags: string[];
  onAdd: () => void;
  onRemove: (tag: string) => void;
  newTag: string;
  setNewTag: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={() => onRemove(tag)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          id="tags"
          placeholder="Add tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        <Button onClick={onAdd}>Add</Button>
      </div>
    </div>
  );
}
