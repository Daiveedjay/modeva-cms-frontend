"use client";

import { useDeleteProduct } from "@/app/_queries/products/delete-product";
import { useGetProductById } from "@/app/_queries/products/get-product-by-id";
import { Spinner } from "@/components/reuseables/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { toastSuccess } from "@/lib/utils";
import { AlertTriangle, Package } from "lucide-react";
import Image from "next/image";

export function DeleteProductModal() {
  const productModal = useProductModalStore((store) => store.productModal);
  const closeProductModal = useProductModalStore(
    (store) => store.closeProductModal,
  );

  const open = !!productModal && productModal.type === "delete-product";
  const productId = productModal?.product_id ?? null;

  const { data, isLoading } = useGetProductById(productId, open && !!productId);

  const product = data?.data;
  const productBasicInfo = product?.basic_info;
  const productPrimaryMedia = product?.media?.primary?.url;

  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct(
    productBasicInfo?.id ?? "",
  );

  // Keep modal closed until data loads
  if (!open) return null;
  if (isLoading) return null;
  if (!productBasicInfo) return null;

  const handleDelete = async () => {
    if (!productBasicInfo?.id) return;

    try {
      await deleteProduct();

      toastSuccess("Product deleted successfully");
      closeProductModal();
    } catch {
      // Error toast handled in API file
      // Keep modal open so user can retry
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isPending ? undefined : closeProductModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Product
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            product and clear it from the store.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Preview */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-foreground">
                {productPrimaryMedia ? (
                  <Image
                    src={productPrimaryMedia as string}
                    alt={productBasicInfo.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {productBasicInfo.name}
                </h4>
                <p className="text-sm font-light text-muted-foreground mb-4">
                  {productBasicInfo.description}
                </p>
                <p className="text-sm font-medium mt-1">
                  ${productBasicInfo.price?.toFixed(2) ?? "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Warning:</strong> Deleting this product will remove all
              associated data. Consider archiving if needed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeProductModal}
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
