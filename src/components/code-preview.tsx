import * as React from "react"
import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyButton } from "@/components/copy-button"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

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
  /** Custom transition duration in seconds for tab resize & crossfade (default: 0.35) */
  transitionDuration?: number
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
  transitionDuration = 0.5,
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

  const previewRef = React.useRef<HTMLDivElement>(null)
  const codeRef = React.useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined)

  // Measure active tab panel real DOM height
  useEffect(() => {
    const targetElement = activeTab === "preview" ? previewRef.current : codeRef.current
    if (!targetElement) return

    const updateHeight = () => {
      if (activeTab === "preview") {
        const height = previewRef.current?.getBoundingClientRect().height
        if (height && height > 0) setContainerHeight(height)
      } else {
        // Code view default fixed ergonomic window
        setContainerHeight(500)
      }
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(targetElement)

    return () => observer.disconnect()
  }, [activeTab, content, highlightedCode])

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 overflow-hidden rounded-[20px] border border-primary/30 bg-primary/20 p-2 shadow-[inset_0_0_8px_oklch(from_var(--primary)_l_c_h/0.6)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center font-logo relative">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none",
              activeTab === "preview"
                ? "font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "preview" && (
              <motion.div
                layoutId="code-preview-tab-pill"
                className="absolute inset-0 rounded-lg bg-background shadow-sm shadow-primary/30 dark:shadow-black dark:shadow-[inset_0_0_4px_2px]!"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">Preview</span>
          </button>

          {rawCode && (
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none",
                activeTab === "code"
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {activeTab === "code" && (
                <motion.div
                  layoutId="code-preview-tab-pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm shadow-primary/30 dark:shadow-black dark:shadow-[inset_0_0_4px_2px]!"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Code</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action && <div>{action}</div>}
          {activeTab === "code" && rawCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <CopyButton
                className="text-primary/80"
                variant="link"
                text={rawCode}
                size={"icon-sm"}
                onCopySuccess={onCopySuccess}
                onCopyError={onCopyError}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Main morphing frame with CSS height animation (No layout scale stretching) */}
      <motion.div
        animate={{
          height: containerHeight,
        }}
        transition={{
          duration: transitionDuration,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative m-0 overflow-hidden rounded-[12px] bg-background shadow-sm shadow-primary/30 min-h-[360px]"
      >
        {/* Preview Panel */}
        <motion.div
          ref={previewRef}
          animate={{
            opacity: activeTab === "preview" ? 1 : 0,
          }}
          transition={{ duration: transitionDuration * 0.5, ease: "easeInOut" }}
          className={cn(
            "flex w-full items-center justify-center p-4 min-h-[360px] sm:min-h-[460px] lg:min-h-[550px]",
            activeTab !== "preview" && "pointer-events-none absolute inset-x-0 top-0 invisible"
          )}
        >
          {content}
        </motion.div>

        {/* Code Panel */}
        {rawCode && (
          <motion.div
            ref={codeRef}
            animate={{
              opacity: activeTab === "code" ? 1 : 0,
            }}
            transition={{ duration: transitionDuration * 0.5, ease: "easeInOut" }}
            className={cn(
              "h-[500px] w-full min-h-0 overflow-hidden",
              activeTab !== "code" && "pointer-events-none absolute inset-x-0 top-0 invisible"
            )}
          >
            <ScrollArea className="h-full w-full min-h-0 bg-muted/5 text-left [&_pre]:!m-0 [&_pre]:!bg-transparent">
              <div className="p-4 sm:p-6">
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
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default CodePreview
