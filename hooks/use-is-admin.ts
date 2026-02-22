import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";

// hooks/use-is-admin.ts
export function useIsAdmin() {
  const { data: me } = useGetAdminMe();
  return me?.data?.role === "admin" || me?.data?.role === "super_admin";
}
