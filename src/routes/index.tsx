import { createFileRoute, Link } from "@tanstack/react-router"
import Section from "@/components/layout/section"
import { getAllComponentDocs } from "@/lib/docs"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  const components = getAllComponentDocs()

  return (
    <main className="min-h-[calc(100vh-140px)] py-8 sm:py-12">
      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {components.map(({ slug, frontmatter }) => (
            <Link
              key={slug}
              to="/components/$componentName"
              params={{ componentName: slug }}
              className="flex flex-col justify-between rounded-xl border border-border/50 bg-card p-5 transition-colors hover:bg-muted/40"
            >
              <div className="space-y-2">
                <h3 className="font-logo text-xl font-bold tracking-tight text-foreground">
                  {frontmatter.title || slug.replace(/-/g, " ")}
                </h3>

                {frontmatter.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {frontmatter.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  )
}

export default HomePage
