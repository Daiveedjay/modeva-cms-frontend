import { useState, useCallback } from "react";

const PRIVILEGED_DISMISSED_KEY = "modeva_user_privileged_dismissed";

/**
 * Hook to manage whether user has dismissed the "not privileged" modal
 * Uses localStorage to persist across page reloads
 */
export function usePrivilegedModal() {
  const [isPermanentlyDismissed, setIsPermanentlyDismissed] = useState(() => {
    try {
      return localStorage.getItem(PRIVILEGED_DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(PRIVILEGED_DISMISSED_KEY, "true");
    } catch {}
    setIsPermanentlyDismissed(true);
    setIsTemporarilyClosed(true);
  }, []);

  const close = useCallback(() => {
    setIsTemporarilyClosed(true);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(PRIVILEGED_DISMISSED_KEY);
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
