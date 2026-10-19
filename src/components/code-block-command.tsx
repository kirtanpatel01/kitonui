"use client"

import { useMemo, useId } from "react"
import { ScrollArea } from "@base-ui/react/scroll-area"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { TerminalIcon, TextAlignStartIcon } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "cn"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tabs"
import { CopyButton } from "@/components/copy-button"
import { IconSwap, IconSwapItem } from "@/components/icon-swap"
import {
  BunIcon,
  NpmIcon,
  PnpmIcon,
  YarnIcon,
} from "@/components/registry-command-copy"

export type PackageManager = "prompt" | "pnpm" | "yarn" | "npm" | "bun"

const packageManagerAtom = atomWithStorage<PackageManager>(
  "packageManager",
  "pnpm"
)

export function usePackageManager() {
  return useAtom(packageManagerAtom)
}

/**
 * Props for the CodeBlockCommand component.
 */
export type CodeBlockCommandProps = {
  /**
   * Shorthand command (e.g. "npx shadcn add ...") automatically converted for npm, pnpm, yarn, and bun.
   */
  command?: string
  /**
   * Natural language instruction for AI agents to install a package or component.
   */
  prompt?: string
  /**
   * Command to execute with pnpm package manager.
   */
  pnpm?: string

  /**
   * Command to execute with yarn package manager.
   */
  yarn?: string

  /**
   * Command to execute with npm package manager.
   */
  npm?: string

  /**
   * Command to execute with bun package manager.
   */
  bun?: string

  /**
   * Additional CSS class names.
   */
  className?: string

  /**
   * Callback invoked when a command is successfully copied to clipboard.
   *
   * Receives an object containing the selected package manager and the copied command text.
   * Useful for tracking user interactions or showing custom success notifications.
   *
   * @param data - Object containing copy operation details
   * @param data.packageManager - The package manager that was selected when copying
   * @param data.command - The actual command text that was copied
   *
   * @example
   * ```tsx
   * <CodeBlockCommand
   *   pnpm="pnpm add react"
   *   onCopySuccess={({ packageManager, command }) => {
   *     console.log(`Copied ${command} for ${packageManager}`)
   *   }}
   * />
   * ```
   */
  onCopySuccess?: (data: {
    packageManager: PackageManager
    command: string
  }) => void

  /**
   * Callback invoked when copying to clipboard fails.
   *
   * Receives the error object for debugging or showing custom error messages.
   *
   * @param error - The error that occurred during the copy operation
   *
   * @example
   * ```tsx
   * <CodeBlockCommand
   *   pnpm="pnpm add react"
   *   onCopyError={(error) => {
   *     console.error('Copy failed:', error)
   *   }}
   * />
   * ```
   */
  onCopyError?: (error: Error) => void
}

const PM_THEMES: Record<
  PackageManager,
  {
    primary: string
    indicator: string
    bg: string
    headerBg: string
    contentBg: string
  }
> = {
  pnpm: {
    primary: "var(--pnpm-color, #b46b00)",
    indicator: "#f8ab00",
    bg: "var(--pnpm-bg, rgba(248, 171, 0, 0.14))",
    headerBg: "var(--pnpm-header-bg, rgba(248, 171, 0, 0.08))",
    contentBg: "var(--pnpm-content-bg, rgba(248, 171, 0, 0.18))",
  },
  npm: {
    primary: "var(--npm-color, #a61c1b)",
    indicator: "#cb3837",
    bg: "var(--npm-bg, rgba(203, 56, 55, 0.12))",
    headerBg: "var(--npm-header-bg, rgba(203, 56, 55, 0.08))",
    contentBg: "var(--npm-content-bg, rgba(203, 56, 55, 0.16))",
  },
  bun: {
    primary: "var(--bun-color, #70451a)",
    indicator: "var(--bun-indicator, #d49a5b)",
    bg: "var(--bun-bg, rgba(135, 92, 46, 0.10))",
    headerBg: "var(--bun-header-bg, rgba(135, 92, 46, 0.06))",
    contentBg: "var(--bun-content-bg, rgba(135, 92, 46, 0.14))",
  },
  yarn: {
    primary: "var(--yarn-color, #1a6f96)",
    indicator: "#2c8ebb",
    bg: "var(--yarn-bg, rgba(44, 142, 187, 0.12))",
    headerBg: "var(--yarn-header-bg, rgba(44, 142, 187, 0.08))",
    contentBg: "var(--yarn-content-bg, rgba(44, 142, 187, 0.16))",
  },
  prompt: {
    primary: "var(--primary)",
    indicator: "var(--primary)",
    bg: "oklch(from var(--primary) l c h / 0.12)",
    headerBg: "oklch(from var(--primary) l c h / 0.08)",
    contentBg: "oklch(from var(--primary) l c h / 0.16)",
  },
}

export function CodeBlockCommand({
  command,
  prompt,
  pnpm,
  yarn,
  npm,
  bun,
  className,
  onCopySuccess,
  onCopyError,
}: CodeBlockCommandProps) {
  const reactId = useId()
  const instanceId = useMemo(() => {
    if (command) {
      return `cmd-${command.replace(/[^a-zA-Z0-9_-]/g, "_")}`
    }
    return `pm-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  }, [command, reactId])
  const [packageManager, setPackageManager] = usePackageManager()

  const converted = useMemo(() => {
    return command ? convertNpmCommand(command) : null
  }, [command])

  const tabs = useMemo(() => {
    return {
      prompt,
      pnpm: pnpm ?? converted?.pnpm,
      yarn: yarn ?? converted?.yarn,
      npm: npm ?? converted?.npm,
      bun: bun ?? converted?.bun,
    }
  }, [prompt, pnpm, yarn, npm, bun, converted])

  const tabsFiltered = useMemo(
    () => Object.entries(tabs).filter(([, value]) => !!value),
    [tabs]
  )

  const currentTheme = PM_THEMES[packageManager] ?? PM_THEMES.pnpm

  return (
    <div
      className={cn(
        "w-fit max-w-full relative overflow-hidden rounded-xl border-none shadow-none transition-colors duration-200",
        className,
        "[--bun-color:#6c4015] dark:[--bun-color:#fbf0df] dark:[--bun-indicator:#fbf0df] dark:[--bun-bg:rgba(251,240,223,0.10)] dark:[--bun-header-bg:rgba(251,240,223,0.06)] dark:[--bun-content-bg:rgba(251,240,223,0.15)]",
        "[--yarn-color:#16658a] dark:[--yarn-color:#a5d8f3] dark:[--yarn-bg:rgba(44,142,187,0.12)] dark:[--yarn-header-bg:rgba(44,142,187,0.08)] dark:[--yarn-content-bg:rgba(44,142,187,0.16)]"
      )}
      style={{
        backgroundColor: currentTheme.bg,
      }}
    >
      <Tabs
        className="gap-0 border-none"
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as PackageManager)
        }}
      >
        <ScrollArea.Root
          className="w-full border-none pr-10 shadow-none transition-colors duration-200"
          style={{
            backgroundColor: currentTheme.headerBg,
          }}
        >
          <TabsList
            className={cn(
              "h-10 max-w-full justify-start rounded-none bg-transparent p-0 pl-4 inset-ring-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:shrink-0",
              "[--scroll-area-overflow-x-end:inherit] [--scroll-area-overflow-x-start:inherit]",
              "mask-linear-[to_right,transparent_0,black_min(2.5rem,var(--scroll-area-overflow-x-start)),black_calc(100%-min(2.5rem,var(--scroll-area-overflow-x-end,2.5rem))),transparent_100%]"
            )}
            render={<ScrollArea.Viewport />}
          >
            <div className="mr-2 flex size-4 shrink-0 items-center justify-center">
              <IconSwap>
                <IconSwapItem key={packageManager}>
                  {getIconForPackageManager(packageManager)}
                </IconSwapItem>
              </IconSwap>
            </div>

            {tabsFiltered.map(([key]) => {
              const isSelected = key === packageManager
              return (
                <TabsTrigger
                  key={key}
                  className={cn(
                    "relative flex h-10 items-center rounded-none p-0 px-2 font-mono transition-colors duration-200",
                    isSelected
                      ? "font-semibold"
                      : "opacity-40 hover:opacity-80"
                  )}
                  style={{
                    color: currentTheme.primary,
                  }}
                  value={key}
                >
                  {key}
                  {isSelected && (
                    <motion.div
                      initial={false}
                      layout="position"
                      layoutId={`active-tab-indicator-line-${instanceId}`}
                      className="absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-200"
                      style={{
                        backgroundColor: currentTheme.indicator,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        y: { duration: 0 },
                      }}
                    />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </ScrollArea.Root>

        {tabsFiltered.map(([key, value]) => {
          return (
            <TabsContent key={key} value={key} className="border-none">
              <pre
                data-pm={key}
                className="group/tabs-content-pre overscroll-x-contain p-4 leading-6 border-none transition-colors duration-200 not-data-[pm=prompt]:overflow-x-auto"
                style={{
                  backgroundColor: currentTheme.contentBg,
                }}
              >
                <code
                  data-slot="code-block"
                  data-language="bash"
                  className="font-mono text-sm/none transition-colors duration-200 group-data-[pm=prompt]/tabs-content-pre:whitespace-normal"
                  style={{
                    color: currentTheme.primary,
                  }}
                >
                  <span className="select-none opacity-50 group-data-[pm=prompt]/tabs-content-pre:hidden">
                    ${" "}
                  </span>
                  {value}
                </code>
              </pre>
            </TabsContent>
          )
        })}
      </Tabs>

      <CopyButton
        className="absolute top-2 right-2 z-10 size-6 rounded-md border-none opacity-70 hover:opacity-100 transition-[color,opacity] duration-200 [&_svg:not([class*='size-'])]:size-3.5"
        style={{
          color: currentTheme.primary,
        }}
        variant="ghost"
        size="icon-sm"
        text={tabs[packageManager] || ""}
        onCopySuccess={(copiedCommand) => {
          onCopySuccess?.({
            packageManager,
            command: copiedCommand,
          })
        }}
        onCopyError={onCopyError}
      />
    </div>
  )
}

function getIconForPackageManager(manager: PackageManager) {
  switch (manager) {
    case "prompt":
      return <TextAlignStartIcon />
    case "pnpm":
      return <PnpmIcon />
    case "yarn":
      return <YarnIcon />
    case "npm":
      return <NpmIcon />
    case "bun":
      return <BunIcon />
    default:
      return <TerminalIcon />
  }
}

/**
 * Result of converting an npm command to all package managers.
 */
export type ConvertNpmCommandResult = {
  /**
   * Command for pnpm package manager.
   */
  pnpm: string

  /**
   * Command for yarn package manager.
   */
  yarn: string

  /**
   * Command for npm package manager.
   */
  npm: string

  /**
   * Command for bun package manager.
   */
  bun: string
}

/**
 * Converts a standard npm command into equivalent commands for pnpm, yarn, npm,
 * and bun. The result can be spread directly into `CodeBlockCommand` props.
 *
 * Supported command patterns:
 * - `npm install <pkg>` -> add commands for each manager
 * - `npx create-<name>` -> create commands for each manager
 * - `npm create <name>` -> create commands for each manager
 * - `npx <command>` -> execute commands for each manager
 * - `npm run <script>` -> run commands for each manager
 *
 * Unrecognized commands are returned as-is for all package managers.
 *
 * @param npmCommand - A standard npm/npx command string.
 * @returns An object with `pnpm`, `yarn`, `npm`, and `bun` command strings.
 *
 * @example
 * ```tsx
 * import { CodeBlockCommand, convertNpmCommand } from "@/components/ncdai/code-block-command"
 *
 * <CodeBlockCommand {...convertNpmCommand("npx shadcn add button")} />
 * ```
 */
export function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  // npm install
  if (npmCommand.startsWith("npm install")) {
    return {
      pnpm: npmCommand.replaceAll("npm install", "pnpm add"),
      yarn: npmCommand.replaceAll("npm install", "yarn add"),
      npm: npmCommand,
      bun: npmCommand.replaceAll("npm install", "bun add"),
    }
  }

  // npx create- (must be checked before generic npx)
  if (npmCommand.startsWith("npx create-")) {
    return {
      pnpm: npmCommand.replace("npx create-", "pnpm create "),
      yarn: npmCommand.replace("npx create-", "yarn create "),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    }
  }

  // npm create
  if (npmCommand.startsWith("npm create")) {
    return {
      pnpm: npmCommand.replace("npm create", "pnpm create"),
      yarn: npmCommand.replace("npm create", "yarn create"),
      npm: npmCommand,
      bun: npmCommand.replace("npm create", "bun create"),
    }
  }

  // npx (general)
  if (npmCommand.startsWith("npx")) {
    return {
      pnpm: npmCommand.replace("npx", "pnpm dlx"),
      yarn: npmCommand.replace("npx", "yarn dlx"),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    }
  }

  // npm run
  if (npmCommand.startsWith("npm run")) {
    return {
      pnpm: npmCommand.replace("npm run", "pnpm"),
      yarn: npmCommand.replace("npm run", "yarn"),
      npm: npmCommand,
      bun: npmCommand.replace("npm run", "bun"),
    }
  }

  return {
    pnpm: npmCommand,
    yarn: npmCommand,
    npm: npmCommand,
    bun: npmCommand,
  }
}
