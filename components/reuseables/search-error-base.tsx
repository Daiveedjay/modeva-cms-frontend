"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SearchErrorBaseProps {
  title: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  mainIcon?: LucideIcon;
  floatingIcon?: LucideIcon;
}

export function SearchErrorBase({
  title,
  message,
  onRetry,
  isRetrying = false,
  mainIcon: MainIcon = AlertTriangle,
  floatingIcon: FloatingIcon,
}: SearchErrorBaseProps) {
  return (
    <div className="py-16 px-8">
      <div className="max-w-md mx-auto text-center relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
            <MainIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
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
          className="text-muted-foreground mb-8"
        >
          {message}
        </motion.p>

        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Try Again"}
          </Button>
        )}

        {FloatingIcon && (
          <motion.div
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 right-10"
          >
            <FloatingIcon className="w-8 h-8 text-red-300 dark:text-red-700" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
