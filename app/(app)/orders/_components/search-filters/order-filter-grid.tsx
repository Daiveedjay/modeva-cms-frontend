import { useSearchOrdersStore } from "@/app/(app)/orders/_hooks/use-search-order-store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus } from "@/lib/types/order";
import { formatNiceDate } from "@/lib/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";

export function OrderFilterGrid() {
  const {
    orderNumber,
    customer,
    email,
    status,
    useExactPrice,
    exactPrice,
    priceRange,
    dateRange,
    setOrderNumber,
    setCustomer,
    setEmail,
    setStatus,
    setUseExactPrice,
    setExactPrice,
    setPriceRange,
    setDateRange,
  } = useSearchOrdersStore();

  return (
    <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-3">
      {/* Order Number */}
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number</Label>
        <div className="relative">
          <Input
            id="orderNumber"
            placeholder="Search by Order ID..."
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          {orderNumber && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setOrderNumber("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear order number">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Clear order number
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Supports partial match.</p>
      </div>

      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="customer">Customer Name</Label>
        <div className="relative">
          <Input
            id="customer"
            placeholder="Search by customer name..."
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          {customer && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setCustomer("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear customer name">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Clear customer name
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Supports partial match.</p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            placeholder="Search by email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear email">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Clear email
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Supports partial match.</p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="relative">
          <Select
            value={status}
            onValueChange={(v: OrderStatus) => setStatus(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {status !== "all" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setStatus("all")}
                    className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear status">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Clear status
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Exact match.</p>
      </div>

      {/* Date Range Picker */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Date Range
        </Label>

        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span>
                      {formatNiceDate(dateRange.from)} -{" "}
                      {formatNiceDate(dateRange.to)}
                    </span>
                  ) : (
                    <span>From {formatNiceDate(dateRange.from)}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">
                    Pick a date range
                  </span>
                )}
              </Button>

              {(dateRange?.from || dateRange?.to) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange(undefined);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                        aria-label="Clear date range">
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      Clear date range
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <div className="border-b p-3">
              <p className="text-sm font-medium">Filter by created date</p>
              <p className="text-xs text-muted-foreground">
                Select a start and end date.
              </p>
            </div>

            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={dateRange}
              onSelect={setDateRange}
            />

            <div className="flex items-center justify-between gap-2 border-t p-3">
              <Button variant="ghost" onClick={() => setDateRange(undefined)}>
                Clear
              </Button>
              <div className="text-xs text-muted-foreground">
                Sends: created_from / created_to
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <p className="text-xs text-muted-foreground">
          Uses YYYY-MM-DD. Backend also accepts RFC3339.
        </p>
      </div>

      {/* Price Type */}
      <div className="space-y-2">
        <Label>Price Type</Label>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant={useExactPrice ? "default" : "outline"}
            size="sm"
            onClick={() => setUseExactPrice(true)}>
            Exact
          </Button>
          <Button
            type="button"
            variant={!useExactPrice ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setUseExactPrice(false);
              setExactPrice(undefined);
            }}>
            Range
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Select price type.</p>
      </div>

      {/* Exact Price */}
      {useExactPrice && (
        <div className="space-y-2">
          <Label htmlFor="exact-price">Amount ($)</Label>
          <div className="relative">
            <Input
              id="exact-price"
              type="number"
              placeholder="0"
              value={exactPrice || ""}
              onChange={(e) =>
                setExactPrice(Number(e.target.value) || undefined)
              }
              min="0"
            />
            {exactPrice !== undefined && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setExactPrice(undefined)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear price">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Clear price
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Sends: price</p>
        </div>
      )}

      {/* Price Range Min */}
      {!useExactPrice && (
        <div className="space-y-2">
          <Label htmlFor="price-min">Min ($)</Label>
          <div className="relative">
            <Input
              id="price-min"
              type="number"
              placeholder="0"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value) || 0, priceRange[1]])
              }
              min="0"
            />
            {priceRange[0] > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setPriceRange([0, priceRange[1]])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear min price">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Clear min
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Sends: min_price</p>
        </div>
      )}

      {/* Price Range Max */}
      {!useExactPrice && (
        <div className="space-y-2">
          <Label htmlFor="price-max">Max ($)</Label>
          <div className="relative">
            <Input
              id="price-max"
              type="number"
              placeholder="10000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value) || 10000])
              }
              min="0"
            />
            {priceRange[1] < 10000 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setPriceRange([priceRange[0], 10000])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear max price">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Clear max
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Sends: max_price</p>
        </div>
      )}
    </div>
  );
}
