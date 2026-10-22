"use client"

import React from "react"
import { motion } from "motion/react"
import { cn } from "cn"

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text string to display */
  text?: string
  children?: React.ReactNode
  /** Duration of the shimmer animation cycle in seconds (default: 4) */
  duration?: number
  /** Additional class names for outer container */
  className?: string
  /** Additional class names specifically for the typography */
  textClassName?: string
}

export function ShimmerText({
  text,
  children,
  duration = 4,
  className,
  textClassName,
  ...props
}: ShimmerTextProps) {
  const content = text ?? children

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center text-center select-none",
        className
      )}
      {...props}
    >
      <div className="relative inline-block">
        {/* Base Gradient Text */}
        <h2
          className={cn(
            "font-logo whitespace-nowrap text-6xl font-extrabold tracking-wider leading-none text-transparent bg-clip-text bg-linear-to-b from-chart-5 dark:from-primary via-chart-2 dark:via-emerald-900 to-chart-1 dark:to-black/50 sm:text-7xl md:text-8xl lg:text-9xl",
            textClassName
          )}
        >
          {content}
        </h2>

        {/* Shimmer Sheen Layer */}
        <motion.h2
          key={duration}
          aria-hidden="true"
          className={cn(
            "pointer-events-none font-logo absolute inset-0 whitespace-nowrap text-6xl font-extrabold tracking-wider leading-none text-transparent bg-clip-text bg-no-repeat bg-[linear-gradient(110deg,transparent_20%,rgba(226,232,240,0.35)_45%,rgba(255,255,255,0.75)_50%,rgba(226,232,240,0.35)_55%,transparent_80%)] dark:bg-[linear-gradient(110deg,transparent_20%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.3)_55%,transparent_80%)] bg-[length:250%_100%] sm:text-7xl md:text-8xl lg:text-9xl",
            textClassName
          )}
          initial={{ backgroundPosition: "150% 0" }}
          animate={{
            backgroundPosition: ["150% 0", "-150% 0"],
          }}
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          {content}
        </motion.h2>
      </div>
    </div>
  )
}
