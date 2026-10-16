import * as React from "react"
import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CopyButton } from "@/components/copy-button"
import { cn } from "cn"

import { useTheme } from "@/components/theme-provider"

import { getRegistryComponentCode } from "@/lib/registry"

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
  /** Callback invoked on successful copy in code panel */
  onCopySuccess?: (copiedText: string) => void
  /** Callback invoked when copy fails in code panel */
  onCopyError?: (error: Error) => void
}

export function CodePreview({
  preview,
  children,
  componentName,
  code: manualCode,
  defaultTab = "preview",
  action,
  onCopySuccess,
  onCopyError,
  className,
  ...props
}: CodePreviewProps) {
  const content = preview ?? children
  const rawCode =
    manualCode ?? (componentName ? getRegistryComponentCode(componentName) : "")

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

  const [activeTab, setActiveTab] = useState<"preview" | "code">(defaultTab)

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 overflow-hidden rounded-[20px] border border-primary/30 bg-primary/20 p-2 shadow-[inset_0_0_8px_oklch(from_var(--primary)_l_c_h/0.6)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center font-logo">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none",
              activeTab === "preview"
                ? "bg-background font-semibold text-primary shadow-sm shadow-primary/30 dark:shadow-black dark:shadow-[inset_0_0_4px_2px]!"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Preview
          </button>

          {rawCode && (
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none",
                activeTab === "code"
                  ? "bg-background font-semibold text-primary shadow-sm shadow-primary/30 dark:shadow-black dark:shadow-[inset_0_0_4px_2px]!"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Code
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {activeTab === "code" && rawCode && (
            <CopyButton
              className="text-primary/80"
              variant="link"
              text={rawCode}
              onCopySuccess={onCopySuccess}
              onCopyError={onCopyError}
            />
          )}
        </div>
      </div>

      <div className="relative m-0 flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[12px] bg-background shadow-sm shadow-primary/30 sm:min-h-[460px] lg:min-h-[550px]">
        {activeTab === "preview" ? (
          <div className="flex h-full w-full flex-1 items-center justify-center p-4">
            {content}
          </div>
        ) : (
          rawCode && (
            <div className="h-[420px] w-full flex-1 overflow-hidden sm:h-[500px] lg:h-full lg:max-h-192">
              <div className="h-full w-full bg-muted/5">
                <ScrollArea className="h-full w-full rounded-[12px] text-left [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-4 sm:[&_pre]:!p-6">
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
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default CodePreview
