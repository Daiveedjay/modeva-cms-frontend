"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";

import { MapPin, Package } from "lucide-react";

import { useGetOrderById } from "@/app/_queries/orders/get-order-by-id";
import { DateDisplay } from "@/components/reuseables/date-display";
import { getStatusIcon } from "@/components/reuseables/get-status-icon";
import { Badge } from "@/components/ui/badge";
import {
  calcShipping,
  calcSubTotal,
  calcTax,
  getOrderStatusVariant,
} from "@/lib/utils";
import Image from "next/image";
import {
  OrderAddressDetails,
  OrderDetails,
  OrderItemDetails,
} from "@/lib/types/order";

export function ViewOrderDetailsModal() {
  const orderModal = useOrderModalStore((s) => s.orderModal);
  const closeOrderModal = useOrderModalStore((s) => s.closeOrderModal);

  const open =
    !!orderModal?.orderId && orderModal.type === "view-order-details";
  const order = orderModal?.orderId ?? null;

  const orderId = orderModal?.orderId ?? "";
  const { data, isError, isLoading, error } = useGetOrderById(orderId, {
    enabled: open,
  });

  const orderData = data?.data;

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="p-4">Error loading order details: {error.message}</div>
    );
  }

  if (orderData === null || orderData === undefined) {
    return null;
  }

  // guard AFTER hooks
  if (!open || !order) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeOrderModal();
      }}>
      <DialogContent
        key={orderData?.id}
        className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order details — {orderData?.order_number}
          </DialogTitle>
          <DialogDescription>
            Complete information about this order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <OrderStatusSection
            status={orderData?.status}
            date={orderData?.created_at}
          />
          <Separator />
          <CustomerInfoSection
            customer_name={orderData?.customer_name}
            email={orderData?.customer_email}
          />
          <Separator />
          <OrderItemsSection items={orderData?.items} />
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddressSection
              title="Shipping address"
              icon={<MapPin className="h-4 w-4" />}
              address={orderData?.address}
            />
          </div>
          <Separator />
          <PaymentShippingSection
            payment_method_label={orderData?.payment_method_label}
          />
          <Separator />
          <OrderTotalsSection orderItems={orderData.items} />
          <Separator />
          {orderData.customer_notes && (
            <NotesSection notes={orderData.customer_notes} />
          )}
          {/* <NotesSection notes={orderData?.customer_notes} /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OrderStatusSectionProps {
  status: OrderItemDetails["status"];
  date: OrderItemDetails["created_at"];
}

export const OrderStatusSection: React.FC<OrderStatusSectionProps> = ({
  status,
  date,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div>
      <h4 className="font-semibold mb-2">Order status</h4>
      <Badge
        variant={getOrderStatusVariant(status)}
        className="flex capitalize items-center gap-1 w-fit">
        {getStatusIcon(status)}
        {status}
      </Badge>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Order date</h4>
      <p className="text-sm text-muted-foreground">
        <DateDisplay date={date} />
      </p>
    </div>
  </div>
);

interface CustomerInfoSectionProps {
  customer_name: string;
  email: string;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customer_name,
  email,
}) => (
  <div>
    <h4 className="font-semibold mb-3">Customer information</h4>
    <div className="space-y-2">
      <p>
        <span className="font-medium">Name:</span> {customer_name}
      </p>
      <p>
        <span className="font-medium">Email:</span> {email}
      </p>
    </div>
  </div>
);

export const OrderItemsSection = ({
  items,
}: {
  items: OrderItemDetails[] | undefined;
}) => (
  <div>
    <h4 className="font-semibold mb-3">Order items</h4>
    <div className="space-y-3">
      {items?.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 border rounded-lg">
          <Image
            src={item.product_image || "/David.webp"}
            alt={item.product_name}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{item.product_name}</p>
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity}
            </p>
          </div>
          <p className="font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

interface AddressSectionProps {
  title: string;
  address?: OrderAddressDetails;
  icon: React.ReactNode;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  title,
  address,
  icon,
}) => (
  <div>
    <h4 className="font-semibold mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h4>
    <div className="text-sm space-y-1">
      <p>{address?.street}</p>
      <p>
        {address?.city}, {address?.state} {address?.zip}
      </p>
      <p>{address?.country}</p>
    </div>
  </div>
);

interface PaymentShippingProps {
  payment_method_label: OrderDetails["payment_method_label"];
}

export const PaymentShippingSection: React.FC<PaymentShippingProps> = ({
  payment_method_label,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-semibold mb-2">Payment method</h4>
      <p className="text-sm">{payment_method_label}</p>
      {/* <p className="text-sm">{payment_method_type}</p>
      <p className="text-sm">{payment_method_last4}</p> */}
    </div>
  </div>
);

export const OrderTotalsSection = ({
  orderItems,
}: {
  orderItems: OrderItemDetails[] | undefined;
}) => {
  const subTotal = calcSubTotal(orderItems || []);
  const shipping = calcShipping(subTotal);
  const tax = calcTax(shipping);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${subTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping:</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax:</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div>
        <hr />
      </div>
      <div className="flex justify-between font-semibold text-lg">
        <span>Total:</span>
        <span>${(subTotal + shipping + tax).toFixed(2)}</span>
      </div>
    </div>
  );
};

interface NotesSectionProps {
  notes?: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => (
  <div>
    <h4 className="font-semibold mb-2">Order notes</h4>
    <p className="text-sm text-muted-foreground">{notes}</p>
  </div>
);
