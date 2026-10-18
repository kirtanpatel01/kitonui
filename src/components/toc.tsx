"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  title: string
  level: number
}

export function useTableOfContents() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Collect all h2 and h3 elements with IDs inside main content
    const elements = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        "main h2[id], main h3[id], article h2[id], article h3[id]"
      )
    )

    const tocItems: TocItem[] = elements.map((el) => ({
      id: el.id,
      title: el.innerText.replace(/#/g, "").trim(),
      level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
    }))

    setItems(tocItems)

    if (elements.length === 0) return

    // Setup intersection observer to track which heading is currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0% -70% 0%",
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return { items, activeId }
}

export function TableOfContents({ className }: { className?: string }) {
  const { items, activeId } = useTableOfContents()

  if (items.length === 0) {
    return null
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const topOffset = 80 // Account for sticky navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - topOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      window.history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-mono text-xs font-semibold tracking-wider text-foreground/80 uppercase">
        On This Page
      </p>
      <nav className="flex flex-col space-y-1.5 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "block text-muted-foreground transition-colors hover:text-foreground",
                item.level === 3 ? "pl-4 text-xs" : "font-medium",
                isActive && "font-semibold text-primary"
              )}
            >
              {item.title}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
