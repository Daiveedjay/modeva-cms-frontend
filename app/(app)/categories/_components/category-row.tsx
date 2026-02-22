import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/types/category";
import { CategoryActions } from "./category-actions";
import { AdminOnly } from "@/components/reuseables/admin-only";

interface Props {
  category: Category;
  level: number;
  parent?: Category;
}

export function CategoryRow({ category, parent, level }: Props) {
  return (
    <TableRow
      key={category.id}
      className={`${
        category.parent_id === null ? "bg-accent/20" : ""
      } hover:bg-accent/90`}>
      <TableCell className="font-medium">
        <div
          className="flex items-center gap-2"
          style={{ paddingLeft: level * 24 }}>
          {level > 0 && <span className="text-muted-foreground">└─</span>}
          {category.name}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {category.description}
      </TableCell>
      <TableCell>{category?.parent_name || "—"}</TableCell>
      <TableCell>{category.products}</TableCell>
      <TableCell>
        <Badge variant={category.status === "Active" ? "default" : "secondary"}>
          {category.status}
        </Badge>
      </TableCell>
      <AdminOnly>
        {" "}
        <TableCell>
          <CategoryActions category={category} parentStatus={parent?.status} />
        </TableCell>
      </AdminOnly>
    </TableRow>
  );
}
