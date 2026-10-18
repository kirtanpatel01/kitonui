import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Section from "@/components/layout/section"
import { TableOfContents } from "@/components/toc"

export function DocBreadcrumbs({
  title,
  category = "Components",
}: {
  title: string
  category?: string
}) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/" />}>{category}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function DocLayout({
  breadcrumbs,
  children,
  toc = true,
}: {
  breadcrumbs?: React.ReactNode
  children: React.ReactNode
  toc?: boolean
}) {
  return (
    <main className="min-h-screen py-6 sm:py-8">
      <Section>
        {breadcrumbs}

        <div className="flex gap-12 xl:gap-16">
          {/* Main Content Column */}
          <article className="min-w-0 flex-1 space-y-6">
            {children}
          </article>

          {/* Sticky TOC Column */}
          {toc && (
            <aside className="hidden xl:block xl:w-56 xl:shrink-0">
              <div className="sticky top-24">
                <TableOfContents />
              </div>
            </aside>
          )}
        </div>
      </Section>
    </main>
  )
}
