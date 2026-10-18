# Production MDX architecture report

## 1. Executive architecture summary

This repository uses a Next.js 16 App Router architecture, not a Vite MDX
loader. The important distinction is that MDX documents are discovered from
the filesystem and parsed with `gray-matter`; they are not imported through a
hardcoded map of MDX modules.

The end-to-end flow is:

1. Authors add a kebab-case file under
   [`src/features/doc/content/components/`](./src/features/doc/content/components/)
   or [`src/features/doc/content/blog/`](./src/features/doc/content/blog/).
2. [`documents.ts`](./src/features/doc/data/documents.ts) scans immediate
   category directories, derives the slug from the filename, parses YAML
   frontmatter with `gray-matter`, and caches the complete document collection
   with React `cache`.
3. The route
   [`src/app/(app)/(docs)/components/[slug]/page.tsx`](./src/app/(app)/(docs)/components/%5Bslug%5D/page.tsx)
   (and its blog equivalent) calls `generateStaticParams`, so every discovered
   slug is statically generated. `dynamicParams = false` rejects paths not
   present in that generated set.
4. The route obtains the document body, extracts a heading outline using
   `fumadocs-core/content/toc`, creates SEO metadata and JSON-LD, and renders
   the body through [`MDX`](./src/components/mdx.tsx).
5. `MDXRemote` compiles the source with remark and rehype plugins. Custom MDX
   elements become React components through one typed component map.
6. Code blocks first preserve their raw source, then are highlighted with
   `rehype-pretty-code` and Shiki themes. The raw source is forwarded as
   private properties to the mapped `pre` component for copying, package
   manager conversion, and collapsible framing.
7. `<ComponentPreview name="...">` resolves a generated registry entry.
   The generated `Index` uses `React.lazy` and dynamic imports, so demos are
   split into separate chunks rather than eagerly importing every registry
   component.
8. `<ComponentSource>` resolves the registry item or an explicit source path,
   reads source on the server, normalizes aliases, highlights it with Shiki,
   and sends highlighted HTML plus the original source to the code frame.

The registry is a second, related pipeline. Authored registry components and
examples live under [`src/registry/`](./src/registry/). The
`registry:build` script generates `registry.json`, `registry-stats.json`,
`src/registry/__index__.tsx`, and public registry JSON. Those generated files
are outputs and must not be edited manually.

## 2. Dependencies and configuration

### Runtime and build dependencies

The exact relevant packages in [`package.json`](./package.json) are:

- `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`
- `next-mdx-remote@^6.0.0`
- `gray-matter@^4.0.3`
- `fumadocs-core@^16.10.5`
- `remark-gfm@^4.0.1`
- `remark-mdx@^3.1.0` and `remark@^15.0.1`
- `rehype-pretty-code@^0.14.3`, `shiki@4.0.1`, `rehype-slug@^6.0.0`
- `rehype-external-links@^3.0.0`, `rehype-raw@^7.0.0`
- `unist-util-visit@^5.0.0`, `strip-indent@^4.0.0`
- `shadcn@4.12.0`, `zod`, and `lru-cache`
- Tailwind v4 packages: `tailwindcss`, `@tailwindcss/postcss`,
  `@tailwindcss/typography`, and `tw-animate-css`

The project does **not** configure `@next/mdx`, `@mdx-js/loader`, a Vite
plugin, `remark-frontmatter`, or `remark-mdx-frontmatter`. Frontmatter is
extracted before MDX compilation by `gray-matter`, and the remaining body is
passed to `MDXRemote`.

### Next configuration

[`next.config.ts`](./next.config.ts) contains no MDX webpack/Turbopack loader.
The MDX-specific settings are:

```ts
transpilePackages: ["next-mdx-remote"],
typedRoutes: true,
allowedDevOrigins: ["ncdai.localhost", "ncdai.local"],
```

The same config also provides:

- permanent legacy component redirects;
- content negotiation rewrites for `.md` endpoints and `Accept:
  text/markdown`;
- optimized imports for large icon packages;
- static build timestamp injection.

For a TanStack Router + Vite port, the equivalent is a Vite MDX plugin or an
explicit `compileMDX` helper, plus a route-level lazy importer. Do not copy
the Next config itself: the source architecture is portable, but the
compilation and route APIs are not.

### Build commands

[`package.json`](./package.json) defines:

```json
{
  "build": "pnpm registry:build && next build",
  "registry:build": "bun run ./src/scripts/build-registry.mts && shadcn build",
  "registry:validate": "shadcn registry validate ./public/r/registry.json",
  "check-types": "tsc --noEmit --pretty",
  "test:run": "vitest run"
}
```

The registry build is deliberately run before `next build`, because the
runtime source resolver and preview index import
[`src/registry/__index__.tsx`](./src/registry/__index__.tsx).

## 3. Core code snippets

The links in this section point to the complete source files. The snippets
below include the complete implementation of each architectural helper rather
than pseudocode.

### 3.1 Filesystem discovery, frontmatter, and slugs

Source: [`src/features/doc/data/documents.ts`](./src/features/doc/data/documents.ts).

```ts
import fs from "fs"
import path from "path"
import { cache } from "react"
import matter from "gray-matter"

import type { Doc, DocMetadata } from "@/features/doc/types/document"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)
  return {
    metadata: file.data as DocMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  return parseFrontmatter(fs.readFileSync(filePath, "utf-8"))
}

function getMDXData(dir: string) {
  const categoryDirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())

  return categoryDirs.flatMap((categoryDir) => {
    const category = categoryDir.name
    const categoryPath = path.join(dir, category)

    return getMDXFiles(categoryPath).map<Doc>((file) => {
      const { metadata, content } = readMDXFile(path.join(categoryPath, file))
      return {
        metadata: { ...metadata, category },
        slug: path.basename(file, path.extname(file)),
        content,
      }
    })
  })
}

export const getAllDocs = cache(() =>
  getMDXData(path.join(process.cwd(), "src/features/doc/content")).sort(
    (a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1
      if (!a.metadata.pinned && b.metadata.pinned) return 1
      return (
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
      )
    }
  )
)

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug)
}

export function getDocsByCategory(category: string) {
  return getAllDocs().filter((doc) => doc.metadata?.category === category)
}

export const BLOG_CATEGORY = "blog"
export const COMPONENTS_CATEGORY = "components"
export const getBlogPosts = () => getDocsByCategory(BLOG_CATEGORY)
export const getComponentDocs = () => getDocsByCategory(COMPONENTS_CATEGORY)
```

The metadata contract is defined in
[`src/features/doc/types/document.ts`](./src/features/doc/types/document.ts):
`title`, `description`, `createdAt`, and `updatedAt` are required; `image`,
`new`, `updated`, `pinned`, and `ads` are optional. `category` is derived from
the folder, not trusted from frontmatter.

### 3.2 Dynamic route and validation

The complete production component route is
[`src/app/(app)/(docs)/components/[slug]/page.tsx`](./src/app/(app)/(docs)/components/%5Bslug%5D/page.tsx).
Its route-critical implementation is:

```tsx
export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  return getComponentDocs().map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc || doc.metadata.category !== "components") {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata
  const postUrl = `/components/${doc.slug}`
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: { url: ogImage, width: 1200, height: 630, alt: title },
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [ogImage],
    },
  }
}

export default async function Page({
  params,
}: PageProps<"/components/[slug]">) {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc || doc.metadata.category !== "components") {
    notFound()
  }

  const toc = getTableOfContents(doc.content)
  return (
    <DocContentCol>
      <TOCInline className="lg:hidden" items={toc} />
      <MDX code={doc.content} />
      <TOCMinimap items={toc} />
    </DocContentCol>
  )
}
```

The actual file additionally renders breadcrumbs, JSON-LD, ads, keyboard
navigation, previous/next links, share/LLM actions, and the page layout. The
blog route follows the same contract in
[`src/app/(app)/(docs)/blog/[slug]/page.tsx`](./src/app/(app)/(docs)/blog/%5Bslug%5D/page.tsx),
but uses `getBlogPosts()` and `BlogPosting` JSON-LD.

For TanStack Router, translate this to a file route such as
`routes/components/$slug.tsx`, validate the parameter against a generated
document index in the loader, throw the router's not-found response for a
missing/category-mismatched slug, and use `lazyRouteComponent` or a lazy MDX
loader for the body.

### 3.3 MDX mapper and compilation pipeline

Complete source: [`src/components/mdx.tsx`](./src/components/mdx.tsx).

```tsx
const components: MDXRemoteProps["components"] = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  ...mdxCodeBlockComponents,
  code: Code,
  ComponentPreview,
  ComponentSource,
  CodeCollapsibleWrapper,
  CodeTabs,
  Callout,
  Steps,
  Step,
  Tabs,
  TabsList,
  TabsIndicator,
  TabsTrigger,
  TabsContent,
  TabsListInstallType,
  YouTubeEmbed,
  IframeEmbed,
  FramedImage,
  DocTestimonial,
  DocTestimonial2,
  DocSponsors,
  AutoTypeTable: (props) => <AutoTypeTable {...props} generator={generator} />,
}

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkCodeImport, remarkHeading],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
      rehypeSlug,
      rehypeCodeRawString,
      rehypeHighlightCode,
      rehypeHighlightCodeRawString,
      rehypeNpmCommand,
      [rehypeAddQueryParams, UTM_PARAMS],
    ],
  },
}

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />
}
```

The full file is intentionally the source of truth for the exact component
map, including the styled `Steps`/`Step` wrappers and install-type tabs.
There is no arbitrary MDX scope object: only this allow-listed component map
is exposed.

### 3.4 Code block preservation, highlighting, and commands

The complete transforms are in
[`src/lib/rehype-code-block.ts`](./src/lib/rehype-code-block.ts),
[`src/lib/rehype-npm-command.ts`](./src/lib/rehype-npm-command.ts), and
[`src/lib/highlight-code.ts`](./src/lib/highlight-code.ts).

The important sequence is:

```ts
export function rehypeCodeRawString() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node?.type !== "element" || node?.tagName !== "pre") return
      const codeEl = node.children?.[0]
      if (!codeEl || codeEl.tagName !== "code") return
      node.__rawString__ = codeEl.children?.[0].value
    })
  }
}

export function rehypeHighlightCode() {
  return rehypePrettyCode({
    theme: CODE_THEMES,
    keepBackground: false,
    onVisitLine(node: LineElement) {
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }]
      }
    },
  })
}

export function rehypeHighlightCodeRawString() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (
        node?.type !== "element" ||
        node?.tagName !== "figure" ||
        !node.properties ||
        !("data-rehype-pretty-code-figure" in node.properties)
      ) return

      const preElement = node.children?.at(-1)
      if (!preElement || preElement.tagName !== "pre") return
      preElement.properties = {
        ...preElement.properties,
        __withMeta__: node.children?.at(0)?.tagName === "figcaption",
        __rawString__: node.__rawString__,
      }
    })
  }
}
```

`rehypeNpmCommand` detects `npm install`, `npx create-*`, `npm create`,
`npx`, and `npm run`, and adds `__pnpm__`, `__yarn__`, `__npm__`, and
`__bun__` properties. The mapped `pre` in
[`src/components/mdx-code-block.tsx`](./src/components/mdx-code-block.tsx)
uses those properties to render [`CodeBlockCommand`](./src/components/code-block-command.tsx)
instead of a plain block.

The code component itself is [`CodeBlockFrame`](./src/components/mdx-code-block.tsx):
it wraps the highlighted `pre`, preserves the original source for
[`CopyButton`](./src/components/copy-button.tsx), supports a title caption,
and handles empty lines. `highlightCode` uses Shiki themes
`vesper` (dark) and `github-light-default` (light), removes a trailing newline,
adds language and line metadata, and caches deterministic output in an LRU.

### 3.5 Raw source loading and preview/code tabs

Complete source files:

- [`src/components/component-preview.tsx`](./src/components/component-preview.tsx)
- [`src/components/component-preview-tabs.tsx`](./src/components/component-preview-tabs.tsx)
- [`src/components/component-source.tsx`](./src/components/component-source.tsx)

The core source resolver is:

```tsx
const filePath: string | undefined =
  src ?? Index[name ?? ""]?.files[0]?.path

if (!filePath) return null

const code = fixImport(
  await fs.readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), filePath),
    "utf8"
  )
)
const language = path.extname(filePath).slice(1)
const highlightedCode = await highlightCode(code, language, {
  highlightedLines: parseHighlightedLines(codeMeta),
})

return (
  <CodeBlockFrame code={code} hasTitle={!!title}>
    <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  </CodeBlockFrame>
)
```

`ComponentPreviewTabs` looks up `Index[name]?.component`, where the generated
entry is a `React.lazy(async () => import(...))`. It renders Preview and Code
tabs, a suspense fallback, replay/remount controls, optional v0/customize
links, and the source component. Missing registry names render an explicit
“component not found” message rather than throwing a cryptic import error.

### 3.6 Registry generation and resolver

The complete generator is
[`src/scripts/build-registry.mts`](./src/scripts/build-registry.mts). It:

1. imports the authored registry;
2. validates it with `registrySchema.safeParse`;
3. writes a lazy `Index` entry for every item with files;
4. excludes `registry:example` entries from the published registry;
5. writes `registry.json` and lightweight counts;
6. writes the generated TypeScript index and block index;
7. delegates public `public/r/*.json` output to `shadcn build`.

[`src/lib/registry.ts`](./src/lib/registry.ts) validates index entries with
`registryItemSchema`, reads all files in parallel, fixes aliases, computes
default targets, and caches results in an LRU. `fixImport` normalizes nested
aliases such as `@/some-project/components/button` to the consuming project's
`@/components/button`.

### 3.7 TOC

The route calls:

```ts
const toc = getTableOfContents(doc.content)
```

This is intentionally computed from the MDX body, after frontmatter has been
removed. `remarkHeading` adds heading metadata during MDX compilation and
`rehypeSlug` creates matching IDs in rendered headings. The resulting TOC is
used by [`TOCInline`](./src/components/toc-inline.tsx) on small screens and
[`TOCMinimap`](./src/components/toc-minimap.tsx) on larger screens.
`toc.tsx` supplies the client-side `IntersectionObserver` anchor tracker.

## 4. Step-by-step blueprint for TanStack Router + Vite + Tailwind v4

1. Create `content/components/*.mdx` and `content/blog/*.mdx`. Keep the
   filename as the canonical kebab-case slug. Store demos/examples in
   `registry/examples` and shipped source in `registry/components`.
2. Define a typed metadata schema (`title`, `description`, dates, image,
   flags) and parse each file with `gray-matter`. Derive category from the
   directory and reject duplicate slugs during the build.
3. Add a Vite-side content index. For small sites, use
   `import.meta.glob("/content/**/*.mdx", { query: "?raw", import: "default" })`
   for raw text. For large sites, generate a JSON metadata manifest and lazy
   body modules at build time.
4. Add a single `getDocBySlug(category, slug)` helper. Return a discriminated
   result (`found`/`notFound`) rather than silently falling back to an empty
   document.
5. Configure MDX compilation with `remark-gfm`, a code-import remark plugin,
   heading extraction, `rehype-slug`, external-link handling, raw-code
   preservation, `rehype-pretty-code`, and the package-manager transform.
   Avoid compiling MDX in the browser when server/build compilation is
   possible.
6. Register the MDX component map once. Map headings, tables, `pre`, `code`,
   `ComponentPreview`, `ComponentSource`, `CodeTabs`, `Steps`, and callouts.
   Pass only explicitly approved components and typed props.
7. Implement `routes/components/$slug.tsx`. The loader resolves and validates
   the slug, returns metadata/body/TOC, and throws TanStack's not-found
   response for invalid or wrong-category slugs. Use `head`/route metadata
   integration for title, description, canonical, Open Graph, and JSON-LD.
8. Implement TOC extraction from the same heading AST used to render the body.
   Ensure heading IDs and TOC URLs are generated by the same slug algorithm.
9. Implement the code pipeline in this order: capture raw source, highlight,
   attach raw source and line metadata, then render the mapped `pre`. Never
   recover copy text by scraping highlighted HTML.
10. Implement `ComponentSource` as a server/build-time file reader. Enforce a
    registry-root boundary before resolving explicit `src` paths to prevent
    path traversal. Normalize aliases before display.
11. Generate the registry index with `React.lazy` imports. Keep demo entries
    separate from published entries, validate with Zod, and fail the build on
    invalid registry data.
12. Add Tailwind v4 styles for prose, code frames, highlighted lines,
    responsive preview tabs, and the TOC. Put client-only behavior (tabs,
    copy, package manager preference, intersection observers) behind client
    components.
13. Test duplicate/missing slugs, malformed frontmatter, headings with
    punctuation, empty code lines, explicit source files, missing registry
    names, package-manager conversion, and production chunk output.
14. Build the content manifest and registry before the application build, and
    run type checking, linting, registry validation, and a production preview.

## 5. Key pitfalls and gotchas avoided

- **Hardcoded MDX imports:** filesystem discovery means a new document is
  available after a build without editing a route import map.
- **Category collisions:** category comes from the directory and routes verify
  it, so a blog slug cannot accidentally render as a component.
- **Invalid slugs:** static params plus `dynamicParams = false` prevent
  arbitrary dynamic rendering and return a real 404.
- **Frontmatter leaking into content:** `gray-matter` removes YAML before TOC
  extraction and MDX compilation.
- **SEO drift:** metadata, canonical URLs, Open Graph, Twitter cards, dates,
  breadcrumbs, and JSON-LD all use the same parsed document object.
- **Broken heading links:** `rehype-slug`, `remarkHeading`, and the TOC are
  configured together.
- **Copying highlighted markup:** raw source is preserved before Shiki changes
  the AST, so copy buttons receive exact source text.
- **Empty code lines disappearing:** empty lines are replaced by a space before
  grid-based rendering.
- **Install command duplication:** one npm command is transformed into pnpm,
  yarn, npm, and bun variants, with a persisted package-manager preference.
- **Source snippets going stale:** `ComponentSource` reads the actual registry
  file and highlights it at render/build time rather than duplicating source
  inside MDX.
- **Unbounded source access:** registry resolution and path normalization
  centralize file lookup; a Vite port should additionally enforce an explicit
  source-root boundary for every `src` prop.
- **Bundle bloat:** generated registry entries use `React.lazy` and dynamic
  imports; previews load their demo chunk behind `Suspense`.
- **Generated-file edits:** registry JSON and `__index__.tsx` are build
  outputs, not authoring surfaces.
- **Unsafe MDX scope:** only the allow-listed component map is passed to
  `MDXRemote`; arbitrary values are not injected into MDX scope.
- **Server/client confusion:** filesystem reads, metadata, TOC generation, and
  highlighting remain server/build work; tabs, copy buttons, replay, and
  intersection observers are client work.
- **Vite portability trap:** Next's `next-mdx-remote/rsc`, `notFound()`,
  `PageProps`, and App Router metadata APIs cannot be copied verbatim into
  TanStack Router. Port the data contracts and transform order, then replace
  framework-specific adapters.
