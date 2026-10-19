import * as React from "react"
import { cn } from "cn"
import { CodeBlock } from "@/components/code-block"
import { getRegistryComponentCode } from "@/lib/registry"

export interface ComponentSourceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  src?: string
  title?: string
}

export function ComponentSource({
  name,
  src,
  title,
  className,
  ...props
}: ComponentSourceProps) {
  const compName =
    name ?? (src ? src.split("/").pop()?.replace(/\.tsx?$/, "") : undefined)
  const code = compName ? getRegistryComponentCode(compName) : ""
  const displayPath =
    title ?? src ?? (compName ? `components/ui/${compName}.tsx` : "code")

  if (!code && compName) {
    return (
      <div className="my-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Component source for <code className="font-mono font-semibold">{compName}</code> not found in <code>registry/components</code>.
      </div>
    )
  }

  return (
    <CodeBlock
      componentName={compName}
      path={displayPath}
      className={cn("my-4", className)}
      {...props}
    />
  )
}
