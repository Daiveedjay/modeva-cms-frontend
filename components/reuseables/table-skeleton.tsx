import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TableSkeleton({
  rows = 5,
  colSpan = 6,
}: {
  rows?: number;
  colSpan?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: colSpan }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton
                className={
                  j === 0
                    ? "h-5 w-40" // first column wide
                    : j === colSpan - 1
                      ? "h-5 w-10" // actions column smaller
                      : "h-5 w-24" // default size
                }
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
