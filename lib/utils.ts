import { SHIPPING_PERCENTAGE, TAX_PERCENTAGE } from "@/lib/constants";
import { ActivityStatus, CustomerStatus } from "@/lib/types/customer";
import { OrderItemDetails, OrderStatus } from "@/lib/types/order";
import { clsx, type ClassValue } from "clsx";
import React from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toastWarn(title: string, description?: string) {
  return toast.warning(title, {
    position: "top-right",
    closeButton: true,
    description,
    style: {
      "--normal-bg":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
      "--normal-text": "var(--color-white)",
      "--normal-border":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
    } as React.CSSProperties,
  });
}

export function toastError(title: string, description?: string) {
  return toast.error(title, {
    position: "top-right",
    closeButton: true,
    description,
    descriptionClassName: " text-white!",
    style: {
      "--normal-bg": "var(--color-red-600)",
      "--normal-text": "var(--color-white)",
      "--normal-border": "var(--color-red-600)",
    } as React.CSSProperties,
  });
}

export function toastSuccess(title: string, description?: string) {
  return toast.success(title, {
    position: "top-right",
    closeButton: true,
    description,
    style: {
      "--normal-bg": "var(--color-green-600)",
      "--normal-text": "var(--color-white)",
      "--normal-border": "var(--color-green-600)",
    } as React.CSSProperties,
  });
}

export const getOrderStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "secondary";
    case "shipped":
      return "outline";
    case "pending":
      return "ghost";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getActivityVariant = (status: ActivityStatus) => {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    default:
      return "secondary";
  }
};

export const getCustomerStatusVariant = (status: CustomerStatus) => {
  switch (status) {
    case "active":
      return "success";
    case "suspended":
      return "secondary";
    case "deleted":
      return "outline";
    case "banned":
      return "destructive";
    default:
      return "secondary";
  }
};

export const calcSubTotal = (array: OrderItemDetails[]) =>
  array.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

export const calcShipping = (subTotal: number) =>
  subTotal <= 0 ? 0 : subTotal * (SHIPPING_PERCENTAGE / 100);

export const calcTax = (subTotal: number) =>
  subTotal <= 0 ? 0 : subTotal * (TAX_PERCENTAGE / 100);

export const mergeCustomerName = (firstName: string, lastName: string) =>
  `${firstName}, ${lastName}`;

export const getCustomerInitials = (firstName: string, lastName: string) =>
  `${firstName[0]}${lastName[0]}`;

export const getCustomerAddress = (city: string, country: string) =>
  `${city}, ${country}`;

export function formatDateYYYYMMDD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatNiceDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export interface SharedQueryParams {
  page: number;
  limit: number;
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export const capitaliseFirstLetter = (content: string) => {
  return content?.charAt(0).toUpperCase() + content?.slice(1);
};

export function getActionColor(action: string): string {
  switch (action) {
    /* ========================
       POSITIVE (Green)
    ======================== */
    case "created_product":
    case "created_category":
    case "created_admin_invite":
    case "unsuspended_admin":
    case "unsuspended_customer":
    case "unbanned_customer":
    case "accepted_admin_invite":
      return "bg-success text-foreground";

    /* ========================
       DESTRUCTIVE (Red)
    ======================== */
    case "deleted_product":
    case "deleted_category":
    case "deleted_customer":
      return "bg-destructive";

    /* ========================
       WARNING (Orange)
    ======================== */
    case "suspended_admin":
    case "suspended_customer":
    case "banned_customer":
      return "bg-destructive ";

    /* ========================
       UPDATES (Neutral Blue)
    ======================== */
    case "updated_product":
    case "updated_category":
    case "updated_order":
    case "updated_customer":
    case "updated_admin_profile":
      return "bg-primary text-background ";

    /* ========================
       FALLBACK (Safety Net)
    ======================== */
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

export const ACTION_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "created_product", label: "Created Product" },
  { value: "updated_product", label: "Updated Product" },
  { value: "deleted_product", label: "Deleted Product" },
  { value: "created_category", label: "Created Category" },
  { value: "updated_category", label: "Updated Category" },
  { value: "deleted_category", label: "Deleted Category" },
  { value: "updated_order", label: "Updated Order" },
  { value: "updated_customer", label: "Updated Customer" },
  { value: "created_admin_invite", label: "Created Admin Invite" },
  { value: "suspended_admin", label: "Suspended Admin" },
  { value: "unsuspended_admin", label: "Unsuspended Admin" },
];
