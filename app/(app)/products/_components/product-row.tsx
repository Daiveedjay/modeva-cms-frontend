import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

import ProductActions from "@/app/(app)/products/_components/product-actions";
import { Product } from "@/lib/store/product/use-product-manager-store";
import { ProductInventoryField } from "@/lib/types/product";


export function ProductRow({ product }: { product: Product }) {
  const totalQuantity = product?.inventory?.reduce(
    (sum: number, i: ProductInventoryField) => sum + i.quantity,
    0,
  );

  return (
    <TableRow key={product.basic_info.id}>
      <TableCell>
        <Avatar>
          <AvatarImage src={product.media?.primary?.url || "/David.webp"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </TableCell>

      <TableCell className="font-medium ">
        <span>
          {product.basic_info.name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      </TableCell>
      <TableCell>{product.basic_info?.sub_category_path}</TableCell>
      <TableCell>{product.basic_info.price}</TableCell>
      <TableCell>{totalQuantity}</TableCell>

      <TableCell>
        <Badge
          variant={
            product.basic_info.status === "Active"
              ? "default"
              : product.basic_info.status === "Draft"
                ? "secondary"
                : "destructive"
          }>
          {product.basic_info.status}
        </Badge>
      </TableCell>

      <TableCell>
        <ProductActions productId={product.basic_info.id} />
      </TableCell>
    </TableRow>
  );
}
