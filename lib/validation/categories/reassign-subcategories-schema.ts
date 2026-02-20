// src/lib/reassign-subcategories-schema.ts

import { Category } from "@/lib/types/category";
import { z } from "zod";

export function validateReassignSubcategories(
  assignments: Record<string, string>,
  children: Category[],
  categories: Category[],
): string | null {
  const schema = z
    .object({ assignments: z.record(z.string(), z.string()) })
    .superRefine((data, ctx) => {
      const groups = new Map<string, Category[]>();

      for (const child of children) {
        const pid = data.assignments[child.id];
        if (!pid) {
          ctx.addIssue({
            code: "custom",
            path: ["assignments", child.id],
            message: `Sub-category "${child.name}" isn't assigned.`,
          });
          continue;
        }

        if (!groups.has(pid)) groups.set(pid, []);
        groups.get(pid)!.push(child);
      }

      for (const [parentId, subs] of groups.entries()) {
        const parent = categories.find((c) => c.id === parentId);
        const parentName = parent?.name ?? "(unknown)";

        // 1) Check against existing categories
        const existingNames = new Set(
          categories
            .filter((c) => c.parent_id === parentId)
            .map((c) => c.name.toLowerCase()),
        );

        for (const sub of subs) {
          if (existingNames.has(sub.name.toLowerCase())) {
            ctx.addIssue({
              code: "custom",
              path: ["assignments", sub.id],
              message: `“${sub.name}” already exists under “${parentName}”.`,
            });
          }
        }

        // 2) Check among the subs themselves
        const counts: Record<string, number> = {};
        for (const sub of subs) {
          const nm = sub.name.toLowerCase();
          counts[nm] = (counts[nm] || 0) + 1;
        }

        for (const [nm, cnt] of Object.entries(counts)) {
          if (cnt > 1) {
            ctx.addIssue({
              code: "custom",
              path: ["assignments"],
              message: `You're assigning multiple “${nm}” to “${parentName}”.`,
            });
          }
        }
      }
    });

  const result = schema.safeParse({ assignments });
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
