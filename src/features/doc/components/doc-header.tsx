import type { DocMetadata } from "@/types/document"

export function DocHeader({
  title,
  metadata,
}: {
  title: string
  metadata?: DocMetadata
}) {
  return (
    <div className="space-y-3 pb-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-logo text-3xl font-extrabold tracking-tight text-foreground capitalize sm:text-4xl">
          {metadata?.title ?? title}
        </h1>
        {metadata?.badge && (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
            {metadata.badge}
          </span>
        )}
      </div>
      {metadata?.description && (
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {metadata.description}
        </p>
      )}
    </div>
  )
}
