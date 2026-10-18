import { createFileRoute, Link } from "@tanstack/react-router"
import Section from "@/components/layout/section"
import { CodeBlock } from "@/components/code-block"
import { getAllComponentDocs } from "@/lib/docs"
import { ArrowUpRight, Sparkles } from "lucide-react"

export const Route = createFileRoute("/")({ component: HomePage })

const EXAMPLE_CODE = `import { PulseRadar } from "@/components/ui/pulse-radar"
import { MorphingDock } from "@/components/ui/morphing-dock"
import { GlyphScrambler } from "@/components/ui/glyph-scrambler"
import { PrismCard } from "@/components/ui/prism-card"

export function App() {
  return (
    <div className="flex flex-col gap-6">
      <GlyphScrambler text="p99: 12.4ms across 34 edge regions" />
      <PrismCard metallicSheen borderGlow>
        <h3>Hardware Attestation Key</h3>
      </PrismCard>
    </div>
  )
}`

function HomePage() {
  const components = getAllComponentDocs()

  return (
    <main className="min-h-screen space-y-12 pb-20">
      {/* Hero Section */}
      <Section className="pt-12 sm:pt-16">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 font-mono text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Tactile micro-interactions and UI blocks</span>
          </div>
          <h1 className="font-logo text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Craft-driven components for the web.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Copy and paste interactive React components built with Motion and Tailwind CSS. Built with spring physics, canvas rendering, and zero-configuration MDX documentation.
          </p>
        </div>
      </Section>

      {/* Components Grid */}
      <Section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Components ({components.length})
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            Auto-Discovered Registry
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {components.map(({ slug, frontmatter }) => (
            <Link
              key={slug}
              to="/components/$componentName"
              params={{ componentName: slug }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
                    {frontmatter.badge || "registry:ui"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h3 className="font-logo text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {frontmatter.title || slug.replace(/-/g, " ")}
                </h3>

                {frontmatter.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {frontmatter.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 group-hover:text-foreground">
                <span>View component</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CodeBlock Showcase */}
      <Section className="space-y-4 pt-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Zero-Config Installation
          </h2>
          <p className="text-sm text-muted-foreground">
            Copy components or add them directly with the Shadcn CLI.
          </p>
        </div>

        <div className="max-w-2xl">
          <CodeBlock
            path="src/components/example.tsx"
            code={EXAMPLE_CODE}
          />
        </div>
      </Section>
    </main>
  )
}
