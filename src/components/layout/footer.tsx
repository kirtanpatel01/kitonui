export function Footer() {
  return (
    <footer className="relative bottom-0 w-full text-center overflow-hidden shadow-[iinset_0_24px_50px_-10px_var(--color-primary)] border-t border-primary/20 bg-chart-1/8 dark:bg-background pt-8 transition-all duration-300">
        {/* <div className="pointer-events-none absolute -top-28 left-1/2 h-66 w-full -translate-x-1/2 rounded-full bg-chart-1/25 blur-3xl" /> */}
        <div className="pointer-events-none absolute -bottom-28 left-1/2 h-66 w-full -translate-x-1/2 rounded-full bg-chart-1/15 blur-3xl" />
        <img
          src="/kitonui-icon.svg"
          alt="Kiton UI logo"
          className="mx-auto size-56"
        />
        <h2
          style={{ textWrap: "balance" }}
          className="font-logo relative text-3xl font-extrabold tracking-widest sm:text-[14rem] leading-39 bg-linear-to-b from-chart-5 dark:from-primary via-chart-2 dark:via-emerald-900 to-chart-1 dark:to-black/50 text-transparent bg-clip-text"
        >
          KitonUI
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
    </footer>
  )
}
