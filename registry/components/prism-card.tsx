"use client"

import * as React from "react"
import { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "cn"

export interface PrismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number // maximum rotation degrees (default: 14)
  glareOpacity?: number // 0 to 1 (default: 0.25)
  metallicSheen?: boolean // enable monochromatic specular reflection
  borderGlow?: boolean // enable cursor-following border highlight
  scaleOnHover?: number // scale multiplier on hover (default: 1.02)
  children?: React.ReactNode
}

export function PrismCard({
  maxTilt = 14,
  glareOpacity = 0.25,
  metallicSheen = true,
  borderGlow = true,
  scaleOnHover = 1.015,
  children,
  className,
  ...props
}: PrismCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for normalized cursor position [-0.5, 0.5]
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics configuration
  const springConfig = { damping: 22, stiffness: 200, mass: 0.15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Derive 3D rotation angles
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt])

  // Derive cursor pixel positions for radial glare
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [sheenAngle, setSheenAngle] = useState(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      const normX = clientX / rect.width - 0.5
      const normY = clientY / rect.height - 0.5

      x.set(normX)
      y.set(normY)

      const px = Math.round((clientX / rect.width) * 100)
      const py = Math.round((clientY / rect.height) * 100)
      setGlarePos({ x: px, y: py })

      const angle = (Math.atan2(normY, normX) * 180) / Math.PI + 180
      setSheenAngle(angle)
    },
    [x, y]
  )

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      style={{ perspective: 1100 }}
      className="inline-block w-full max-w-sm select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{ duration: 0.18 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-foreground shadow-2xl backdrop-blur-xl transition-shadow duration-300",
          isHovered && "shadow-[0_24px_48px_rgba(0,0,0,0.6)]",
          className
        )}
        {...(props as any)}
      >
        {/* Hairline Border Glow following the cursor */}
        {borderGlow && isHovered && (
          <div
            style={{
              background: `radial-gradient(280px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.18), transparent 70%)`,
            }}
            className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-200 z-30"
          />
        )}

        {/* Specular Glare Spot */}
        {isHovered && (
          <div
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 65%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay transition-opacity duration-150"
          />
        )}

        {/* Monochromatic Brushed Titanium Sheen */}
        {metallicSheen && isHovered && (
          <div
            style={{
              background: `linear-gradient(${sheenAngle}deg, 
                transparent 25%, 
                rgba(255, 255, 255, 0.05) 45%, 
                rgba(255, 255, 255, 0.12) 50%, 
                rgba(255, 255, 255, 0.05) 55%, 
                transparent 75%)`,
            }}
            className="pointer-events-none absolute inset-0 z-10 mix-blend-screen transition-opacity duration-200 opacity-70"
          />
        )}

        {/* 3D Depth Layer Container */}
        <div
          style={{ transform: "translateZ(26px)" }}
          className="relative z-10 flex flex-col gap-4"
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Child component for placing elements on distinct Z-axis elevation planes
 */
export function PrismLayer({
  depth = 30,
  children,
  className,
  ...props
}: {
  depth?: number
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{ transform: `translateZ(${depth}px)` }}
      className={cn("transition-transform duration-100", className)}
      {...props}
    >
      {children}
    </div>
  )
}
