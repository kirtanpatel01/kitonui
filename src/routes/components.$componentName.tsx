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

import React from "react"
import ImageLoaderDoc from "@/content/components/image-loader.mdx"

const DOCS_MAP: Record<string, React.ComponentType<any>> = {
  "image-loader": ImageLoaderDoc,
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Section>
      <h1
        className="font-logo text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        {...props}
      />
    </Section>
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
      <Section>
        <p
          className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          {...props}
        />
      </Section>
    )
  },
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
    <main className="min-h-screen">
      <Section>
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
      </Section>

      <div className="pt-2 pb-8">
        {DocComponent ? (
          <div>
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
      </div>
    </main>
  )
}
