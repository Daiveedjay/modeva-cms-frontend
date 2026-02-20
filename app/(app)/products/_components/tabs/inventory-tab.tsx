import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useProductVariantsStore } from "@/lib/store/product/use-product-variant-store";

export default function InventoryTab() {
  const inventory = useProductVariantsStore((s) => s.inventory);
  const setInventoryItem = useProductVariantsStore((s) => s.setInventoryItem);

  const totalStock = inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div>
      <TabsContent value="inventory" className="mt-0 p-4 space-y-6">
        <h3 className="text-lg font-semibold">Inventory</h3>

        <div className="space-y-4">
          {inventory.map((item) => (
            <div
              key={item.variant_name}
              className="grid grid-cols-2 gap-4 items-end">
              <Label className="col-span-1">{item.combo.join(" / ")}</Label>
              <Input
                className="col-span-1"
                type="number"
                min={0}
                value={item.quantity.toString()}
                onChange={(e) =>
                  setInventoryItem(
                    item.variant_name,
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
          ))}

          <div className="grid mt-10 grid-cols-3 items-center gap-4">
            <Label className="col-span-1">Total Stock</Label>
            <Input
              className="col-span-2"
              value={totalStock.toString()}
              disabled
            />
          </div>
        </div>
      </TabsContent>
    </motion.div>
  );
}
