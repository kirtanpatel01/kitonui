import { createFileRoute, notFound } from "@tanstack/react-router"
import { getDocBySlug, hasDoc } from "@/features/doc/data/documents"
import { DocPage } from "@/features/doc/components/doc-page"

export const Route = createFileRoute("/components/$componentName")({
  loader: async ({ params }) => {
    if (!hasDoc(params.componentName)) {
      throw notFound()
    }

    const doc = await getDocBySlug(params.componentName)
    if (!doc) {
      throw notFound()
    }

    return {
      slug: params.componentName,
      metadata: doc.metadata,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { metadata } = loaderData
    const title = metadata?.title ?? "Component"
    const description =
      metadata?.description ?? "A beautifully crafted component by Kiton UI."

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
  component: ComponentDetailRoute,
})

function ComponentDetailRoute() {
  const { slug, metadata } = Route.useLoaderData()
  return <DocPage slug={slug} metadata={metadata} />
}
