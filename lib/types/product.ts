
export interface ProductMediaFile {
  file: File | null;
  url: string;
  order?: number;
}

export interface ProductMedia {
  primary: ProductMediaFile;
  other: ProductMediaFile[];
}

export interface ProductSeo {
  seo_title: string;
  seo_description: string;
}

export interface ProductVariant {
  type: string;
  options: string[];
}

export interface ProductInventoryField {
  combo: string[];
  variant_name: string;
  quantity: number;
}

export type ProductInventory = ProductInventoryField[];

export type ProductInput = {
  name: string;
  description: string;
  composition: { label: string; content: string }[];
  price: number;
  sub_category_id: string;
  status: string;
  tags: string[];
  media: ProductMedia;
  variants: ProductVariant[];
  inventory: ProductInventory;
  seo: ProductSeo;
};

export type ProductStats = {
  type: string;
  total_products: number;
  active_products: number;
  draft_products: number;
  percentage_active: number;
  average_price: number;
  total_inventory: number;
  tagged_products: number;
  low_stock_products: number;
  percentage_low_stock: number;
};


export interface SearchProductsParams {
  page: number;
  limit: number;
  query: string;
}
