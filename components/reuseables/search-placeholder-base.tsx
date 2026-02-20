"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SearchPlaceholderBaseProps {
  title: string;
  description: string;
  suggestions?: string[];
  mainIcon: LucideIcon;
  floatingIcons?: LucideIcon[];
  setQuery?: (q: string) => void;
  isLoading?: boolean;
}

export function SearchPlaceholderBase({
  title,
  description,
  suggestions,
  mainIcon: MainIcon,
  floatingIcons = [],
  setQuery,
  isLoading = false,
}: SearchPlaceholderBaseProps) {
  return (
    <div
      className={`py-10 px-8 transition-opacity duration-300 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="max-w-md mx-auto text-center relative">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20">
            <MainIcon className="w-8 h-8 text-primary" />

            {/* Sparkles */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary" />
              <Sparkles className="absolute -bottom-1 -left-2 w-3 h-3 text-secondary" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-semibold mb-3"
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground mb-8 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">
              Try searching for:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
            {suggestions?.map((s, i) => (
              <motion.span
                key={s}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-full border border-primary/20 hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
                onClick={() => !isLoading && setQuery?.(s)}
              >
                {s}
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            ))}
          </div>
        </div>
        )}

        {/* Floating icons */}
        {floatingIcons.map((Icon, idx) => (
          <motion.div
            key={idx}
            animate={{
              x: [0, idx % 2 === 0 ? 60 : -60, 0],
              y: [0, idx % 2 === 0 ? -30 : 30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + idx,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 1.5,
            }}
            className={`absolute ${
              idx % 2 === 0 ? "top-10 left-10" : "bottom-10 right-10"
            }`}
          >
            <Icon className="w-6 h-6 text-primary/30" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
