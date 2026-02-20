import {
  SearchCustomersStore,
  useSearchCustomersStore,
} from "@/app/(app)/customers/_hooks/use-search-customers-store";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar as CalendarIcon, X } from "lucide-react";
import { formatNiceDate } from "@/lib/utils";

export function CustomerFilterGrid() {
  const {
    name,
    email,
    country,
    status,
    useDateRange,
    dateRange,
    exactJoinedDate,
    useExactSpending,
    exactSpending,
    spendingRange,
    setName,
    setEmail,
    setCountry,
    setStatus,
    setUseDateRange,
    setDateRange,
    setExactJoinedDate,
    setUseExactSpending,
    setExactSpending,
    setSpendingRange,
  } = useSearchCustomersStore();

  return (
    <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-3">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative">
          <Input
            id="name"
            placeholder="Search by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {name && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setName("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear name">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Clear name
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

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <div className="relative">
          <Input
            id="country"
            placeholder="e.g., United States"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {country && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setCountry("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                    aria-label="Clear country">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Clear country
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
            onValueChange={(v: SearchCustomersStore["status"]) => setStatus(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
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

      {/* Joined Date Type */}
      <div className="space-y-2">
        <Label>Joined Date</Label>
        <div className="relative">
          <Select
            value={useDateRange ? "range" : "exact"}
            onValueChange={(v) => setUseDateRange(v === "range")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="range">Date Range</SelectItem>
              <SelectItem value="exact">Exact Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">Filter by join date.</p>
      </div>

      {/* Date Range Picker */}
      {useDateRange && (
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
                  {dateRange.from ? (
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

                {(dateRange.from || dateRange.to) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDateRange(undefined, undefined);
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
                <p className="text-sm font-medium">Filter by joined date</p>
                <p className="text-xs text-muted-foreground">
                  Select a start and end date.
                </p>
              </div>

              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange(range?.from, range?.to)}
              />

              <div className="flex items-center justify-between gap-2 border-t p-3">
                <Button
                  variant="ghost"
                  onClick={() => setDateRange(undefined, undefined)}>
                  Clear
                </Button>
                <div className="text-xs text-muted-foreground">
                  Sends: joined_from / joined_to
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <p className="text-xs text-muted-foreground">
            Uses YYYY-MM-DD. Backend also accepts RFC3339.
          </p>
        </div>
      )}

      {/* Exact Joined Date */}
      {!useDateRange && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Joined On
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exactJoinedDate ? (
                    <span>{formatNiceDate(exactJoinedDate)}</span>
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>

                {exactJoinedDate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExactJoinedDate(undefined);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                          aria-label="Clear date">
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="text-xs">
                        Clear date
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <div className="border-b p-3">
                <p className="text-sm font-medium">
                  Filter by exact joined date
                </p>
              </div>

              <Calendar
                mode="single"
                selected={exactJoinedDate}
                onSelect={setExactJoinedDate}
              />

              <div className="flex items-center justify-between gap-2 border-t p-3">
                <Button
                  variant="ghost"
                  onClick={() => setExactJoinedDate(undefined)}>
                  Clear
                </Button>
                <div className="text-xs text-muted-foreground">
                  Sends: joined_from
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <p className="text-xs text-muted-foreground">
            Uses YYYY-MM-DD. Backend also accepts RFC3339.
          </p>
        </div>
      )}

      {/* Spending Type */}
      <div className="space-y-2">
        <Label>Spending Type</Label>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant={useExactSpending ? "default" : "outline"}
            size="sm"
            onClick={() => setUseExactSpending(true)}>
            Exact
          </Button>
          <Button
            type="button"
            variant={!useExactSpending ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setUseExactSpending(false);
              setExactSpending(0);
            }}>
            Range
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Select spending type.</p>
      </div>

      {/* Exact Spending */}
      {useExactSpending && (
        <div className="space-y-2">
          <Label htmlFor="exact-spending">Amount ($)</Label>
          <div className="relative">
            <Input
              id="exact-spending"
              type="number"
              placeholder="0"
              value={exactSpending || ""}
              onChange={(e) => setExactSpending(Number(e.target.value) || 0)}
              min="0"
            />
            {exactSpending > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setExactSpending(0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear spending">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">
                    Clear spending
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Sends: spending_exact</p>
        </div>
      )}

      {/* Spending Range Min */}
      {!useExactSpending && (
        <div className="space-y-2">
          <Label htmlFor="spending-min">Min ($)</Label>
          <div className="relative">
            <Input
              id="spending-min"
              type="number"
              placeholder="0"
              value={spendingRange[0]}
              onChange={(e) =>
                setSpendingRange(Number(e.target.value) || 0, spendingRange[1])
              }
              min="0"
            />
            {spendingRange[0] > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setSpendingRange(0, spendingRange[1])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear min spending">
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
          <p className="text-xs text-muted-foreground">Sends: spending_min</p>
        </div>
      )}

      {/* Spending Range Max */}
      {!useExactSpending && (
        <div className="space-y-2">
          <Label htmlFor="spending-max">Max ($)</Label>
          <div className="relative">
            <Input
              id="spending-max"
              type="number"
              placeholder="10000000"
              value={spendingRange[1]}
              onChange={(e) =>
                setSpendingRange(
                  spendingRange[0],
                  Number(e.target.value) || 10000000,
                )
              }
              min="0"
            />
            {spendingRange[1] < 10000000 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() =>
                        setSpendingRange(spendingRange[0], 10000000)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                      aria-label="Clear max spending">
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
          <p className="text-xs text-muted-foreground">Sends: spending_max</p>
        </div>
      )}
    </div>
  );
}
