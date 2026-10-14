import * as React from "react"
import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "cn"

import { useTheme } from "@/components/theme-provider"

// Automatically import all raw TSX code from registry/components
const REGISTRY_COMPONENTS = import.meta.glob<string>(
  "../../registry/components/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

function getRegistryComponentCode(name: string): string {
  // Try exact file name or with .tsx extension
  const cleanName = name.replace(/\.tsx$/, "")
  for (const [path, code] of Object.entries(REGISTRY_COMPONENTS)) {
    if (path.endsWith(`/${cleanName}.tsx`)) {
      return code
    }
  }
  return ""
}

export interface CodePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The rendered component to preview */
  preview?: React.ReactNode
  /** Alternatively pass children as the preview */
  children?: React.ReactNode
  /** Name of the component in registry/components (e.g. "image-loader" or "image-loader.tsx") */
  componentName?: string
  /** Custom raw code string if not loading from registry */
  code?: string
  defaultTab?: "preview" | "code"
  action?: React.ReactNode
}

export function CodePreview({
  preview,
  children,
  componentName,
  code: manualCode,
  defaultTab = "preview",
  action,
  className,
  ...props
}: CodePreviewProps) {
  const content = preview ?? children
  const rawCode = manualCode ?? (componentName ? getRegistryComponentCode(componentName) : "")

  const { theme } = useTheme()
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    if (!rawCode) return
    let isMounted = true

    // Resolve system preference if theme === 'system'
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    const activeTheme = isDark ? "github-dark-default" : "github-light-default"

    async function highlight() {
      try {
        const html = await codeToHtml(rawCode, {
          lang: "tsx",
          theme: activeTheme,
        })
        if (isMounted) {
          setHighlightedCode(html)
        }
      } catch (e) {
        console.error("Shiki highlighting failed:", e)
      }
    }

    highlight()
    return () => {
      isMounted = false
    }
  }, [rawCode, theme])

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0 overflow-hidden rounded-2xl border",
        className
      )}
      {...props}
    >
      <Tabs defaultValue={defaultTab} className="gap-0">
        <div className="flex items-center justify-between border-b bg-muted/20 p-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {rawCode && <TabsTrigger value="code">Code</TabsTrigger>}
          </TabsList>

          {action && <div>{action}</div>}
        </div>

        <TabsContent
          value="preview"
          className="relative m-0 flex min-h-[360px] flex-1 items-center justify-center p-4 outline-none sm:min-h-[460px] lg:min-h-[550px]"
        >
          {content}
        </TabsContent>

        {rawCode && (
          <TabsContent
            value="code"
            className="relative m-0 h-[420px] flex-1 overflow-hidden outline-none sm:h-[500px] lg:h-full lg:max-h-192"
          >
            <div className="h-full w-full bg-muted/5 p-3 sm:p-4">
              <ScrollArea className="h-full w-full rounded-xl text-left [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-4 sm:[&_pre]:!p-6">
                {highlightedCode ? (
                  <div
                    className="w-fit min-w-full font-mono text-xs leading-relaxed sm:text-[13px]"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  />
                ) : (
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre text-muted-foreground sm:text-[13px]">
                    <code>{rawCode}</code>
                  </pre>
                )}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default CodePreview