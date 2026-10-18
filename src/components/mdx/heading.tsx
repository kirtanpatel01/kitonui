"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function HeadingAnchor({ id }: { id?: string }) {
  if (!id) return null
  return (
    <a
      href={`#${id}`}
      aria-label="Link to section"
      className="ml-2 inline-flex opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-muted-foreground/60 hover:text-foreground"
    >
      #
    </a>
  )
}

export function Heading({
  as: Component = "h2",
  id,
  className,
  children,
  ...props
}: {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  id?: string
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const styles = {
    h1: "font-logo text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
    h2: "group font-logo text-2xl font-bold tracking-tight text-foreground pt-8 pb-2 border-b border-border/40 scroll-m-20 first:pt-0",
    h3: "group font-logo text-xl font-semibold tracking-tight text-foreground pt-6 pb-2 scroll-m-20",
    h4: "group font-logo text-lg font-semibold tracking-tight text-foreground pt-4 pb-1 scroll-m-20",
    h5: "group font-logo text-base font-semibold tracking-tight text-foreground pt-3 scroll-m-20",
    h6: "group font-logo text-sm font-semibold tracking-tight text-foreground pt-2 scroll-m-20",
  }

  return (
    <Component id={id} className={cn(styles[Component], className)} {...props}>
      {children}
      {Component !== "h1" && <HeadingAnchor id={id} />}
    </Component>
  )
}
