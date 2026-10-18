import * as React from "react"
import { cn } from "@/lib/utils"
import { InfoIcon, AlertTriangleIcon, CheckCircle2Icon } from "lucide-react"

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "default" | "warning" | "success" | "info"
  title?: string
  children: React.ReactNode
}

export function Callout({
  children,
  type = "default",
  title,
  className,
  ...props
}: CalloutProps) {
  const icons = {
    default: <InfoIcon className="h-4 w-4 text-foreground/80 shrink-0" />,
    info: <InfoIcon className="h-4 w-4 text-cyan-500 shrink-0" />,
    warning: <AlertTriangleIcon className="h-4 w-4 text-amber-500 shrink-0" />,
    success: <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0" />,
  }

  const borderColors = {
    default: "border-border/60 bg-muted/30 text-foreground",
    info: "border-cyan-500/20 bg-cyan-500/10 text-foreground",
    warning: "border-amber-500/20 bg-amber-500/10 text-foreground",
    success: "border-emerald-500/20 bg-emerald-500/10 text-foreground",
  }

  return (
    <div
      className={cn(
        "my-4 flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed",
        borderColors[type],
        className
      )}
      {...props}
    >
      {icons[type]}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold text-foreground">{title}</h5>}
        <div className="text-muted-foreground [&>p]:leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
