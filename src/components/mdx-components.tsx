"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "@/components/code-block"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodePreview } from "@/components/code-preview"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  getRegistryComponentCode,
  getRegistryExampleCode,
  getRegistryExampleComponent,
} from "@/lib/registry"
import { InfoIcon, AlertTriangleIcon, CheckCircle2Icon } from "lucide-react"

// Anchor link component for headings
function HeadingAnchor({ id }: { id?: string }) {
  if (!id) return null
  return (
    <a
      href={`#${id}`}
      aria-label="Link to section"
      className="ml-2 inline-flex opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-muted-foreground/60 hover:text-primary"
    >
      #
    </a>
  )
}

// Custom Callout / Alert
export function Callout({
  children,
  type = "default",
  title,
  className,
}: {
  children: React.ReactNode
  type?: "default" | "warning" | "success" | "info"
  title?: string
  className?: string
}) {
  const icons = {
    default: <InfoIcon className="h-4 w-4 text-foreground/80 shrink-0" />,
    info: <InfoIcon className="h-4 w-4 text-blue-500 shrink-0" />,
    warning: <AlertTriangleIcon className="h-4 w-4 text-amber-500 shrink-0" />,
    success: <CheckCircle2Icon className="h-4 w-4 text-emerald-500 shrink-0" />,
  }

  const borderColors = {
    default: "border-border/60 bg-muted/30 text-foreground",
    info: "border-blue-500/20 bg-blue-500/10 text-foreground",
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
    >
      {icons[type]}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold text-foreground">{title}</h5>}
        <div className="text-muted-foreground [&>p]:leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

// Sequential Steps wrapper
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

// ComponentPreview for embedding live examples with tabs
export function ComponentPreview({
  name,
  className,
  align = "center",
  ...props
}: {
  name: string
  className?: string
  align?: "center" | "start" | "end"
}) {
  const ExampleComponent = getRegistryExampleComponent(name)
  const code = getRegistryExampleCode(name) || getRegistryComponentCode(name)

  return (
    <div className={cn("group relative my-6 w-full", className)} {...props}>
      <CodePreview
        componentName={name}
        code={code}
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

// ComponentSource for displaying raw component implementation files
export function ComponentSource({
  name,
  src,
  title,
  className,
  ...props
}: {
  name?: string
  src?: string
  title?: string
  className?: string
}) {
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

// Master MDX Component Map
export const mdxComponents = {
  h1: ({ id, className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      id={id}
      className={cn(
        "font-logo text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ id, className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className={cn(
        "group font-logo text-2xl font-bold tracking-tight text-foreground pt-8 pb-2 border-b border-border/40 scroll-m-20 first:pt-0",
        className
      )}
      {...props}
    >
      {children}
      <HeadingAnchor id={id} />
    </h2>
  ),
  h3: ({ id, className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className={cn(
        "group font-logo text-xl font-semibold tracking-tight text-foreground pt-6 pb-2 scroll-m-20",
        className
      )}
      {...props}
    >
      {children}
      <HeadingAnchor id={id} />
    </h3>
  ),
  h4: ({ id, className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={id}
      className={cn(
        "group font-logo text-lg font-semibold tracking-tight text-foreground pt-4 pb-1 scroll-m-20",
        className
      )}
      {...props}
    >
      {children}
      <HeadingAnchor id={id} />
    </h4>
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("text-base leading-relaxed text-muted-foreground [&:not(:first-child)]:mt-3", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn("my-3 ml-6 list-disc space-y-1.5 text-muted-foreground [&>li]:leading-relaxed", className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-3 ml-6 list-decimal space-y-1.5 text-muted-foreground [&>li]:leading-relaxed", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "my-4 border-l-2 border-primary/50 pl-4 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-t border-border/40 p-0 even:bg-muted/30", className)} {...props} />
  ),
  th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className={cn(
        "border border-border/40 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className={cn(
        "border border-border/40 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return <code className={className} {...props} />
    }
    return (
      <code
        className="relative rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-xs font-medium text-foreground"
        {...props}
      />
    )
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    const children = props.children as any
    if (
      React.isValidElement(children) &&
      typeof (children.props as any)?.children === "string"
    ) {
      const codeText = (children.props as any).children.trim()
      const className = (children.props as any).className || ""
      const langMatch = className.match(/language-(\w+)/)
      const lang = langMatch ? langMatch[1] : undefined

      // If it looks like a CLI install command, render CodeBlockCommand!
      if (
        lang === "bash" ||
        lang === "sh" ||
        codeText.startsWith("npx ") ||
        codeText.startsWith("pnpm ") ||
        codeText.startsWith("npm ") ||
        codeText.startsWith("bun ")
      ) {
        return <div className="my-4"><CodeBlockCommand command={codeText} /></div>
      }

      return <CodeBlock code={codeText} lang={lang} className="my-4" />
    }
    return <pre {...props} />
  },
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CodeBlockCommand,
  CodeBlock,
  CodePreview,
  ComponentPreview,
  ComponentSource,
  Steps,
  Step,
  Callout,
}
