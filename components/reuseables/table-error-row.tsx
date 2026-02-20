import { AlertCircle, RotateCcw } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function TableErrorRow({
  colSpan,
  message,
  onRetry,
}: {
  colSpan: number;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Failed to load products</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {message || "Something went wrong while fetching products."}
          </p>
          <Button
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
