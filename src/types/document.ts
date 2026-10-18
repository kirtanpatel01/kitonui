import type { ComponentType } from "react"

export interface DocMetadata {
  title: string
  description?: string
  badge?: string
  category?: string
  date?: string
  new?: boolean
  updated?: boolean
  pinned?: boolean
  toc?: boolean
  [key: string]: any
}

export interface DocModule {
  default: ComponentType<{ components?: Record<string, any> }>
  frontmatter?: DocMetadata
}

export interface Doc {
  slug: string
  metadata: DocMetadata
  Component: ComponentType<{ components?: Record<string, any> }>
}

export interface DocPreview {
  slug: string
  title: string
  description?: string
  badge?: string
  category?: string
  frontmatter: DocMetadata
}

export interface DocNeighbors {
  previous: DocPreview | null
  next: DocPreview | null
}
