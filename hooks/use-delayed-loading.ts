import { useState, useEffect } from "react";

export function useDelayedLoading(isLoading: boolean, delay = 300): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      setShowLoading(false);
    };
  }, [isLoading, delay]);

  // If we're not loading, never show loading
  return isLoading && showLoading;
}
