declare module "*.mdx" {
  import type { ComponentType } from "react"
  export const frontmatter: Record<string, any>
  const Component: ComponentType<any>
  export default Component
}
