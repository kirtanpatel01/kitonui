import { useState, useEffect } from "react"
import { Within } from "@/components/ui/within"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
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
    <Within
      toggled={mounted ? isDark : undefined}
      onClick={handleToggle}
      className="flex items-center justify-center size-7 rounded-full border border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-all shadow-xs cursor-pointer text-base"
    />
  )
}
