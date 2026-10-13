interface CtaSectionProps {
  installCmd?: string
}

const DEFAULT_INSTALL_CMD =
  "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader"

export function CtaSection({
  installCmd = DEFAULT_INSTALL_CMD,
}: CtaSectionProps) {
  void installCmd

  return (
    <section className="w-full px-6 py-20 text-center">
      <div className="relative overflow-hidden rounded-2xl border-x-[1px] border-primary/10 bg-secondary/10 dark:bg-card p-8 shadow-2xs inset-shadow-xs inset-shadow-chart-4/20 transition-colors sm:p-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <img
          src="/kitonui-icon.svg"
          alt="Kiton UI logo"
          className="mx-auto mb-5 size-24"
        />
        <h2
          style={{ textWrap: "balance" }}
          className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl"
        >
          Ready to use kitonui components?
        </h2>

        {/* <Button
          variant="outline"
          size="sm"
          className={"mt-2"}
          render={
            <a
              href="https://github.com/kirtanpatel01/kitonui"
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          <GitHubIcon className="size-4" />
          <span>View on GitHub</span>
        </Button> */}
      </div>
    </section>
  )
}
