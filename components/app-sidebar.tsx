"use client";

import {
  ChevronDown,
  FolderTree,
  Home,
  LogOut,
  Package,
  Shield,
  ShoppingCart,
  Store,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useGetAdminMe } from "@/app/_queries/admin/get-admin-me";

import { LoginModal } from "@/components/reuseables/login-modal";
import { LogoutModal } from "@/app/(app)/profile/_modals/logout-modal";
import Logo from "@/components/reuseables/logo";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderTree,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Admins",
    url: "/admins",
    icon: Shield,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { data, error } = useGetAdminMe();
  const profile = data?.data;
  const isLoggedIn = !error && profile;

  // const handleLoginSuccess = () => {
  //   // Refetch admin me to update sidebar
  //   refetch();
  // };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
               <Logo/>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Modeva CMS</span>
                  <span className="truncate text-xs">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={
                      pathname === item.url ? "text-primary!" : undefined
                    }>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoggedIn ? (
              // Logged in - show profile dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer!">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profile?.avatar} alt={profile?.name} />
                      <AvatarFallback className="rounded-lg">
                        {profile?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {profile?.name}
                      </span>
                      <span className="truncate text-xs">{profile?.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg "
                  side="bottom"
                  align="end"
                  sideOffset={4}>
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => setLogoutModalOpen(true)}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in - show login button
              <Button
                onClick={() => setLoginModalOpen(true)}
                className="w-full"
                size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Log in
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Login Modal */}
      <LoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        // onLoginSuccess={handleLoginSuccess}
      />

      {/* Logout Modal */}
      <LogoutModal
        open={logoutModalOpen}
        close={() => setLogoutModalOpen(false)}
      />
    </Sidebar>
  );
}
