"use client";

import { CustomCarousel } from "@/components/reuseables/custom-carousel";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { useGetProductById } from "@/app/_queries/products/get-product-by-id";
import { ProductStatus } from "@/lib/store/product/use-product-basic-info-store";

import { Calendar, DollarSign, Warehouse, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProductManagerStore } from "@/lib/store/product/use-product-manager-store";

export function ViewProductDetailsModal() {
  const productModal = useProductModalStore((store) => store.productModal);
  const closeProductModal = useProductModalStore(
    (store) => store.closeProductModal,
  );

  const resetAllProductStores = useProductManagerStore(
    (store) => store.resetAllProductStores,
  );

  const open = !!productModal && productModal.type === "view-product";
  const productId = productModal?.product_id ?? null;

  console.log("ID", productId);

  // Fetch product data
  const { data, isLoading, isError, error } = useGetProductById(
    productId!,
    open && !!productId,
  );

  const handleClose = () => {
    closeProductModal();
    resetAllProductStores();
  };

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="min-w-4xl max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (isError || !data?.data) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="min-w-4xl max-h-[90dvh]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.message ||
                  "Failed to load product details. Please try again."}
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { media, inventory, basic_info } = data.data;

  const {
    name,
    status,
    sub_category_name,
    tags,
    description,
    price,
    created_at,
    updated_at,
  } = basic_info;

  // --- helpers ---
  const getOrderStatusVariant = (status: ProductStatus | string) => {
    const s = String(status).toLowerCase();
    if (s === "active") return "default" as const;
    if (s === "draft") return "secondary" as const;
    return "secondary" as const;
  };

  const getStatusColor = (status: ProductStatus | string) => {
    const s = String(status).toLowerCase();
    if (s === "active") return "text-success";
    if (s === "draft") return "text-yellow-600";
  };

  const primaryImage = media.primary.url;

  const otherImages = media.other
    ?.map((img) => (typeof img.url === "string" ? img.url : ""))
    .filter((url) => !!url);

  const productImages = [primaryImage, ...(otherImages || [])].filter(
    (url) => !!url,
  );

  // Total stock = sum of inventory quantities
  const totalStock = (inventory ?? []).reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );

  const stockStatus =
    totalStock === 0
      ? "Out of Stock"
      : totalStock < 10
        ? "Low Stock"
        : "In Stock";

  const stockColor =
    totalStock === 0
      ? "text-destructive"
      : totalStock < 10
        ? "text-yellow-600"
        : "text-success";

  const sales = 0;
  const rating = 0;
  const ratingsCount = 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-4xl max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted flex justify-center overflow-hidden rounded-sm w-100 items-center">
                {productImages.length > 0 ? (
                  <CustomCarousel>
                    {productImages.map((url, i) => (
                      <div
                        className="relative w-100 h-100 aspect-square"
                        key={i}>
                        <Image
                          src={url}
                          fill
                          alt={`${name} - Image ${i + 1}`}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </CustomCarousel>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No images available
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-muted-foreground mt-1">{description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={getOrderStatusVariant(status)}
                    className="capitalize">
                    {status}
                  </Badge>
                  <span
                    className={`text-sm font-medium ${getStatusColor(status)}`}>
                    {stockStatus}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Price
                  </div>
                  <div className="text-2xl font-bold">${price?.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Warehouse className="h-4 w-4" />
                    Stock
                  </div>
                  <div className={`text-2xl font-bold ${stockColor}`}>
                    {totalStock} units
                  </div>
                </div>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Sub-category
                    </label>
                    <div className="mt-1">{sub_category_name || "N/A"}</div>
                  </div>
                </div>

                {/* Tags */}
                {tags && tags?.length > 0 ? (
                  <Tags tags={tags || []} />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No tags to display
                  </span>
                )}
              </div>

              <Separator />

              {/* Additional Info */}
              <AdditionalInfo
                createdAt={created_at ? new Date(created_at) : null}
                updatedAt={updated_at ? new Date(updated_at) : null}
                price={price}
                totalStock={totalStock}
              />

              {/* Performance Metrics */}
              <PerformanceMetric
                sales={sales}
                price={price}
                rating={rating}
                ratingsCount={ratingsCount}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const Tags = ({ tags }: { tags: string[] }) => {
  if (tags.length === 0)
    return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
};

type AdditionalInfoProps = {
  createdAt: Date | null;
  updatedAt: Date | null;
  price: number;
  totalStock: number;
};

const AdditionalInfo = ({
  createdAt,
  price,
  totalStock,
  updatedAt,
}: AdditionalInfoProps) => {
  const createdAtLabel = createdAt
    ? createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "—";
  const updatedAtLabel = updatedAt
    ? updatedAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "—";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <label className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created
          </label>
          <div className="mt-1">{createdAtLabel}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Total Value
          </label>
          <div className="text-lg font-semibold mt-1">
            ${(price * totalStock).toLocaleString()}
          </div>
        </div>
        <div>
          <label className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Updated
          </label>
          <div className="mt-1">{updatedAtLabel}</div>
        </div>
      </div>
    </div>
  );
};

type PerformanceMetricProps = {
  sales: number;
  price: number;
  rating: number;
  ratingsCount: number;
};

const PerformanceMetric = ({
  sales,
  price,
  rating,
  ratingsCount,
}: PerformanceMetricProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <h3 className="font-medium">Performance Metrics</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Sales</div>
          <div className="font-medium">
            {(sales ?? 0).toLocaleString()} units
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Revenue</div>
          <div className="font-medium">
            ${(price * (sales ?? 0)).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Ratings</div>
          <div className="font-medium">
            {rating ? `${rating.toFixed(1)} / 5` : "N/A"}
            {ratingsCount
              ? ` from ${ratingsCount.toLocaleString()} ratings`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};
