import type { DocMetadata } from "@/lib/docs"

declare module "*.mdx" {
  import type { ComponentType } from "react"
  export const frontmatter: DocMetadata
  const Component: ComponentType<{ components?: Record<string, any> }>
  export default Component
}
