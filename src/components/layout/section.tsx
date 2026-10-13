import { cn } from '@/lib/utils'
import React from 'react'

function Section({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <section className={cn("px-4 pt-2 w-full max-w-7xl mx-auto", className)}>
        {children}
    </section>
  )
}

export default Section