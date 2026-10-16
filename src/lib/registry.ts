// Automatically import all raw TSX code from registry/components
const REGISTRY_COMPONENTS = import.meta.glob<string>(
  "../../registry/components/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

export function getRegistryComponentCode(name: string): string {
  // Try exact file name or with .tsx extension
  const cleanName = name.replace(/\.tsx$/, "")
  for (const [path, code] of Object.entries(REGISTRY_COMPONENTS)) {
    if (path.endsWith(`/${cleanName}.tsx`)) {
      return code
    }
  }
  return ""
}
