import React from "react"

// Raw code strings from registry/components
const REGISTRY_COMPONENTS = import.meta.glob<string>(
  "/registry/components/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

// Raw code strings from registry/examples
const REGISTRY_EXAMPLE_SOURCES = import.meta.glob<string>(
  "/registry/examples/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

// Dynamic React components for interactive examples
const REGISTRY_EXAMPLES = import.meta.glob<{
  default: React.ComponentType<any>
}>("/registry/examples/*.tsx")

// In-memory lazy example cache
const LAZY_EXAMPLES_MAP: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {}

/**
 * Returns raw component source code from /registry/components by component name.
 * e.g. "image-loader" or "image-loader.tsx"
 */
export function getRegistryComponentCode(name: string): string {
  const cleanName = name.replace(/\.tsx$/, "")
  for (const [path, code] of Object.entries(REGISTRY_COMPONENTS)) {
    if (path.endsWith(`/${cleanName}.tsx`)) {
      return code
    }
  }
  return ""
}

/**
 * Returns raw example source code from /registry/examples by example name.
 */
export function getRegistryExampleCode(name: string): string {
  const cleanName = name.replace(/\.tsx$/, "").replace(/-example$/, "")
  for (const [path, code] of Object.entries(REGISTRY_EXAMPLE_SOURCES)) {
    if (
      path.endsWith(`/${cleanName}-example.tsx`) ||
      path.endsWith(`/${cleanName}.tsx`)
    ) {
      return code
    }
  }
  return ""
}

/**
 * Resolves a lazy React component for an example demo by name.
 * e.g. "image-loader" resolves /registry/examples/image-loader-example.tsx
 */
export function getRegistryExampleComponent(
  name: string
): React.LazyExoticComponent<React.ComponentType<any>> | null {
  const cleanName = name.replace(/\.tsx$/, "").replace(/-example$/, "")

  if (LAZY_EXAMPLES_MAP[cleanName]) {
    return LAZY_EXAMPLES_MAP[cleanName]
  }

  let matchedPath = ""
  for (const path of Object.keys(REGISTRY_EXAMPLES)) {
    if (
      path.endsWith(`/${cleanName}-example.tsx`) ||
      path.endsWith(`/${cleanName}.tsx`)
    ) {
      matchedPath = path
      break
    }
  }

  if (!matchedPath) {
    return null
  }

  const loader = REGISTRY_EXAMPLES[matchedPath]
  LAZY_EXAMPLES_MAP[cleanName] = React.lazy(loader)
  return LAZY_EXAMPLES_MAP[cleanName]
}
