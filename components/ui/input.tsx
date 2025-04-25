import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border-2 border-sage-800 bg-sage-50 px-3 py-2 text-sm font-mono text-sage-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-mono placeholder:text-sage-600 focus-visible:outline-none focus-visible:border-terracotta-500 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
