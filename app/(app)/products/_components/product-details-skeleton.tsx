import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ProductDetailsSkeleton({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl! max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image carousel skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-100px h-100px rounded-sm" />
            </div>

            {/* Product info skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </div>

                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
