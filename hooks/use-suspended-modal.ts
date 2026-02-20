import { useState, useCallback } from "react";

const SUSPENDED_DISMISSED_KEY = "modeva_suspended_modal_dismissed";

/**
 * Hook to manage whether user has dismissed the "account suspended" modal
 * Uses localStorage to persist across page reloads
 */
export function useSuspendedModal() {
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(() => {
    try {
      return localStorage.getItem(SUSPENDED_DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SUSPENDED_DISMISSED_KEY, "true");
    } catch {}
    setIsPermanentlyDismissed(true);
    setIsTemporarilyClosed(true);
  }, []);

  const close = useCallback(() => {
    setIsTemporarilyClosed(true);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(SUSPENDED_DISMISSED_KEY);
    } catch {}
    setIsPermanentlyDismissed(false);
    setIsTemporarilyClosed(false);
  }, []);

  const shouldShow = !isPermanentlyDismissed && !isTemporarilyClosed;

  return {
    shouldShow,
    dismiss,
    close,
    reset,
  };
}
