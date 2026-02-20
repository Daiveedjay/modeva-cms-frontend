
import CustomerActions from "@/app/(app)/customers/_components/customer-actions";
import { DateDisplay } from "@/components/reuseables/date-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { CustomerListItem } from "@/lib/types/customer";
import { getActivityVariant, getCustomerStatusVariant } from "@/lib/utils";

export default function CustomerRow({ customer }: { customer: CustomerListItem }) {
  return (
    <TableRow key={customer.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={customer.avatar || "/David.webp"}
              alt={customer.name}
            />
            <AvatarFallback>{customer.name}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-muted-foreground">
              {customer.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{customer.location}</TableCell>
      <TableCell>
        <Badge
          variant={getActivityVariant(customer.activity)}
          className="flex items-center capitalize gap-1 w-fit"
        >
          {" "}
          {customer.activity}
        </Badge>{" "}
      </TableCell>
      <TableCell>{customer.orders}</TableCell>
      <TableCell className="font-medium">
        ${Number(customer.total_spent ?? 0).toLocaleString("en-US")}{" "}
      </TableCell>
      <TableCell>
        <Badge
          variant={getCustomerStatusVariant(customer.status)}
          className="flex items-center capitalize gap-1 w-fit"
        >
          {customer.status}
        </Badge>
      </TableCell>
      <TableCell>
        <DateDisplay date={customer.join_date} />
      </TableCell>
      <TableCell>
        <CustomerActions customer={customer} />
      </TableCell>
    </TableRow>
  );
}
