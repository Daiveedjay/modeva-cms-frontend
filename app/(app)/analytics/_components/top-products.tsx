"use client";

import { useGetTopProducts } from "@/app/_queries/analytics/get-top-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductModalStore } from "@/lib/store/product/use-product-modal-store";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, ChevronRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { MonthlyRevenueChart } from "./monthly-revenue-chart";

export default function TopProducts() {
  const { data, isLoading } = useGetTopProducts();
  const topProducts = data?.data;

  const router = useRouter();

  const openProductModal = useProductModalStore(
    (store) => store.openProductModal,
  );

  if (isLoading) {
    return <TopProductsSkeleton />;
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products`);
    openProductModal({
      type: "view-product",
      product_id: productId,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topProducts?.map((product, index) => (
              <div
                key={product.product_id}
                onClick={() => handleProductClick(product.product_id)}
                className="group flex items-center justify-between rounded-sm p-2 hover:bg-muted hover:cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales_count} sales
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      {formatCurrency(product.revenue)}
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        product.revenue_percent > 0
                          ? "text-green-500"
                          : "text-destructive"
                      }`}>
                      {product.revenue_percent > 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(product.revenue_percent).toFixed(2)}%
                    </p>
                  </div>

                  <span
                    className="opacity-0 translate-x-1
                    transition-all duration-200 ease-out
                    group-hover:opacity-100 group-hover:translate-x-0">
                    <ChevronRightCircle className="text-muted-foreground h-5 w-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Financials</CardTitle>
          <CardDescription>When are you making the most money</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyRevenueChart />
        </CardContent>
      </Card>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function TopProductsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Top products list */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <TopProductRowSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly chart */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

function TopProductRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-sm p-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
