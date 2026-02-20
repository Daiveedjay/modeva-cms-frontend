"use client";

import { DateDisplay } from "@/components/reuseables/date-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderModalStore } from "@/lib/store/orders/use-orders-modals-store";
import { AlertCircle, Download, Mail, Package } from "lucide-react";
import React from "react";

import { useDownloadOrderInvoicePDF } from "@/app/_queries/orders/download-order-invoice-pdf";
import { useGetOrderById } from "@/app/_queries/orders/get-order-by-id";
import { useSendOrderInvoicePDF } from "@/app/_queries/orders/send-order-invoice-pdf";
import { OrderDetails, OrderItemDetails } from "@/lib/types/order";

import { Spinner } from "@/components/reuseables/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDelayedLoading } from "@/hooks/use-delayed-loading";
import { toastError, toastSuccess } from "@/lib/utils";

export function ManageInvoiceModal() {
  const orderModal = useOrderModalStore((s) => s.orderModal);
  const closeOrderModal = useOrderModalStore((s) => s.closeOrderModal);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const open =
    !!orderModal?.orderId && orderModal.type === "manage-order-invoice";
  const orderId = orderModal?.orderId ?? "";

  const { data, isLoading, isError, error } = useGetOrderById(orderId, {
    enabled: open,
  });
  const order = data?.data;

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useSendOrderInvoicePDF();

  const { mutateAsync: downloadInvoice, isPending: isDownloading } =
    useDownloadOrderInvoicePDF();

  const shouldShowLoading = useDelayedLoading(isLoading);

  if (!open) return null;
  if (isLoading && !shouldShowLoading) return null;

  if (isLoading && shouldShowLoading) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && closeOrderModal()}>
        <DialogContent className="flex items-center justify-center min-h-50">
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-sm text-muted-foreground">
              Loading invoice details...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !order) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && closeOrderModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Failed to load invoice</DialogTitle>
            <DialogDescription>
              {error?.message ||
                "Could not load order details. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
          <Button
            onClick={closeOrderModal}
            variant="outline"
            className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSendEmailPDF = async () => {
    try {
      await sendEmail(orderId);
      toastSuccess("Invoice email sent to customer");
    } catch {
      // API hook handles toast error
    }
  };

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;

    if (!element) {
      toastError("Could not find invoice content");
      return;
    }

    try {
      await downloadInvoice({
        orderNumber: order.order_number,
        orderId: order.id,
        invoiceElement: element,
      });
      toastSuccess("Invoice downloaded successfully");
    } catch {
      // Hook toast error already shown
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeOrderModal()}>
      <DialogContent
        key={order.id}
        className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice - {order.order_number}</DialogTitle>
          <DialogDescription>
            Generate and manage invoice for order {order.order_number}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={invoiceRef}
          className="space-y-6 p-6 border rounded-lg bg-white text-black print:shadow-none print:border-none">
          <InvoiceHeaderSection order={order} />
          <InvoiceDetailsSection order={order} />
          <InvoiceItemsTable items={order.items ?? []} />
          <InvoiceTotalsSection order={order} />
        </div>

        <DialogFooter>
          <InvoiceActionsSection
            onClose={closeOrderModal}
            onEmail={handleSendEmailPDF}
            onDownload={handleDownloadPDF}
            isEmailLoading={isSendingEmail}
            isDownloadLoading={isDownloading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const InvoiceHeaderSection = ({ order }: { order: OrderDetails }) => (
  <>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-2xl font-bold text-blue-primary">Modeva Store</h2>
        <div className="text-sm text-gray-600 mt-2">
          <p>{order.address?.street}</p>
          <p>
            {order.address?.city}
            {order.address?.state ? `, ${order.address.state}` : ""}{" "}
            {order.address?.zip}
          </p>
          <p>{order.address?.country}</p>
          <p>frontdesk@modeva.com</p>
        </div>
      </div>

      <div className="text-right">
        <h3 className="text-xl font-bold flex items-center gap-2 justify-end">
          <Package className="h-5 w-5" /> INVOICE
        </h3>
        <p className="text-sm text-gray-600"># {order.order_number}</p>
      </div>
    </div>
    <Separator className="bg-muted-foreground mb-6" />
  </>
);

export const InvoiceDetailsSection = ({ order }: { order: OrderDetails }) => (
  <div className="grid grid-cols-2 gap-6 mb-6">
    <div>
      <h4 className="font-semibold mb-2">Bill To:</h4>
      <div className="text-sm">
        <p className="font-medium">{order.customer_name}</p>
        <p>{order.customer_email}</p>

        <p>{order.address?.street}</p>
        <p>
          {order.address?.city}
          {order.address?.state ? `, ${order.address.state}` : ""}
        </p>
      </div>
    </div>

    <div className="text-right text-sm">
      <p>
        <span className="font-medium">Invoice Date:</span>{" "}
        <DateDisplay date={order.created_at} />
      </p>
      <p>
        <span className="font-medium">Due Date:</span>{" "}
        <DateDisplay date={order.created_at} />
      </p>
      <p>
        <span className="font-medium">Order number:</span> {order.order_number}
      </p>
    </div>
  </div>
);

export const InvoiceItemsTable = ({ items }: { items: OrderItemDetails[] }) => (
  <Table>
    <TableHeader>
      <TableRow className="border-muted-foreground hover:bg-foreground">
        <TableHead className="text-secondary font-semibold">
          Description
        </TableHead>
        <TableHead className="text-center text-secondary font-semibold">
          Qty
        </TableHead>
        <TableHead className="text-right text-secondary font-semibold">
          Price
        </TableHead>
        <TableHead className="text-right text-secondary font-semibold">
          Total
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {items.map((item) => (
        <TableRow
          key={item.id}
          className="border-b border-muted-foreground hover:bg-foreground">
          <TableCell>{item.product_name}</TableCell>
          <TableCell className="text-center">{item.quantity}</TableCell>
          <TableCell className="text-right">
            ${Number(item.price).toFixed(2)}
          </TableCell>
          <TableCell className="text-right">
            ${Number(item.subtotal).toFixed(2)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const InvoiceTotalsSection = ({ order }: { order: OrderDetails }) => {
  const subTotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping_cost ?? 0);
  const tax = Number(order.tax ?? 0);
  const discount = Number(order.discount ?? 0);
  const total = Number(
    order.total_amount ?? subTotal + shipping + tax - discount,
  );

  return (
    <div className="flex justify-end mt-6">
      <div className="w-64 space-y-2">
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

        {discount > 0 && (
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <Separator className="bg-muted-foreground" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

interface InvoiceActionsSectionProps {
  onClose: () => void;
  onEmail: () => void;
  onDownload: () => void;
  isEmailLoading?: boolean;
  isDownloadLoading?: boolean;
}

export const InvoiceActionsSection: React.FC<InvoiceActionsSectionProps> = ({
  onClose,
  onEmail,
  onDownload,
  isEmailLoading = false,
  isDownloadLoading = false,
}) => (
  <div className="flex gap-2 pt-4">
    <Button variant="destructive" onClick={onClose}>
      Close
    </Button>
    <Button variant="outline" onClick={onEmail} disabled={isEmailLoading}>
      {isEmailLoading && <Spinner />}
      <Mail className="mr-2 h-4 w-4" />
      {isEmailLoading ? "Sending..." : "Email"}
    </Button>
    <Button variant="outline" onClick={onDownload} disabled={isDownloadLoading}>
      {isDownloadLoading && <Spinner />}
      <Download className="mr-2 h-4 w-4" />
      {isDownloadLoading ? "Downloading..." : "Download"}
    </Button>
  </div>
);
