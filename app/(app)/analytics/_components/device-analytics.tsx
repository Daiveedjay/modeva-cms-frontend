"use client";

import { useGetDeviceAnalytics } from "@/app/_queries/analytics/get-device-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export function DeviceAnalytics() {
  const { data, isLoading, isError } = useGetDeviceAnalytics();

  const devices = data?.data;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">Failed to load device analytics</p>
      </div>
    );
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      case "desktop":
      default:
        return Monitor;
    }
  };

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "mobile":
        return "bg-blue-50 border-blue-100 text-blue-600";
      case "tablet":
        return "bg-purple-50 border-purple-100 text-purple-600";
      case "desktop":
      default:
        return "bg-green-50 border-green-100 text-green-600";
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Device Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {" "}
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </>
            ) : devices && devices.length > 0 ? (
              devices.map((device) => {
                const Icon = getDeviceIcon(device.device_type);

                return (
                  <div
                    key={device.device_type}
                    className={`rounded-lg border p-2 `}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground capitalize">
                          {device.device_type}
                        </p>
                        <Icon className="h-5 w-5 opacity-50" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-2xl font-bold">
                          {device.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {device.order_count.toLocaleString()}{" "}
                          {device.order_count === 1 ? "order" : "orders"}
                        </p>
                      </div>

                      {/* Visual bar */}
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mt-3">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          //   style={{
                          //     width: `${device.percentage}%`,
                          //     backgroundColor:
                          //       device.device_type.toLowerCase() === "mobile"
                          //         ? "#3b82f6"
                          //         : device.device_type.toLowerCase() === "tablet"
                          //           ? "#a855f7"
                          //           : "#22c55e",
                          //   }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 py-8 text-center text-muted-foreground">
                No device data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
