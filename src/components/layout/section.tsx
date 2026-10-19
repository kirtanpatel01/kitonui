import { cn } from "cn"
import React from 'react'

function Section({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <section className={cn("w-full max-w-7xl mx-auto px-4 min-[84rem]:px-0", className)}>
        {children}
    </section>
  )
}

export default Section