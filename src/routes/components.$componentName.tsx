import { Suspense } from "react"
import { createFileRoute, notFound, Link } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Section from "@/components/layout/section"
import { mdxComponents } from "@/components/mdx-components"
import { TableOfContents } from "@/components/toc"
import {
  getComponentDoc,
  getLazyComponentDoc,
  hasComponentDoc,
  getComponentSlugs,
} from "@/lib/docs"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const Route = createFileRoute("/components/$componentName")({
  loader: async ({ params }) => {
    if (!hasComponentDoc(params.componentName)) {
      throw notFound()
    }

    const doc = await getComponentDoc(params.componentName)
    if (!doc) {
      throw notFound()
    }

    return {
      slug: params.componentName,
      frontmatter: doc.frontmatter,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { frontmatter } = loaderData
    const title = frontmatter?.title ?? "Component"
    const description =
      frontmatter?.description ?? "A beautifully crafted component by Kiton UI."

    return {
      meta: [
        { title: `${title} — Kiton UI` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Kiton UI` },
        { property: "og:description", content: description },
        { name: "twitter:title", content: `${title} — Kiton UI` },
        { name: "twitter:description", content: description },
      ],
    }
  },
  component: ComponentDetailPage,
})

function ComponentDetailPage() {
  const { slug, frontmatter } = Route.useLoaderData()

  const LazyDoc = getLazyComponentDoc(slug)
  const allSlugs = getComponentSlugs()
  const currentIndex = allSlugs.indexOf(slug)
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null
  const nextSlug =
    currentIndex !== -1 && currentIndex < allSlugs.length - 1
      ? allSlugs[currentIndex + 1]
      : null

  return (
    <main className="min-h-screen py-6 sm:py-8">
      <Section>
        {/* Top Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {frontmatter?.title ?? slug.replace(/-/g, " ")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Two-column layout: Content + TOC */}
        <div className="flex gap-12 xl:gap-16">
          {/* Main content */}
          <article className="min-w-0 flex-1 space-y-6">
            {/* Header section */}
            <div className="space-y-3 pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-logo text-3xl font-extrabold tracking-tight text-foreground capitalize sm:text-4xl">
                  {frontmatter?.title ?? slug.replace(/-/g, " ")}
                </h1>
                {frontmatter?.badge && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                    {frontmatter.badge}
                  </span>
                )}
              </div>
              {frontmatter?.description && (
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {frontmatter.description}
                </p>
              )}
            </div>

            {/* MDX Body */}
            {LazyDoc ? (
              <Suspense
                fallback={
                  <div className="flex h-48 w-full items-center justify-center text-sm text-muted-foreground">
                    <span className="animate-pulse">Loading documentation...</span>
                  </div>
                }
              >
                <LazyDoc components={mdxComponents} />
              </Suspense>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Documentation coming soon.
                </p>
              </div>
            )}

            {/* Bottom Pagination Links */}
            <nav
              aria-label="Documentation pagination"
              className="flex items-center justify-between border-t border-border/40 pt-8 mt-12"
            >
              {prevSlug ? (
                <Link
                  to="/components/$componentName"
                  params={{ componentName: prevSlug }}
                  className="group flex flex-col items-start gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                    <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    Previous
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {prevSlug.replace(/-/g, " ")}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextSlug ? (
                <Link
                  to="/components/$componentName"
                  params={{ componentName: nextSlug }}
                  className="group flex flex-col items-end gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto text-right"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                    Next
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {nextSlug.replace(/-/g, " ")}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </article>

          {/* TOC sidebar — only visible on xl+ */}
          <aside className="hidden xl:block xl:w-56 xl:shrink-0">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </Section>
    </main>
  )
}
