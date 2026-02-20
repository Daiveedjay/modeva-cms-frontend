/* =====================================
 * Value types
 * ===================================== */

export type DeviceType = "mobile" | "desktop" | "tablet";

/* =====================================
 * Analytics overview
 * ===================================== */

export interface AnalyticsOverview {
  total_revenue: number;
  revenue_growth_percent: number;
  total_orders: number;
  orders_growth_percent: number;
  total_inventory: number;
  inventory_growth_percent: number;
  active_customers: number;
  active_customers_growth_percent: number;
}

/* =====================================
 * Breakdown analytics
 * ===================================== */

export interface DeviceAnalytics {
  device_type: DeviceType;
  order_count: number;
  percentage: number;
}

export interface GeographicData {
  country: string; // ISO code or name — keep string unless backend guarantees enum
  order_count: number;
  percentage: number;
}

export interface MonthlyRevenueData {
  month: string;
  month_number: number;
  revenue: number;
}

/* =====================================
 * Sales metrics
 * ===================================== */

export interface SalesMetrics {
  average_order_value: number;
  customer_lifetime_value: number;
  return_customer_rate: number;
}

/* =====================================
 * Products
 * ===================================== */

export interface TopProduct {
  product_id: string;
  product_name: string;
  order_count: number;
  sales_count: number;
  revenue: number;
  revenue_percent: number;
}
