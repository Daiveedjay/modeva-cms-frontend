// lib/activity-descriptions.ts

export interface ActivityChanges {
  before?: Record<string, any>;
  after?: Record<string, any>;
}

export function getDetailedActivityDescription(
  action: string,
  resourceType: string,
  resourceName: string,
  changes?: Record<string, any>,
): string {
  const baseLabel = getActionLabel(action);

  // If no changes object, return action label
  if (!changes || !changes.after) {
    return baseLabel;
  }

  const before = changes.before || {};
  const after = changes.after || {};
  const changedFields = getChangedFields(before, after);

  if (changedFields.length === 0) {
    return baseLabel;
  }

  switch (resourceType) {
    case "product":
      return generateProductDescription(
        action,
        resourceName,
        after,
        changedFields,
      );

    case "category":
      return generateCategoryDescription(
        action,
        resourceName,
        after,
        changedFields,
      );

    case "order":
      return generateOrderDescription(
        action,
        resourceName,
        after,
        changedFields,
      );

    case "customer":
      return generateCustomerDescription(action, resourceName);

    case "admin":
      return generateAdminDescription(action, resourceName);

    default:
      return baseLabel;
  }
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    created_product: "Product Created",
    updated_product: "Product Updated",
    deleted_product: "Product Deleted",

    created_category: "Category Created",
    updated_category: "Category Updated",
    deleted_category: "Category Deleted",

    updated_order: "Order Status Changed",

    updated_customer: "Customer Updated",
    banned_customer: "Customer Banned",
    unbanned_customer: "Customer Unbanned",
    suspended_customer: "Customer Suspended",
    unsuspended_customer: "Customer Unsuspended",
    deleted_customer: "Customer Deleted",
    sent_customer_email: "Email Sent",

    created_admin_invite: "Admin Invite Created",
    accepted_admin_invite: "Admin Invite Accepted",
    suspended_admin: "Admin Suspended",
    unsuspended_admin: "Admin Unsuspended",
    updated_admin_profile: "Admin Profile Updated",
  };

  return labels[action] || action;
}

function getChangedFields(before: any, after: any): string[] {
  const changed: Set<string> = new Set();

  for (const key of Object.keys(after)) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.add(key);
    }
  }

  return Array.from(changed);
}

/* =====================================
   PRODUCT
===================================== */

function generateProductDescription(
  action: string,
  resourceName: string,
  after: any,
  changedFields: string[],
): string {
  switch (action) {
    case "created_product":
      return `Created product '${resourceName}'`;

    case "deleted_product":
      return `Deleted product '${resourceName}'`;

    case "updated_product": {
      const changes: string[] = [];

      if (changedFields.includes("name")) {
        changes.push(`name to '${after.name}'`);
      }

      if (changedFields.includes("price")) {
        changes.push(`pricing`);
      }

      if (changedFields.includes("stock")) {
        changes.push(`stock to ${after.stock}`);
      }

      if (changes.length === 0) {
        return `Updated product '${resourceName}'`;
      }

      return `Updated product '${resourceName}' ${changes.join(" and ")}`;
    }

    default:
      return `Updated product '${resourceName}'`;
  }
}

/* =====================================
   CATEGORY
===================================== */

function generateCategoryDescription(
  action: string,
  resourceName: string,
  after: any,
  changedFields: string[],
): string {
  switch (action) {
    case "created_category":
      return `Created category '${resourceName}'`;

    case "deleted_category":
      return `Deleted category '${resourceName}'`;

    case "updated_category": {
      const changes: string[] = [];

      if (changedFields.includes("name")) {
        changes.push(`name to '${after.name}'`);
      }

      if (changedFields.includes("description")) {
        changes.push(`description`);
      }

      if (changes.length === 0) {
        return `Updated category '${resourceName}'`;
      }

      return `Updated category '${resourceName}' ${changes.join(" and ")}`;
    }

    default:
      return `Updated category '${resourceName}'`;
  }
}

/* =====================================
   ORDER
===================================== */

function generateOrderDescription(
  action: string,
  resourceName: string,
  after: any,
  changedFields: string[],
): string {
  if (action === "updated_order" && changedFields.includes("status")) {
    return `Changed order #${resourceName} status to '${
      after.status || after.order_status || "Unknown"
    }'`;
  }

  return `Updated order #${resourceName}`;
}

/* =====================================
   CUSTOMER
===================================== */

function generateCustomerDescription(
  action: string,
  resourceName: string,
): string {
  switch (action) {
    case "banned_customer":
      return `Banned customer account for ${resourceName}`;

    case "unbanned_customer":
      return `Unbanned customer account for ${resourceName}`;

    case "suspended_customer":
      return `Suspended customer account for ${resourceName}`;

    case "unsuspended_customer":
      return `Unsuspended customer account for ${resourceName}`;

    case "deleted_customer":
      return `Deleted customer account for ${resourceName}`;

    case "sent_customer_email":
      return `Sent email to customer ${resourceName}`;

    case "updated_customer":
      return `Updated customer ${resourceName}`;

    default:
      return `Updated customer ${resourceName}`;
  }
}

/* =====================================
   ADMIN
===================================== */

function generateAdminDescription(
  action: string,
  resourceName: string,
): string {
  switch (action) {
    case "suspended_admin":
      return `Suspended admin ${resourceName}`;

    case "unsuspended_admin":
      return `Unsuspended admin ${resourceName}`;

    case "created_admin_invite":
      return `Created admin invite for ${resourceName}`;

    case "accepted_admin_invite":
      return `Accepted admin invite for ${resourceName}`;

    case "updated_admin_profile":
      return `Updated admin profile for ${resourceName}`;

    default:
      return `Updated admin ${resourceName}`;
  }
}
