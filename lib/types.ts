import { Category } from "@/lib/types/category";

export type CategoryModalState =
  // Add
  | { type: "add-category"; category_id: null }
  | { type: "add-sub-category"; category_id: string }

  // Update
  | { type: "update-category"; category_id: string | null }
  | {
      type: "update-sub-category";
      category_id: string | null;
    }
  // Delete
  | { type: "delete-category"; category_id: string | null }
  | { type: "delete-sub-category"; category_id: string | null }

  // Reassign
  | { type: "reassign-before-delete"; category_id: string | null }
  // Toggle status
  | { type: "toggle-category-status"; category_id: string | null }
  | null;

export type CategoryNode = Category & { children: CategoryNode[] };

export type OrderModalState =
  | {
      type: "view-order-details";
      orderId: string | null;
    }
  | {
      type: "update-order-status";
      orderId: string | null;
    }
  | {
      type: "manage-order-invoice";
      orderId: string | null;
    }
  | {
      type: "cancel-customer-order";
      orderId: string | null;
    }
  | null;

export type CustomerModalState =
  | {
      type: "add-customer";
      customer_id: string | null;
    }
  | {
      type: "ban-customer";
      customer_id: string | null;
    }
  | {
      type: "delete-customer";
      customer_id: string | null;
    }
  | {
      type: "send-customer-email";
      customer_id: string | null;
    }
  | {
      type: "view-customer-orders";
      customer_id: string | null;
    }
  | {
      type: "view-customer-profile";
      customer_id: string | null;
    }
  | {
      type: "update-customer-profile";
      customer_id: string | null;
    }
  | null;

export type ProductModalState =
  | {
      type: "add-product";
      product_id: string | null;
      // product: null;
    }
  | {
      type: "view-product";
      product_id: string | null;
      // product: Product;
    }
  | {
      type: "delete-product";
      product_id: string | null;
      // product: Product;
      // productId: string;
    }
  | {
      type: "update-product";
      product_id: string | null;
      // product: Product;
    };

export type AdminModalState =
  | {
      type: "view-admin-details";
      admin_id: string | null;
    }
  | {
      type: "suspend-admin";
      admin_id: string | null;
    }
  | {
      type: "unsuspend-admin";
      admin_id: string | null;
    }
  | {
      type: "view-admin-activity";
      admin_id: string | null;
    }
  | {
      type: "add-admin";
      admin_id: null;
    }
  | null;

export interface InvoiceItem {
  /** unique within this invoice */
  id: string;
  /** product name or service description */
  name: string;
  /** number of units */
  quantity: number;
  /** unit price, in your smallest currency unit or decimal */
  price: number;
}

// export interface Invoice {
//   /** same as order id */
//   id: string;
//   /** who we’re billing */
//   customerName: string;
//   email: string;
//   /** ISO date string (you can switch to `Date` if you prefer) */
//   date: string;
//   /** where to bill/ship */
//   billingAddress?: AddressData;
//   shippingAddress?: AddressData;
//   /** the line items on this invoice */
//   items: InvoiceItem[];
//   /** computed by your modal/store */
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   /** subtotal + shipping + tax */
//   total: number;
// }

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ApiEndpoint = `/api/v1/${string}`;
type RequestedEntity = `${HttpMethod} ${ApiEndpoint}`;

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  meta: Meta;
  rate_limit: RateLimit;
  error?: boolean;
  requested_entity: RequestedEntity;
}

interface RateLimit {
  limit: number;
  remaining: number;
  reset_at: string;
  reset_in_seconds: number;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// interface ApiResponse {
//   message: string;
//   data: Category[];
//   meta: Meta;
// }
