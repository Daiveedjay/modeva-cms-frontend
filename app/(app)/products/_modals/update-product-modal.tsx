"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import MediaTab from "../_components/tabs/media-tab";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetProductById } from "@/app/_queries/products/get-product-by-id";
import { useUpdateProduct } from "@/app/_queries/products/update-product";
import { Spinner } from "@/components/reuseables/spinner";

import { useProductBasicInfoStore } from "@/lib/store/product/use-product-basic-info-store";
import { useProductMediaStore } from "@/lib/store/product/use-product-media-store";
import { useProductVariantsStore } from "@/lib/store/product/use-product-variant-store";
import { useProductSeoStore } from "@/lib/store/product/use-product-seo-store";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { useProductManagerStore } from "@/lib/store/product/use-product-manager-store";

import { toastSuccess, toastWarn } from "@/lib/utils";
import { validateAllTabs } from "@/lib/validation/products/validate-all-tabs";

import BasicInfoTab from "../_components/tabs/basic-info-tab";
import InventoryTab from "../_components/tabs/inventory-tab";
import SeoTab from "../_components/tabs/seo-tab";
import VariantsTab from "../_components/tabs/variants-tab";

const tabs = [
  { value: "media", label: "Media" },
  { value: "basic-info", label: "Basic Info" },
  { value: "variants", label: "Variants" },
  { value: "inventory", label: "Inventory" },
  { value: "seo", label: "SEO" },
] as const;

type TabsValue = (typeof tabs)[number]["value"];

export function UpdateProductModal() {
  const [activeTab, setActiveTab] = useState<TabsValue>("media");
  const [direction, setDirection] = useState(0);

  const productModal = useProductModalStore((store) => store.productModal);
  const closeProductModal = useProductModalStore(
    (store) => store.closeProductModal,
  );
  const resetAllProductStores = useProductManagerStore(
    (store) => store.resetAllProductStores,
  );

  const open = !!productModal && productModal.type === "update-product";
  const productId = productModal?.product_id ?? null;

  // Store setters
  const setBasicInfo = useProductBasicInfoStore((s) => s.setBasicInfo);
  const setMedia = useProductMediaStore((s) => s.setMedia);
  const { setVariants, setInventory } = useProductVariantsStore();
  const setSeo = useProductSeoStore((s) => s.setSeo);

  // Fetch product data
  const { data, isLoading, isError, error } = useGetProductById(
    productId,
    open && !!productId,
  );

  // Populate store when data arrives
  useEffect(() => {
    if (!data?.data) return;

    const product = data.data;
    setBasicInfo(product.basic_info);
    setMedia(product.media);
    setVariants(product.variants);
    setSeo(product.seo);
    setInventory(product.inventory);
  }, [data?.data, setBasicInfo, setMedia, setVariants, setSeo, setInventory]);

  // Get current store values
  const basic_info = useProductBasicInfoStore((s) => s.basic_info);
  const media = useProductMediaStore((s) => s.media);
  const variants = useProductVariantsStore((s) => s.variants);
  const seo = useProductSeoStore((s) => s.seo);
  const inventory = useProductVariantsStore((s) => s.inventory);

  const { success, errors } = validateAllTabs({
    basic_info,
    media,
    variants,
    seo,
  });

  const { mutateAsync: updateProduct, isPending } = useUpdateProduct(
    basic_info?.id,
  );

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

    if (!productModal || productModal.type !== "update-product") {
      toastWarn("Product ID is missing. Cannot update product.");
      return;
    }

    try {
      await updateProduct({
        name: basic_info.name,
        description: basic_info.description,
        composition: basic_info.composition,
        price: basic_info.price,
        status: basic_info.status,
        tags: basic_info.tags,
        sub_category_id: basic_info.sub_category_id,
        seo,
        media,
        variants,
        inventory,
      });

      toastSuccess("Product updated successfully");
      handleCancel();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  const handleTabChange = (nextTab: string) => {
    if (isPending) return; // Prevent tab switching during update

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

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;

  // Show error dialog if data fetch failed
  if (isError) {
    return (
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Failed to load product</DialogTitle>
            <DialogDescription>
              {error?.message ||
                "Could not load product details. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : handleCancel}>
      <DialogContent
        onClose={handleCancel}
        className="sm:max-w-175 transition-all h-full max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Update product information and save changes.
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
            {isPending ? "Updating product..." : "Update Product"}
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
  <TabsList className="w-full min-h-11 grid grid-cols-5 flex-wrap gap-2">
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
}) => (
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
