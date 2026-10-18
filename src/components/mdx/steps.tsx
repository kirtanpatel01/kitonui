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
        "my-8 ml-3.5 border-y-0 border-r-0 border-l-2 border-border/60 pl-6 [counter-reset:step]",
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
        "relative pb-8 last:pb-2 border-none [counter-increment:step]",
        "before:absolute before:-left-[39px] before:top-0 before:flex before:size-7 before:items-center before:justify-center before:rounded-full before:border before:border-primary/40 before:bg-background before:font-mono before:text-xs before:font-bold before:text-primary before:content-[counter(step)]",
        "[&>h3:first-child]:mt-0 [&>h3:first-child]:pt-0 [&>h3:first-child]:leading-7",
        "[&>h4:first-child]:mt-0 [&>h4:first-child]:pt-0 [&>h4:first-child]:leading-7",
        "[&>p]:my-2",
        "[&>div]:my-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
