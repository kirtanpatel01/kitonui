export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-16 max-w-5xl mx-auto">
      <div className="text-center max-w-[680px] mx-auto mb-12">
        <h2 style={{ textWrap: "balance" }} className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          How to install in three steps
        </h2>
        <p style={{ textWrap: "pretty" }} className="mt-2 text-sm text-muted-foreground">
          No npm package publishing wait times. Components copy directly to your filesystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-md hover:border-primary/50 transition-colors">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            1
          </span>
          <h3 className="font-semibold text-base text-foreground">Run the CLI command</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Execute shadcn add with the GitHub path. The CLI pulls the source code directly from git.
          </p>
          <div className="rounded border border-border bg-muted p-2 font-mono text-xs text-foreground truncate">
            pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-md hover:border-primary/50 transition-colors">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            2
          </span>
          <h3 className="font-semibold text-base text-foreground">Inspect your components directory</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The file arrives inside your components directory. You can edit the canvas dimensions, tweak easing, or restyle classes.
          </p>
          <div className="rounded border border-border bg-muted p-2 font-mono text-xs text-foreground truncate">
            src/components/ui/image-loader.tsx
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-md hover:border-primary/50 transition-colors">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            3
          </span>
          <h3 className="font-semibold text-base text-foreground">Compose in your application</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Import and render inside any image container. The component automatically adjusts to the parent container dimensions.
          </p>
          <div className="rounded border border-border bg-muted p-2 font-mono text-xs text-foreground truncate">
            &lt;ImageGenerationLoader /&gt;
          </div>
        </div>
      </div>
    </section>
  )
}
