import React from "react"
import type {
  Doc,
  DocMetadata,
  DocModule,
  DocPreview,
  DocNeighbors,
} from "@/types/document"

// Vite dynamic glob for all MDX component content files
const COMPONENT_DOCS = import.meta.glob<DocModule>(
  "/content/components/*.mdx"
)

// Eagerly import only frontmatter metadata for instant catalog queries
const COMPONENT_FRONTMATTER = import.meta.glob<DocMetadata>(
  "/content/components/*.mdx",
  {
    import: "frontmatter",
    eager: true,
  }
)

// In-memory cache for lazy-loaded component modules
const LAZY_COMPONENT_MAP: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<{ components?: Record<string, any> }>>
> = {}

function slugToPath(slug: string): string {
  const cleanSlug = slug.replace(/\.mdx$/, "")
  return `/content/components/${cleanSlug}.mdx`
}

/**
 * Returns true if a documentation file exists for the given slug.
 */
export function hasDoc(slug: string): boolean {
  const path = slugToPath(slug)
  return Boolean(COMPONENT_DOCS[path])
}

/**
 * Returns all available document slugs.
 */
export function getDocSlugs(): string[] {
  return Object.keys(COMPONENT_DOCS).map((path) => {
    const filename = path.split("/").pop() || ""
    return filename.replace(/\.mdx$/, "")
  })
}

/**
 * Returns a list of all documents with lightweight metadata previews for cards and indexes.
 */
export function getAllDocPreviews(): DocPreview[] {
  return Object.entries(COMPONENT_FRONTMATTER).map(([path, fm]) => {
    const filename = path.split("/").pop() || ""
    const slug = filename.replace(/\.mdx$/, "")
    const frontmatter: DocMetadata = fm || {
      title: slug.replace(/-/g, " "),
    }
    return {
      slug,
      title: frontmatter.title || slug.replace(/-/g, " "),
      description: frontmatter.description,
      badge: frontmatter.badge,
      category: frontmatter.category || "components",
      frontmatter,
    }
  })
}

/**
 * Asynchronously loads a complete document module by slug.
 */
export async function getDocBySlug(slug: string): Promise<Doc | null> {
  const path = slugToPath(slug)
  const loader = COMPONENT_DOCS[path]
  if (!loader) {
    return null
  }

  const mod = await loader()
  return {
    slug,
    metadata: mod.frontmatter || {
      title: slug.replace(/-/g, " "),
    },
    Component: mod.default,
  }
}

/**
 * Returns a React.lazy exotic component for dynamic streaming rendering.
 */
export function getLazyDocBySlug(
  slug: string
): React.LazyExoticComponent<
  React.ComponentType<{ components?: Record<string, any> }>
> | null {
  const path = slugToPath(slug)
  const loader = COMPONENT_DOCS[path]
  if (!loader) {
    return null
  }

  if (!LAZY_COMPONENT_MAP[slug]) {
    LAZY_COMPONENT_MAP[slug] = React.lazy(async () => {
      const mod = await loader()
      return { default: mod.default }
    })
  }

  return LAZY_COMPONENT_MAP[slug]
}

/**
 * Resolves previous and next neighbors for a slug to enable keyboard & pagination navigation.
 */
export function findDocNeighbors(slug: string): DocNeighbors {
  const allDocs = getAllDocPreviews()
  const currentIndex = allDocs.findIndex((doc) => doc.slug === slug)

  if (currentIndex === -1) {
    return { previous: null, next: null }
  }

  const previous = currentIndex > 0 ? allDocs[currentIndex - 1] : null
  const next =
    currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null

  return { previous, next }
}
