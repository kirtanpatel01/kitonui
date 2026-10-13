import { useState, useEffect } from "react"
import { GitHubIcon } from "@/components/icons"
import { Within } from "@/components/ui/within"
// import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Link } from "@tanstack/react-router"

// const NAV_LINKS = [
//   { label: "Components", href: "#components" },
//   { label: "How it works", href: "#how-it-works" },
//   { label: "FAQ", href: "#faq" },
// ]

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
    <header className="w-full pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center">
      <nav
        aria-label="Primary navigation"
        className="pointer-events-auto flex w-full items-center justify-between gap-6 px-4"
      >
        <Link to="/" className="flex items-center">
          <img
            src="/kitonui-icon.svg"
            alt="Kiton UI icon"
            className="size-10 fill-foreground"
          />
          <span className="font-logo text-2xl font-semibold tracking-tighter text-foreground">
            kitonui
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              render={<Link to={link.href} />}
            >
              {link.label}
            </Button>
          ))} */}
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
    </header>
  )
}
