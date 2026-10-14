import { useState, useEffect } from "react"
import { GitHubIcon } from "@/components/icons"
import { Within } from "@/components/ui/within"
import { useTheme } from "@/components/theme-provider"
import { Link } from "@tanstack/react-router"
import Section from "./section"

export function Navbar() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateIsDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    updateIsDark()
    const observer = new MutationObserver(updateIsDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const handleToggle = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    setTheme(nextDark ? "dark" : "light")
  }

  return (
    <header className="pointer-events-none sticky inset-x-0 top-0 z-40 flex w-full justify-center border-b border-chart-3/7 bg-primary/2 py-2 backdrop-blur-md">
      <Section>
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex w-full items-center justify-between gap-6"
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/kitonui-icon.svg"
              alt="Kiton UI icon"
              className="size-8 fill-foreground"
            />
            <span className="font-logo text-3xl font-semibold tracking-tighter text-foreground">
              kitonui
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={"https://github.com/kirtanpatel01/kitonui"}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon className="size-7" />
            </a>
            <Within
              toggled={mounted ? isDark : undefined}
              onClick={handleToggle}
              size={24}
              duration={700}
            />
          </div>
        </nav>
      </Section>
    </header>
  )
}
