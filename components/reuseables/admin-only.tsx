import { useIsAdmin } from "@/hooks/use-is-admin";

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return <>{children}</>;
}
