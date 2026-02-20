/* =====================================
 * Value types
 * ===================================== */

export type CategoryStatus = "Active" | "Inactive";
export type DeleteCategoryMode = "cascade" | "reassign";

/* =====================================
 * Requests / inputs
 * ===================================== */

export interface CreateCategoryInput {
  name: string;
  description: string;
  parent_id?: string | null;
}

export interface UpdateCategoryInput {
  name: string;
  description: string;
  parent_id?: string | null;
}

export interface ToggleCategoryStatusInput {
  status: CategoryStatus;
}

export interface Reassignment {
  child_id: string;
  new_parent_id: string;
}

export interface DeleteCategoryWithOptionsRequest {
  mode: DeleteCategoryMode;
  reassignments?: Reassignment[];
}

/* =====================================
 * Domain models
 * ===================================== */

export interface Category {
  id: string;
  name: string;
  description: string;
  products: number;
  status: CategoryStatus;
  parent_name: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface SubCategoryResponse {
  id: string;
  name: string;
  category_path: string;
  description: string;
  status: CategoryStatus;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  products: number;
}

/* =====================================
 * Analytics / stats
 * ===================================== */
export interface CategoryStats {
  total_categories: number;
  parent_categories: number;
  sub_categories: number;
  active_categories: number;
  active_parent_categories: number;
  active_sub_categories: number;
  percentage_active_categories: number;
  percentage_active_parents: number;
  percentage_active_sub_categories: number;
};

/* =====================================
 * Search
 * ===================================== */

export interface SearchCategoriesParams {
  page: number;
  limit: number;
  query: string;
}
