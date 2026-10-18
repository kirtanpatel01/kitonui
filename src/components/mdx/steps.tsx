import * as React from "react"
import { cn } from "@/lib/utils"

export function Steps({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "my-6 ml-4 border-l-2 border-border/60 pl-6 [counter-reset:step] space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Step({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative [counter-increment:step] before:absolute before:-left-[35px] before:top-0 before:flex before:h-7 before:w-7 before:items-center before:justify-center before:rounded-full before:border before:border-primary/40 before:bg-background before:text-xs before:font-bold before:text-primary before:content-[counter(step)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
