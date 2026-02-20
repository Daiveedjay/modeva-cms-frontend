
/* =====================================
 * Value types
 * ===================================== */

import { OrderStatus } from "@/lib/types/order";

export type CustomerStatus = "active" | "suspended" | "deleted" | "banned";
export type ActivityStatus = "active" | "inactive";

/* =====================================
 * Requests / responses
 * ===================================== */

export interface BanCustomerRequest {
  reason: string;
}

export interface BanCustomerResponse {
  id: string;
  name: string;
  status: CustomerStatus;
  ban_reason: string;
  banned_at: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResponse {
  message: string;
  sent_at: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  status?: CustomerStatus;
  ban_reason?: string;
  suspended_until?: string;
  suspended_reason?: string;
}

export interface UpdateCustomerResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  ban_reason?: string;
  suspended_until?: string;
  suspended_reason?: string;
}

/* =====================================
 * Domain models (API-level)
 * ===================================== */

export interface Address {
  id: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface RecentOrder {
  order_number: string;
  id: string;
  total_amount: number;
  created_at: string;
  status: OrderStatus;
}

export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  status: CustomerStatus;
  orders: number;
  total_spent: number;
  avg_order_value: number;
  join_date: string;
  last_order_date: string;
  favorite_category: string | null;
  ban_reason: string | null;
  suspended_until: string | null;
  suspended_reason: string | null;
  address: Address | null;
  recent_orders: RecentOrder[];
}

export interface CustomerListItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  orders: number;
  total_spent: number;
  status: CustomerStatus;
  activity: ActivityStatus;
  join_date: string;
  ban_reason?: string | null;
  suspended_until?: string | null;
  suspended_reason?: string | null;
}

export interface CustomerOrder {
  order_number: string;
  id: string;
  total_amount: number;
  created_at: string;
  status: OrderStatus;
  customer_name: string;
}

/* =====================================
 * Stats
 * ===================================== */

export interface CustomerStats {
  total_customers: number;
  new_customers_this_month: number;
  new_customers_growth_percentage: number;
  active_customers: number;
  active_customers_percentage: number;
  avg_order_value: number;
}

/* =====================================
 * Search
 * ===================================== */

export interface SearchCustomersParams {
  page?: number;
  limit?: number;
  q?: string;
  email?: string;
  status?: CustomerStatus;
  joined_from?: string;
  joined_to?: string;
  country?: string;
  spending_exact?: number;
  spending_min?: number;
  spending_max?: number;
}

export interface SearchCustomersFilters {
  query: string;
  email: string;
  status: CustomerStatus | "all";
  joinedFrom?: Date;
  joinedTo?: Date;
  country?: string;
  useExactSpending?: boolean;
  exactSpending?: number;
  spendingMin?: number;
  spendingMax?: number;
}
