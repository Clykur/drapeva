import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-foreground cursor-pointer font-medium",
          className,
        )}
        {...props}
      />
    );
  },
);
Select.displayName = "Select";
