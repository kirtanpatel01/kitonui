"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

import { cn } from "cn"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyButton } from "@/components/copy-button"
import { useTheme } from "@/components/theme-provider"

import { getRegistryComponentCode } from "@/lib/registry"

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The code string to render */
  code?: string
  /** Name of the component in registry/components (e.g. "image-loader") */
  componentName?: string
  /** File path displayed on the left side of the header */
  path?: string
  /** Programming language for syntax highlighting (e.g. "tsx", "ts", "json", "bash") */
  lang?: string
  /** Callback invoked on successful copy */
  onCopySuccess?: (copiedText: string) => void
  /** Callback invoked when copy fails */
  onCopyError?: (error: Error) => void
}

function detectLanguage(filePath?: string, explicitLang?: string): string {
  if (explicitLang) return explicitLang
  if (!filePath) return "tsx"
  const ext = filePath.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "js":
      return "javascript"
    case "jsx":
      return "jsx"
    case "ts":
      return "typescript"
    case "tsx":
      return "tsx"
    case "json":
      return "json"
    case "css":
      return "css"
    case "html":
      return "html"
    case "sh":
    case "bash":
      return "bash"
    case "md":
    case "mdx":
      return "mdx"
    default:
      return "tsx"
  }
}

export function CodeBlock({
  code: manualCode,
  componentName,
  path,
  lang,
  onCopySuccess,
  onCopyError,
  className,
  ...props
}: CodeBlockProps) {
  const { theme } = useTheme()
  const [highlightedCode, setHighlightedCode] = useState("")

  const code =
    manualCode ?? (componentName ? getRegistryComponentCode(componentName) : "")
  const displayPath =
    path ?? (componentName ? `components/ui/${componentName}.tsx` : "code")
  const resolvedLang = detectLanguage(displayPath, lang)

  useEffect(() => {
    if (!code) {
      setHighlightedCode("")
      return
    }

    let isMounted = true

    // Resolve system preference if theme === 'system'
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    const shikiTheme = isDark ? "github-dark-default" : "github-light-default"

    async function highlight() {
      try {
        const html = await codeToHtml(code, {
          lang: resolvedLang,
          theme: shikiTheme,
        })
        if (isMounted) {
          setHighlightedCode(html)
        }
      } catch (e) {
        console.error("Shiki highlighting failed in CodeBlock:", e)
      }
    }

    highlight()

    return () => {
      isMounted = false
    }
  }, [code, resolvedLang, theme])

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 overflow-hidden rounded-[20px] border border-primary/30 bg-primary/20 p-2 pt-1 shadow-[inset_0_0_8px_oklch(from_var(--primary)_l_c_h/0.6)]",
        className
      )}
      {...props}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pl-2">
        <span className="font-mono text-xs font-semibold text-primary select-none">
          {displayPath}
        </span>

        <CopyButton
          className="text-primary/80"
          variant="link"
          text={code}
          onCopySuccess={onCopySuccess}
          onCopyError={onCopyError}
        />
      </div>

      {/* Code Content */}
      <div className="relative m-0 flex max-h-[460px] flex-col overflow-hidden rounded-[12px] bg-background shadow-sm shadow-primary/30">
        <ScrollArea className="h-full max-h-[460px] w-full text-left [&_pre]:!m-0 [&_pre]:!bg-transparent">
          <div className="p-3 sm:p-4">
            {highlightedCode ? (
              <div
                className="w-fit min-w-full font-mono text-xs leading-relaxed sm:text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            ) : (
              <pre className="font-mono text-xs leading-relaxed whitespace-pre text-muted-foreground sm:text-sm">
                <code>{code}</code>
              </pre>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default CodeBlock
