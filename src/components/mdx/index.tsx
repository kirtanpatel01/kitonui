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

import { Heading } from "./heading"
import { Callout } from "./callout"
import { Steps, Step } from "./steps"
import { ComponentPreview } from "./component-preview"
import { ComponentSource } from "./component-source"

export {
  Heading,
  Callout,
  Steps,
  Step,
  ComponentPreview,
  ComponentSource,
}

// Master MDX Component Dictionary
export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading as="h1" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading as="h2" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading as="h3" {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading as="h4" {...props} />,
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

      // Intercept CLI installation commands to render interactive multi-package-manager tabs
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
