"use client";

import { motion } from "motion/react";
import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SearchNoResultBaseProps {
  query: string;
  title: string;
  suggestions?: string[];
  icon?: LucideIcon;
}

export function SearchNoResultBase({
  query,
  title,
  suggestions = [],
  icon: Icon = SearchX,
}: SearchNoResultBaseProps) {
  return (
    <div className="py-10 px-8">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 border border-gray-200 dark:bg-gray-900/30 dark:border-gray-700">
            <Icon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
        </motion.div>

        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          No results found for <strong>&quot;{query}&quot;</strong>.
        </p>

        {suggestions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Suggestions:</p>
            <ul className="space-y-1 text-left max-w-xs mx-auto">
              {suggestions.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
