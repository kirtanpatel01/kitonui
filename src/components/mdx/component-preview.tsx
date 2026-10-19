"use client"

import * as React from "react"
import { cn } from "cn"
import { CodePreview } from "@/components/code-preview"
import {
  getRegistryComponentCode,
  getRegistryExampleCode,
  getRegistryExampleComponent,
} from "@/lib/registry"

export interface ComponentPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  align?: "center" | "start" | "end"
  transitionDuration?: number
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  transitionDuration,
  ...props
}: ComponentPreviewProps) {
  const ExampleComponent = getRegistryExampleComponent(name)
  const code = getRegistryExampleCode(name) || getRegistryComponentCode(name)

  return (
    <div className={cn("group relative my-6 w-full", className)} {...props}>
      <CodePreview
        componentName={name}
        code={code}
        transitionDuration={transitionDuration}
        preview={
          ExampleComponent ? (
            <React.Suspense
              fallback={
                <div className="flex h-72 w-full items-center justify-center text-sm text-muted-foreground">
                  <span className="animate-pulse">Loading preview...</span>
                </div>
              }
            >
              <ExampleComponent />
            </React.Suspense>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Example <code className="font-mono text-primary">{name}</code> not found in <code>registry/examples</code>.
            </div>
          )
        }
      />
    </div>
  )
}
