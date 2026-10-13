import { useState } from "react"
import { CheckIcon, CopyIcon, TerminalIcon } from "@/components/icons"
import { Button } from "../ui/button"

interface HeroSectionProps {
  installCmd?: string
}

const DEFAULT_INSTALL_CMD =
  "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader"

export function HeroSection({
  installCmd = DEFAULT_INSTALL_CMD,
}: HeroSectionProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pt-14 pb-16 text-center">
      <h1
        style={{ textWrap: "balance" }}
        className="mx-auto mt-6 max-w-[680px] text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-6xl"
      >
        Add animated UI components directly with shadcn CLI
      </h1>

      <p
        style={{ textWrap: "pretty" }}
        className="mx-auto mt-5 max-w-[680px] text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        Inspect the live canvas loader below. Install the component into your
        repository with one terminal command and retain complete control of your
        source code.
      </p>

      {/* Primary Action Terminal Bar */}
      <div className="mx-auto mt-8 flex w-fit items-center rounded-full border">
        <div className="flex items-center gap-1 overflow-hidden font-mono text-sm text-muted-foreground">
          <TerminalIcon className="size-4 shrink-0 text-primary ml-3" />
          <span className="truncate text-foreground ">{installCmd}</span>
        </div>
        <Button
          type="button"
          size={"icon"}
          variant={"ghost"}
          onClick={copyToClipboard}
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-primary" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </Button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span>Zero runtime build dependencies</span>
        <span>•</span>
        <span>Tailwind CSS version 4 ready</span>
        <span>•</span>
        <span>MIT license</span>
      </div>
    </section>
  )
}
