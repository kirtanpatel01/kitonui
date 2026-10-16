import React from "react"
import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Section from "@/components/layout/section"
import { CodeBlock } from "@/components/code-block"
import { CodeBlockCommand } from "@/components/code-block-command"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import ImageLoaderDoc from "@/content/components/image-loader.mdx"

const DOCS_MAP: Record<string, React.ComponentType<any>> = {
  "image-loader": ImageLoaderDoc,
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="font-logo text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-logo text-2xl font-bold tracking-tight text-foreground pt-8 pb-2 border-b border-border/40 scroll-m-20 first:pt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-logo text-lg font-semibold tracking-tight text-foreground pt-4 pb-1 scroll-m-20 sm:text-xl"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-base leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-3 ml-6 list-disc space-y-1.5 text-muted-foreground [&>li]:leading-relaxed"
      {...props}
    />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-3 ml-6 list-decimal space-y-1.5 text-muted-foreground [&>li]:leading-relaxed"
      {...props}
    />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
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
}

export const Route = createFileRoute("/components/$componentName")({
  loader: ({ params }) => {
    const valid = ["image-loader", "button"]
    if (!valid.includes(params.componentName)) {
      throw notFound()
    }
    return { componentName: params.componentName }
  },
  component: ComponentDetailPage,
})

function ComponentDetailPage() {
  const { componentName } = Route.useParams()
  const DocComponent = DOCS_MAP[componentName]

  return (
    <main className="min-h-screen py-6 sm:py-8">
      <Section className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {componentName.replace(/-/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {DocComponent ? (
          <div className="space-y-6">
            <DocComponent components={mdxComponents} />
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <h1 className="font-logo text-3xl font-extrabold tracking-tight text-foreground capitalize sm:text-4xl">
                {componentName.replace(/-/g, " ")}
              </h1>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                registry:ui
              </span>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Documentation coming soon.
            </p>
          </div>
        )}
      </Section>
    </main>
  )
}
