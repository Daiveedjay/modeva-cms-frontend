"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AdminActivityLogs } from "@/app/(app)/admins/_components/admin-activity-logs";
import AdminTable from "@/app/(app)/admins/_components/admin-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";

export default function AdminTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearParams } = useClearQueryParams();

  // Get tab from URL (?tab=admins | activity)
  const currentTab = searchParams.get("tab") ?? "admins";

  const handleTabChange = (value: string) => {
    clearParams();

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    router.replace(`?${params.toString()}`);
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="space-y-4">
      <TabsList>
        <TabsTrigger className="data-[state=active]:bg-primary!" value="admins">
          Admin Users
        </TabsTrigger>

        <TabsTrigger
          className="data-[state=active]:bg-primary!"
          value="activity">
          Activity Log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="admins" className="space-y-4">
        <AdminTable />
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <AdminActivityLogs />
      </TabsContent>
    </Tabs>
  );
}
