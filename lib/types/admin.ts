/* =====================================
 * Auth / Admin core
 * ===================================== */

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface InviteAdminInput {
  email: string;
}

export interface AcceptAdminInviteRequest {
  email: string;
  token: string;
  name: string;
  password: string;
}

export type AdminRole = "super_admin" | "admin";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface AdminBase {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  avatar?: string;
}

export interface AdminInfo extends AdminBase {
  last_login_at?: string;
  joined_at?: string;
}

export interface AdminLoginResponse {
  admin: AdminInfo;
  token: string;
}

export interface AdminMeResponse extends AdminBase {
  phone_number?: string;
  country?: string;
  last_login_at?: string;
  joined_at?: string;
}

export interface Admin extends AdminBase {
  avatar: string;
  phone_number: string;
  country: string;
  last_login_at: string | null;
  joined_at: string;
}

export interface UpdateAdminProfileInput {
  name?: string;
  phone_number?: string;
  country?: string;
  avatar?: File | null;
}

/* =====================================
 * Activity logs
 * ===================================== */

export type ActivityStatus = "success" | "failed";
export type ActivityAction = "create" | "update" | "delete";
export type ResourceType =
  | "category"
  | "product"
  | "order"
  | "customer"
  | "admin";

export interface ActivityChangeSnapshot {
  id: string;
  name: string;
  description: string;
  status: string;
  parent_id: string | null;
  parent_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityChanges {
  before: ActivityChangeSnapshot;
  after: ActivityChangeSnapshot;
}

export interface ActivityLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: ActivityAction;
  resource_type: ResourceType;
  resource_id: string;
  resource_name: string;
  changes: ActivityChanges;
  status: ActivityStatus;
  error_message?: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export type ActivityLogsAdmin = AdminBase;

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  admin: ActivityLogsAdmin;
}

export interface AllAdminActivityLogsResponse {
  logs: ActivityLog[];
}

/* =====================================
 * Search / filters
 * ===================================== */

export interface ActivityLogSearchParams {
  page?: number;
  limit?: number;

  query?: string;

  action?: ActivityAction;
  status?: ActivityStatus;
  resource_type?: ResourceType;
  admin_email?: string;

  created_from?: string;
  created_to?: string;
}

/* =====================================
 * Mutations
 * ===================================== */

export interface SuspendAdminRequest {
  admin_id: string;
  reason?: string;
}

export interface UnsuspendAdminRequest {
  admin_id: string;
}
