// src/components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block w-full min-h-16 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40 dark:bg-input/30 md:text-sm",
        // wrap text and break long words
        "whitespace-pre-wrap wrap-break-word text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
