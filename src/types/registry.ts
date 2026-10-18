import type { ComponentType, LazyExoticComponent } from "react"

export type RegistryItemType =
  | "registry:ui"
  | "registry:component"
  | "registry:example"
  | "registry:hook"
  | "registry:lib"
  | "registry:block"

export interface RegistryFile {
  path: string
  content?: string
  type: RegistryItemType
  target?: string
}

export interface RegistryItem {
  name: string
  type: RegistryItemType
  title?: string
  description?: string
  files: RegistryFile[]
  component?: LazyExoticComponent<ComponentType<any>>
  categories?: string[]
}
