import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminModalStore } from "@/lib/store/admins/use-admins-modal-store";
import { Admin } from "@/lib/types/admin";

import { MoreHorizontal } from "lucide-react";

export default function AdminActions({ admin }: { admin: Admin }) {
  const { openAdminModal } = useAdminModalStore((store) => store);
  const { data } = useGetAdminMe();

  const is_super_admin = data?.data?.role === "super_admin";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-8 flex justify-center items-center w-8 p-0 hover:bg-accent rounded-sm cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2 space-y-1 w-44" align="end" sideOffset={4}>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            openAdminModal({
              type: "view-admin-details",
              admin_id: admin.id,
            })
          }>
          View Details
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() =>
            openAdminModal({
              type: "view-admin-activity",
              admin_id: admin.id,
            })
          }>
          View Activity
        </Button>

        {admin.role !== "super_admin" && is_super_admin && (
          <>
            {admin.status === "active" ? (
              <Button
                variant="ghost"
                className="w-full text-destructive justify-start"
                onClick={() =>
                  openAdminModal({
                    type: "suspend-admin",
                    admin_id: admin.id,
                  })
                }>
                Suspend Admin
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full text-success justify-start"
                onClick={() =>
                  openAdminModal({
                    type: "unsuspend-admin",
                    admin_id: admin.id,
                  })
                }>
                Unsuspend Admin
              </Button>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
