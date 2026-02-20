// import { orders as initialOrders } from "@/lib/constants";
// import { OrderStatus } from "@/lib/utils";
// import { create } from "zustand";

// export interface OrderItem {
//   id: string;
//   name: string;
//   quantity: number;
//   price: number;
//   image: string;
// }

// export interface AddressData {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// export interface Order {
//   // primary key and headline fields
//   id: string;
//   status: OrderStatus;
//   date: Date | string;
//   total: string;

//   // customer info
//   customerName: string;
//   email: string;

//   // payment & logistics
//   paymentMethod?: string;
//   // trackingNumber?: string;

//   // grouped or less-frequent data
//   orderItems?: OrderItem[];
//   shippingAddress?: AddressData;
//   billingAddress?: AddressData;

//   // optional metadata
//   notes?: string;
//   cancellationReason?: string;
// }

// /** only these three fields can be updated */
// export interface OrderUpdate {
//   status?: OrderStatus;
//   notes?: string;
//   cancellationReason?: string;
// }

// interface OrdersStore {
//   orders: Order[];
//   setOrders: (orders: Order[]) => void;
//   updateOrderInList: (id: string, updates: OrderUpdate) => void;
// }

// export const useOrdersStore = create<OrdersStore>((set) => ({
//   orders: initialOrders,

//   setOrders: (orders) => set({ orders }),

//   // update only status, notes or cancellationReason on one order
//   updateOrderInList: (id, updates) =>
//     set((state) => ({
//       orders: state.orders.map((o) =>
//         o.id === id
//           ? {
//               ...o,
//               status: updates.status ?? o.status,
//               notes: updates.notes ?? o.notes,
//               cancellationReason:
//                 updates.cancellationReason ?? o.cancellationReason,
//             }
//           : o
//       ),
//     })),
// }));
