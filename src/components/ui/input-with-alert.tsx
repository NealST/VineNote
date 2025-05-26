import * as React from "react";

import { cn } from "@/lib/utils";

interface IProps extends React.ComponentProps<"input"> {
  alertTip: string;
}

function InputWithAlert({ className, type, ...props }: IProps) {
  const alertTip = props.alertTip;
  const hasAlert = !!alertTip;

  return (
    <div>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          hasAlert
            ? "focus-visible:border-destructive focus-visible:ring-destructive/50 focus-visible:ring-0"
            : "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-0",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {<p className="text-destructive mt-1" style={{fontSize: "12px"}}>{alertTip}</p>}
    </div>
  );
}

export { InputWithAlert };
