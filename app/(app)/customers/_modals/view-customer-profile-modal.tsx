"use client";

import { useGetCustomerById } from "@/app/_queries/customers/get-customer-by-id";
import { DateDisplay } from "@/components/reuseables/date-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCustomerModalStore } from "@/lib/store/customers/use-customer-modal-store";
import { useMemo } from "react";

import { getOrderStatusVariant } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Copy,
  DollarSign,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";

export function ViewCustomerProfileModal() {
  const customerModal = useCustomerModalStore((s) => s.customerModal);
  const closeCustomerModal = useCustomerModalStore((s) => s.closeCustomerModal);
  const openCustomerModal = useCustomerModalStore((s) => s.openCustomerModal);

  const open =
    customerModal?.type === "view-customer-profile" &&
    !!customerModal?.customer_id;

  const customerId = customerModal?.customer_id;

  const { data, isLoading, error } = useGetCustomerById(customerId || "", {
    enabled: open && !!customerId,
  });

  const customer = data?.data;

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "ghost";
      case "suspended":
        return "secondary";
      case "banned":
      case "deleted":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const currency = useMemo(() => {
    const format = (amount?: number) => {
      const n = Number(amount ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n);
    };
    return { format };
  }, []);

  const copyToClipboard = async (value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // no-op
    }
  };

  if (!open) return null;

  if (isLoading) {
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => !next && closeCustomerModal()}>
        <DialogContent className="w-[calc(100vw-2rem)] min-w-0 sm:max-w-180 flex items-center justify-center min-h-105">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !customer) {
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => !next && closeCustomerModal()}>
        <DialogContent className="w-[calc(100vw-2rem)] min-w-0 sm:max-w-180">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {error?.message || "Failed to load customer details"}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const hasRestrictions =
    !!customer.ban_reason ||
    !!customer.suspended_until ||
    !!customer.suspended_reason;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeCustomerModal();
      }}>
      <DialogContent
        key={customer.id}
        className="w-[calc(100vw-2rem)] min-w-0 sm:max-w-180 max-h-[90dvh] overflow-y-auto p-0">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-background border-b px-4 sm:px-6 py-4">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer profile
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Complete profile information for{" "}
                  <span className="font-medium text-foreground">
                    {customer.name}
                  </span>
                </DialogDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() =>
                  openCustomerModal({
                    type: "update-customer-profile",
                    customer_id: customer.id,
                  })
                }>
                <Edit className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Update profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="px-4 sm:px-6 py-5 space-y-6">
          {/* Profile card */}
          <div className="border rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shrink-0">
                <AvatarImage
                  src={customer.avatar || "/avatar-placeholder.webp"}
                  alt={customer.name}
                />
                <AvatarFallback className="text-lg">
                  {customer.name}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight truncate">
                    {customer.name}
                  </h3>
                  <Badge
                    variant={getStatusVariant(customer.status)}
                    className="capitalize">
                    {customer.status}
                  </Badge>
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  Joined <DateDisplay date={customer.join_date} />
                </div>

                {/* Quick actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    disabled={!customer.email}>
                    <a href={customer.email ? `mailto:${customer.email}` : "#"}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    disabled={!customer.address?.phone}>
                    <a
                      href={
                        customer.address?.phone
                          ? `tel:${customer.address?.phone}`
                          : "#"
                      }>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(customer.email)}
                    disabled={!customer.email}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy email
                  </Button>
                </div>
              </div>
            </div>

            {/* Key details */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground shrink-0">Email</span>
                <span className="ml-auto font-medium truncate">
                  {customer.email}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground shrink-0">Phone</span>
                <span className="ml-auto font-medium truncate">
                  {customer.address?.phone || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground shrink-0">Address</span>
                <span className="ml-auto font-medium truncate">
                  {customer.address?.city || "N/A"}, {customer.address?.state},{" "}
                  {customer.address?.country}
                </span>
              </div>
            </div>
          </div>

          {/* Stats group */}
          <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0">
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  Total orders
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-semibold">
                  {customer.orders ?? 0}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 shrink-0" />
                  Total spent
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-semibold">
                  {currency.format(customer.total_spent)}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 shrink-0" />
                  Avg order
                </div>
                <div className="mt-2 text-xl sm:text-2xl font-semibold">
                  {currency.format(customer.avg_order_value)}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  Last order
                </div>
                <div className="mt-2 text-base sm:text-lg font-semibold">
                  {customer.last_order_date ? (
                    <DateDisplay date={customer.last_order_date} />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary info */}
          {customer.favorite_category ? (
            <div className="border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">
                Favourite category
              </div>
              <div className="mt-1 font-medium">
                {customer.favorite_category}
              </div>
            </div>
          ) : null}

          {/* Recent Orders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Recent orders</h4>
            </div>

            {customer.recent_orders && customer.recent_orders.length > 0 ? (
              <div className="space-y-2">
                {customer.recent_orders.map((order) => (
                  <div
                    key={order.id}
                    role="button"
                    tabIndex={0}
                    className="group flex items-center justify-between gap-2 sm:gap-4 p-3 border rounded-xl hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="min-w-0">
                      <p className="font-medium truncate text-sm sm:text-base">
                        {order.order_number}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <DateDisplay date={order.created_at} />
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">
                          {currency.format(order.total_amount)}
                        </p>
                        <Badge
                          variant={getOrderStatusVariant(order.status)}
                          className="text-xs capitalize">
                          {order.status}
                        </Badge>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-xl p-6 text-center text-sm text-muted-foreground">
                No orders yet
              </div>
            )}
          </div>

          {/* Restrictions */}
          {hasRestrictions ? (
            <>
              <Separator />
              <div className="border rounded-xl p-4 border-destructive/30 bg-destructive/5">
                <div className="flex items-center gap-2 font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Account restrictions
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  {customer.ban_reason ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-32 sm:w-36 shrink-0">
                        Ban reason
                      </span>
                      <span className="font-medium">{customer.ban_reason}</span>
                    </div>
                  ) : null}

                  {customer.suspended_until ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-32 sm:w-36 shrink-0">
                        Suspended until
                      </span>
                      <span className="font-medium">
                        <DateDisplay date={customer.suspended_until} />
                      </span>
                    </div>
                  ) : null}

                  {customer.suspended_reason ? (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-32 sm:w-36 shrink-0">
                        Suspension reason
                      </span>
                      <span className="font-medium">
                        {customer.suspended_reason}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
