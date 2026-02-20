import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { ChangeEvent } from "react";

export interface SearchBarProps {
  /** callback invoked with the current query on each change */
  // onSearch: (query: string) => void;
  /** placeholder text for the input */
  placeholder?: string;
  query?: string;
  setQuery?: (query: string) => void;
  /** additional wrapper class names */
  className?: string;
  onFocus?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onFocus,
  setQuery,
  query,
  placeholder = "Search...",
  className = "",
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery?.(value);
  };

  return (
    <div className={`relative flex-1 max-w-sm ${className}`}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        onFocus={onFocus}
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
};
