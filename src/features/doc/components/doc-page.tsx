import { Suspense } from "react"
import type { DocMetadata } from "@/types/document"
import { getLazyDocBySlug, findDocNeighbors } from "@/features/doc/data/documents"
import { mdxComponents } from "@/components/mdx"
import { DocLayout, DocBreadcrumbs } from "./doc-layout"
import { DocHeader } from "./doc-header"
import { DocPagination } from "./doc-pagination"

export interface DocPageProps {
  slug: string
  metadata?: DocMetadata
}

export function DocPage({ slug, metadata }: DocPageProps) {
  const LazyDoc = getLazyDocBySlug(slug)
  const neighbors = findDocNeighbors(slug)
  const displayTitle = metadata?.title ?? slug.replace(/-/g, " ")

  return (
    <DocLayout
      breadcrumbs={<DocBreadcrumbs title={displayTitle} />}
      toc={metadata?.toc !== false}
    >
      {/* Header section */}
      <DocHeader title={displayTitle} metadata={metadata} />

      {/* MDX Body with Suspense streaming */}
      {LazyDoc ? (
        <Suspense
          fallback={
            <div className="flex h-48 w-full items-center justify-center text-sm text-muted-foreground">
              <span className="animate-pulse font-mono text-xs">
                Loading documentation...
              </span>
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

      {/* Pagination Footer */}
      <DocPagination neighbors={neighbors} />
    </DocLayout>
  )
}
