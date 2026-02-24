export const Spinner = ({ width = 4, height = 4, className = "" }) => (
  <div className="flex items-center justify-center w-full h-full">
    <div
      className={`animate-spin rounded-full border-4 border-t-4 border-popover-foreground border-t-secondary w-${width} h-${height} ${className}`}></div>
  </div>
);
