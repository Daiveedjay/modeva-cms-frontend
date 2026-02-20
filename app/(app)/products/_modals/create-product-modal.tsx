"use client";

import { Button } from "@/components/ui/button";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import MediaTab from "../_components/tabs/media-tab";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateProduct } from "@/app/_queries/products/create-product";
import { Spinner } from "@/components/reuseables/spinner";
import { useProductBasicInfoStore } from "@/lib/store/product/use-product-basic-info-store";
import { useProductMediaStore } from "@/lib/store/product/use-product-media-store";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { useProductSeoStore } from "@/lib/store/product/use-product-seo-store";
import { useProductVariantsStore } from "@/lib/store/product/use-product-variant-store";
import { toastSuccess, toastWarn } from "@/lib/utils";
import { validateAllTabs } from "@/lib/validation/products/validate-all-tabs";
import BasicInfoTab from "../_components/tabs/basic-info-tab";
import InventoryTab from "../_components/tabs/inventory-tab";
import SeoTab from "../_components/tabs/seo-tab";
import VariantsTab from "../_components/tabs/variants-tab";
import { useProductManagerStore } from "@/lib/store/product/use-product-manager-store";

const tabs = [
  { value: "media", label: "Media" },
  { value: "basic-info", label: "Basic Info" },
  { value: "variants", label: "Variants" },
  { value: "inventory", label: "Inventory" },
  { value: "seo", label: "SEO" },
] as const;

type TabsValue = (typeof tabs)[number]["value"];

export function CreateProductModal() {
  const [activeTab, setActiveTab] = useState<TabsValue>("media");
  const [direction, setDirection] = useState(0);

  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const productModal = useProductModalStore((store) => store.productModal);

  const closeProductModal = useProductModalStore(
    (store) => store.closeProductModal,
  );

  const open = !!productModal && productModal.type === "add-product";

  const resetAllProductStores = useProductManagerStore(
    (store) => store.resetAllProductStores,
  );
  const basic_info = useProductBasicInfoStore((state) => state.basic_info);
  const media = useProductMediaStore((state) => state.media);
  const variants = useProductVariantsStore((state) => state.variants);
  const inventory = useProductVariantsStore((state) => state.inventory);
  const seo = useProductSeoStore((state) => state.seo);

  const { success, errors } = validateAllTabs({
    basic_info,
    media,
    variants,
    seo,
  });

  const handleCancel = () => {
    closeProductModal();
    resetAllProductStores();
    setActiveTab("media");
  };

  const handleSubmit = async () => {
    if (!success && errors) {
      toastWarn(errors.message);
      setActiveTab(errors.tab);
      return;
    }

    const mediaPayload = {
      primary: {
        url: media.primary.url,
        file: media.primary.file,
      },
      other: media.other.map(({ url, file, order }) => ({ url, file, order })),
    };

    try {
      await createProduct({
        name: basic_info.name,
        description: basic_info.description,
        composition: basic_info.composition,
        price: basic_info.price,
        sub_category_id: basic_info.sub_category_id,
        status: basic_info.status,
        tags: basic_info.tags,
        media: mediaPayload,
        variants,
        inventory,
        seo,
      });

      toastSuccess("Product created successfully");
      handleCancel();
      setActiveTab("media");
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleTabChange = (nextTab: string) => {
    if (isPending) return; // Prevent tab switching during submission

    const tabValue = nextTab as TabsValue;
    const nextIndex = tabs.findIndex((t) => t.value === tabValue);
    const prevIndex = tabs.findIndex((t) => t.value === activeTab);
    setDirection(nextIndex > prevIndex ? 1 : -1);
    setActiveTab(tabValue);
  };

  const renderTabContent = (tab: TabsValue) => {
    switch (tab) {
      case "media":
        return <MediaTab />;
      case "basic-info":
        return <BasicInfoTab />;
      case "variants":
        return <VariantsTab />;
      case "inventory":
        return <InventoryTab />;
      case "seo":
        return <SeoTab />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : handleCancel}>
      <DialogContent
        onClose={handleCancel}
        className="sm:max-w-175 transition-all h-full max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to your store.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex-1 flex flex-col overflow-x-hidden">
          <ChipTabs
            selected={activeTab}
            onSelect={handleTabChange}
            disabled={isPending}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -40 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 * direction }}
              transition={{ duration: 0.1 }}
              className="w-full h-auto">
              {renderTabContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Creating product..." : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const ChipTabs = ({
  selected,
  onSelect,
  disabled,
}: {
  selected: string;
  onSelect: (val: TabsValue) => void;
  disabled: boolean;
}) => (
  <TabsList className="w-full z-30 sticky top-0 min-h-11 grid grid-cols-5 flex-wrap gap-2">
    {tabs.map((tab) => (
      <Chip
        tab={tab}
        selected={selected === tab.value}
        onSelect={onSelect}
        disabled={disabled}
        key={tab.value}
      />
    ))}
  </TabsList>
);

const Chip = ({
  tab,
  selected,
  onSelect,
  disabled,
}: {
  tab: (typeof tabs)[number];
  selected: boolean;
  onSelect: (val: TabsValue) => void;
  disabled: boolean;
}) => {
  return (
    <TabsTrigger
      value={tab.value}
      onMouseDown={() => !disabled && onSelect(tab.value)}
      disabled={disabled}
      className={`${
        selected
          ? "text-white"
          : "text-slate-300 hover:text-slate-200 hover:bg-card"
      } text-sm transition-colors px-2.5 py-0.5 rounded-md relative data-[state=active]:bg-none! ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}>
      <span className="relative z-10">{tab.label}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 z-0 bg-primary text-background rounded-md"
        />
      )}
    </TabsTrigger>
  );
};
