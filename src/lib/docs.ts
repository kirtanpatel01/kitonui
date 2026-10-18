import React from "react"

export interface DocMetadata {
  title: string
  description?: string
  badge?: string
  category?: string
  date?: string
  toc?: boolean
  [key: string]: any
}

export interface DocModule {
  default: React.ComponentType<{ components?: Record<string, any> }>
  frontmatter?: DocMetadata
}

// Vite glob for all MDX content files in content/components
const COMPONENT_DOCS = import.meta.glob<DocModule>(
  "/content/components/*.mdx"
)

// In-memory cache for lazy components
const LAZY_COMPONENT_MAP: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<{ components?: Record<string, any> }>>
> = {}

/**
 * Normalizes a slug to its expected MDX file path.
 */
function slugToPath(slug: string): string {
  const cleanSlug = slug.replace(/\.mdx$/, "")
  return `/content/components/${cleanSlug}.mdx`
}

/**
 * Returns true if a documentation file exists for the given slug.
 */
export function hasComponentDoc(slug: string): boolean {
  const path = slugToPath(slug)
  return Boolean(COMPONENT_DOCS[path])
}

/**
 * Returns a list of all component slugs available in /content/components.
 */
export function getComponentSlugs(): string[] {
  return Object.keys(COMPONENT_DOCS).map((path) => {
    const filename = path.split("/").pop() || ""
    return filename.replace(/\.mdx$/, "")
  })
}

/**
 * Asynchronously loads the doc module (frontmatter + component) for a slug.
 */
export async function getComponentDoc(slug: string): Promise<{
  slug: string
  frontmatter: DocMetadata
  Component: React.ComponentType<{ components?: Record<string, any> }>
} | null> {
  const path = slugToPath(slug)
  const loader = COMPONENT_DOCS[path]
  if (!loader) {
    return null
  }

  const mod = await loader()
  return {
    slug,
    frontmatter: mod.frontmatter || {
      title: slug.replace(/-/g, " "),
    },
    Component: mod.default,
  }
}

/**
 * Returns a React.lazy component for dynamic rendering with Suspense.
 */
export function getLazyComponentDoc(
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
