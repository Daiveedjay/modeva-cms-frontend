import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { ProductModalState } from "@/lib/types";

export default function ProductActions({ productId }: { productId: string }) {
  const openProductModal = useProductModalStore(
    (store) => store.openProductModal,
  );

  const handleAction = (type: ProductModalState["type"]) => {
    openProductModal({ type, product_id: productId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAction("view-product")}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("update-product")}>
          Update Product
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction("delete-product")}
          className="text-destructive">
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
