/* =====================================
 * Value types
 * ===================================== */

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentMethodType = "card" | "paypal";

/* =====================================
 * Domain models
 * ===================================== */

export interface OrderAddressDetails {
  label: string;
  first_name: string;
  last_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItemDetails {
  id: string;
  order_id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  variant_size: string;
  variant_color: string;
  price: number;
  quantity: number;
  subtotal: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  product_image: string;
}

export interface OrderDetails {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;

  customer_id: string;
  customer_name: string;
  customer_email: string;

  payment_method_type?: PaymentMethodType;
  payment_method_last4?: string;
  payment_method_label: string;

  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total_amount: number;

  customer_notes?: string;
  admin_notes?: string;

  address_snapshot?: string;
  address: OrderAddressDetails;

  items: OrderItemDetails[];
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  item_count: number;
  total_quantity: number;
  total_amount: number;
  status: OrderStatus;
}

/* =====================================
 * Stats
 * ===================================== */

export interface OrderStatsBreakdown {
  count: number;
  description: string;
}

export interface OrderStatsResponse {
  total_orders: number;
  change_percent_from_last_month?: number | null;
  current_month_total: number;
  last_month_total: number;
  pending: OrderStatsBreakdown;
  processing: OrderStatsBreakdown;
  shipped: OrderStatsBreakdown;
  completed: OrderStatsBreakdown;
  cancelled: OrderStatsBreakdown;
}

/* =====================================
 * Search / filters
 * ===================================== */

export interface OrderSearchParams {
  page?: number;
  limit?: number;

  q?: string;

  order_number?: string;
  customer?: string;
  email?: string;

  status?: OrderStatus;

  price?: number;
  min_price?: number;
  max_price?: number;

  created_from?: string;
  created_to?: string;
}

/* =====================================
 * Status updates
 * ===================================== */

export interface OrderStatusResponse {
  id: string;
  order_number: string;
  status: OrderStatus;
  admin_notes: string;
}

export interface OrderStatusRequest {
  status: OrderStatus;
  admin_notes?: string;
}
