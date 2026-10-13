import Section from "@/components/layout/section"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: HomePage })

const REGISTRY_ITEMS = [
  {
    name: "image-loader",
    title: "Image Loader",
    badge: "registry:ui",
    description:
      "An interactive canvas-based pixel grid image generation loader effect.",
    tag: "Canvas • Animation",
    command: "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader",
  },
  {
    name: "image-loader",
    title: "Image Loader",
    badge: "registry:ui",
    description:
      "An interactive canvas-based pixel grid image generation loader effect.",
    tag: "Canvas • Animation",
    command: "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader",
  },
  {
    name: "image-loader",
    title: "Image Loader",
    badge: "registry:ui",
    description:
      "An interactive canvas-based pixel grid image generation loader effect.",
    tag: "Canvas • Animation",
    command: "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader",
  },
]

function HomePage() {
  return (
    <main className="min-h-screen">
      <Section>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Components
        </h2>
      </Section>

      <Section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {REGISTRY_ITEMS.map((item) => (
          <Link
            key={item.name}
            to="/components/$componentName"
            params={{ componentName: item.name }}
            className="p-4 rounded-xl bg-accent"
          >
            <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </Section>
    </main>
  )
}
