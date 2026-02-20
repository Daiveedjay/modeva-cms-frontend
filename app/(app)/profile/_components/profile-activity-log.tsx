"use client";

import {
  ChevronRight,
  Clock,
  FileText,
  LogOut,
  Settings,
  User,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "login",
    title: "Logged in",
    timestamp: "Today at 10:30 AM",
    icon: LogOut,
  },
  {
    id: 2,
    type: "product",
    title: "Added 3 new products",
    timestamp: "Yesterday at 2:15 PM",
    icon: FileText,
  },
  {
    id: 3,
    type: "profile",
    title: "Updated profile picture",
    timestamp: "2 days ago",
    icon: User,
  },
  {
    id: 4,
    type: "settings",
    title: "Changed password",
    timestamp: "1 week ago",
    icon: Settings,
  },
  {
    id: 5,
    type: "login",
    title: "Logged in",
    timestamp: "1 week ago",
    icon: LogOut,
  },
  {
    id: 6,
    type: "product",
    title: "Modified order status",
    timestamp: "2 weeks ago",
    icon: FileText,
  },
];

export function ProfileActivityLog() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex gap-3">
              {/* Vertical Line */}
              {index !== activities.length - 1 && (
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-0.5 h-8 bg-neutral-800 my-1" />
                </div>
              )}
              {index === activities.length - 1 && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shrink-0">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1  flex justify-between ">
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
                <div className="p-2 h-min hover:bg-muted rounded-full transition-colors">
                  <ChevronRight className="w-4 cursor-pointer   h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 px-4 py-2 text-sm font-medium text-primary bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors">
        View All Activity
      </button>
    </div>
  );
}
