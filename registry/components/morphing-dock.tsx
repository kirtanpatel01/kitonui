"use client"

import * as React from "react"
import { useRef, useState, createContext, useContext } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

export interface DockItemData {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  badge?: string | number
  shortcut?: string
  isSeparator?: boolean
}

interface DockContextType {
  mouseX: ReturnType<typeof useMotionValue<number>>
  magnification: number
  distance: number
  activeId?: string
  setActiveId: (id: string) => void
}

const DockContext = createContext<DockContextType | null>(null)

export interface MorphingDockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: DockItemData[]
  defaultActiveId?: string
  magnification?: number // Max scale factor (default: 1.4)
  distance?: number // Cursor proximity range in px (default: 120)
  direction?: "top" | "bottom"
  className?: string
  onSelect?: (item: DockItemData) => void
}

export function MorphingDock({
  items,
  defaultActiveId,
  magnification = 1.35,
  distance = 110,
  direction = "bottom",
  className,
  onSelect,
  ...props
}: MorphingDockProps) {
  const mouseX = useMotionValue(Infinity)
  const [activeId, setActiveId] = useState<string>(defaultActiveId || items.find((i) => !i.isSeparator)?.id || "")

  return (
    <DockContext.Provider
      value={{
        mouseX,
        magnification,
        distance,
        activeId,
        setActiveId: (id) => {
          setActiveId(id)
          const matched = items.find((i) => i.id === id)
          if (matched) onSelect?.(matched)
        },
      }}
    >
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "relative flex items-center gap-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/85 px-2.5 py-2 shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-200",
          className
        )}
        {...props}
      >
        {items.map((item, idx) =>
          item.isSeparator ? (
            <div
              key={`sep-${idx}`}
              className="mx-1 h-6 w-px bg-zinc-800"
              aria-hidden="true"
            />
          ) : (
            <DockIcon key={item.id} item={item} direction={direction} />
          )
        )}
      </div>
    </DockContext.Provider>
  )
}

function DockIcon({
  item,
  direction = "bottom",
}: {
  item: DockItemData
  direction?: "top" | "bottom"
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const context = useContext(DockContext)
  const [hovered, setHovered] = useState(false)

  if (!context) return null
  const { mouseX, magnification, distance, activeId, setActiveId } = context

  // Measure distance from cursor to icon center
  const bounds = useTransform(mouseX, (val) => {
    const el = ref.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return val - rect.left - rect.width / 2
  })

  const baseSize = 40
  const maxSize = baseSize * magnification

  const widthSync = useTransform(bounds, [-distance, 0, distance], [baseSize, maxSize, baseSize])
  const width = useSpring(widthSync, {
    mass: 0.12,
    stiffness: 200,
    damping: 16,
  })

  const isActive = activeId === item.id

  const handleClick = () => {
    setActiveId(item.id)
    item.onClick?.()
  }

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-xl transition-colors outline-none",
        isActive
          ? "text-zinc-100"
          : "text-zinc-400 hover:text-zinc-200"
      )}
      aria-label={item.label}
    >
      {/* Morphing active backdrop pill */}
      {isActive && (
        <motion.div
          layoutId="dock-active-pill"
          className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.08] shadow-sm"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}

      {/* Floating Shortcut Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: direction === "bottom" ? -6 : 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === "bottom" ? -3 : 3, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "pointer-events-none absolute left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900/95 px-2.5 py-1 text-xs font-medium text-zinc-100 shadow-xl backdrop-blur-md",
              direction === "bottom" ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px]">{item.label}</span>
              {item.shortcut && (
                <kbd className="rounded border border-zinc-700/60 bg-zinc-800/80 px-1 py-0.5 text-[9px] font-mono text-zinc-300">
                  {item.shortcut}
                </kbd>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center pointer-events-none text-current">
        {item.icon}
      </div>

      {/* Subtle Badge */}
      {item.badge !== undefined && (
        <span className="absolute -top-1 -right-1 z-20 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-zinc-100 px-1 text-[8px] font-bold text-zinc-900 shadow">
          {item.badge}
        </span>
      )}

      {/* Bottom active dot indicator */}
      {isActive && (
        <motion.div
          layoutId="dock-active-dot"
          className="absolute bottom-1 h-1 w-1 rounded-full bg-zinc-200"
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        />
      )}
    </motion.button>
  )
}
