import { Link } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DocNeighbors } from "@/types/document"

export function DocPagination({ neighbors }: { neighbors: DocNeighbors }) {
  const { previous, next } = neighbors

  if (!previous && !next) {
    return null
  }

  return (
    <nav
      aria-label="Documentation pagination"
      className="flex items-center justify-between border-t border-border/40 pt-8 mt-12"
    >
      {previous ? (
        <Link
          to="/components/$componentName"
          params={{ componentName: previous.slug }}
          className="group flex flex-col items-start gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="font-semibold text-foreground capitalize">
            {previous.title || previous.slug.replace(/-/g, " ")}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to="/components/$componentName"
          params={{ componentName: next.slug }}
          className="group flex flex-col items-end gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto text-right"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
            Next
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-semibold text-foreground capitalize">
            {next.title || next.slug.replace(/-/g, " ")}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
