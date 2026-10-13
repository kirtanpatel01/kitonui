import { Button } from "@/components/ui/button"

interface ButtonShowcaseSectionProps {
  installCmd?: string
}

const DEFAULT_BUTTON_INSTALL_CMD = "pnpm dlx shadcn add kirtanpatel01/kitonui/button"

export function ButtonShowcaseSection({
  installCmd = DEFAULT_BUTTON_INSTALL_CMD,
}: ButtonShowcaseSectionProps) {
  return (
    <section className="px-6 py-12 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl transition-colors">
        <div className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-mono font-medium text-primary">
              registry:ui
            </span>
            <h2 className="text-lg font-bold text-card-foreground tracking-tight">Button component</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Base UI accessible primitive supporting keyboard navigation and variant styling.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>Install command:</span>
          <span className="font-mono text-foreground">{installCmd}</span>
        </div>
      </div>
    </section>
  )
}
