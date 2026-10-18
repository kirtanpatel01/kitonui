import { createFileRoute, Link } from "@tanstack/react-router"
import Section from "@/components/layout/section"
import { CodeBlock } from "@/components/code-block"
import { getComponentSlugs } from "@/lib/docs"

export const Route = createFileRoute("/")({ component: HomePage })

const EXAMPLE_CODE = `import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="default" size="sm">
      Get Started
    </Button>
  )
}`

function HomePage() {
  const componentSlugs = getComponentSlugs()

  return (
    <main className="min-h-screen space-y-12 pb-16">
      <Section className="pt-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Components
        </h2>
      </Section>

      <Section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {componentSlugs.map((slug) => (
          <Link
            key={slug}
            to="/components/$componentName"
            params={{ componentName: slug }}
            className="group p-4 rounded-xl bg-accent hover:bg-accent/70 transition-colors"
          >
            <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary capitalize">
              {slug.replace(/-/g, " ")}
            </h3>
          </Link>
        ))}
      </Section>

      {/* CodeBlock Showcase */}
      <Section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Code Block
          </h2>
          <p className="text-sm text-muted-foreground">
            Standalone code block with file path header, copy action, and syntax highlighting.
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
