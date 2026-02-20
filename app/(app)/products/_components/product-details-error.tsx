import { AlertCircle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProductDetailsError({
  open,
  onClose,
  message,
  onRetry,
}: {
  open: boolean;
  onClose: () => void;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-md!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error loading product
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 text-sm text-muted-foreground space-y-4">
          <p>
            {message ||
              "Something went wrong while fetching this product. Please try again."}
          </p>
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
