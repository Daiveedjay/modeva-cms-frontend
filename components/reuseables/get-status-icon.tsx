import { OrderStatus } from "@/lib/types/order";
import { CheckCircle, CircleDashed, CircleX, Clock, Truck } from "lucide-react";
import { JSX } from "react";

export const getStatusIcon = (status: OrderStatus): JSX.Element => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "processing":
      return <Clock className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "cancelled":
      return <CircleX className="h-4 w-4" />;
    case "pending":
      return <CircleDashed className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};
