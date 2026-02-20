import { Order } from "@/lib/types/order";

export interface CustomerOrdersView {
  customerDetails: {
    id: string;
    firstName: string;
    lastName: string;
    joinDate: Date | string;
  };
  customerOrders: Order[];

  customerInsights: {
    favouriteProducts: string[];
    mostRecentOrder: Date | string;
    averageOrderValue: string;
  };
}

// interface CustomerOrdersViewStore {
//   customerOrderView: CustomerOrdersView;
// }

// export const useCustomerOrdersView = create<CustomerOrdersViewStore>(() => ({
//   customerOrderView: {},
// }));
