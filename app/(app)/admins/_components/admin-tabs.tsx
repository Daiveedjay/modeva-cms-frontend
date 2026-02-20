import { AdminActivityLogs } from "@/app/(app)/admins/_components/admin-activity-logs";
import AdminTable from "@/app/(app)/admins/_components/admin-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClearQueryParams } from "@/hooks/use-clear-query-params";

export default function AdminTabs() {
  const { clearParams } = useClearQueryParams();

  return (
    <Tabs defaultValue="admins" className="space-y-4">
      <TabsList>
        <TabsTrigger
          className="  data-[state=active]:bg-primary!"
          value="admins"
          onClick={() => clearParams()}>
          Admin Users
        </TabsTrigger>
        <TabsTrigger
          className="  data-[state=active]:bg-primary!"
          value="activity"
          onClick={() => clearParams()}>
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
