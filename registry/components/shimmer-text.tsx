"use client"

import React, { useMemo } from "react"
import { motion } from "motion/react"
import { cn } from "cn"

export type ShimmerTextSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "responsive"

export type ShimmerTextWeight =
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black"
  | number

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** The text string to display (alternatively pass children) */
  text?: string
  children?: React.ReactNode
  /** HTML tag to render (default: "h2") */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "div"
  /**
   * Font size preset or any custom CSS font size string (e.g. "4rem", "14vw").
   * Defaults to "responsive" (6xl on mobile scaling to 9xl on large screens).
   */
  size?: ShimmerTextSize | string
  /**
   * Font weight preset or numeric CSS font-weight value.
   * Defaults to "extrabold".
   */
  weight?: ShimmerTextWeight
  /**
   * Base text color or gradient. Can be a Tailwind class (e.g. "from-blue-500 to-purple-600"),
   * or a custom CSS background / gradient string (e.g. "linear-gradient(...)").
   * Defaults to KitonUI signature emerald gradient.
   */
  color?: string
  /**
   * Custom sheen color or gradient for the sweeping shimmer.
   * Can be a color string (e.g. "#ffffff", "gold", "rgba(56,189,248,0.8)")
   * or a full linear-gradient string.
   */
  shimmerColor?: string
  /**
   * Duration of the shimmer animation cycle in seconds (default: 4)
   */
  duration?: number
  /**
   * Alias for duration (in seconds).
   */
  speed?: number
  /**
   * Pause delay between shimmer sweeps in seconds (default: 0).
   */
  repeatDelay?: number
  /**
   * Sweep angle in degrees (default: 110).
   */
  angle?: number
  /**
   * Width / spread percentage of the shimmer beam (default: 60).
   */
  spread?: number
  /**
   * 3D bevel / specular rim contour effect.
   * When true (default), expands the shimmer layer by 1.006x, creating an engraved specular rim.
   * Can also be a custom number (e.g. 1.01) to adjust rim thickness, or false to disable.
   */
  bevel?: boolean | number
  /** Additional class names for outer container */
  className?: string
  /** Additional class names specifically for the typography layers */
  textClassName?: string
}

const SIZE_MAP: Record<ShimmerTextSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
  responsive: "text-6xl sm:text-7xl md:text-8xl lg:text-9xl",
}

const WEIGHT_MAP: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
}

export function ShimmerText({
  text,
  children,
  as: Component = "h2",
  size = "responsive",
  weight = "extrabold",
  color,
  shimmerColor,
  duration,
  speed,
  repeatDelay = 0,
  angle = 110,
  spread = 60,
  bevel = true,
  className,
  textClassName,
  style,
  ...props
}: ShimmerTextProps) {
  const content = text ?? children
  const effectiveDuration = speed ?? duration ?? 4

  // Resolve font size
  const isSizePreset = typeof size === "string" && size in SIZE_MAP
  const sizeClass = isSizePreset ? SIZE_MAP[size as ShimmerTextSize] : undefined
  const customFontSize = !isSizePreset && size ? size : undefined

  // Resolve font weight
  const isWeightPreset = typeof weight === "string" && weight in WEIGHT_MAP
  const weightClass = isWeightPreset ? WEIGHT_MAP[weight] : undefined
  const customFontWeight = typeof weight === "number" || (!isWeightPreset && weight) ? weight : undefined

  // Resolve base text styling
  const isCustomColorCSS =
    color &&
    (color.startsWith("#") ||
      color.startsWith("rgb") ||
      color.startsWith("hsl") ||
      color.includes("gradient") ||
      color.includes("var("))

  const defaultBaseColorClass =
    "bg-linear-to-b from-chart-5 dark:from-primary via-chart-2 dark:via-emerald-900 to-chart-1 dark:to-black/50"

  const baseStyle: React.CSSProperties = {
    ...(customFontSize ? { fontSize: customFontSize } : {}),
    ...(customFontWeight ? { fontWeight: customFontWeight } : {}),
    ...(isCustomColorCSS ? { background: color, WebkitBackgroundClip: "text" } : {}),
    ...style,
  }

  // Calculate bevel scale ratio
  const bevelScale = typeof bevel === "number" ? bevel : bevel ? 1.006 : 1

  // Resolve shimmer sheen gradient
  const shimmerSheenStyle = useMemo(() => {
    const sheenStyle: React.CSSProperties = {
      ...baseStyle,
      transform: bevelScale !== 1 ? `scale(${bevelScale})` : undefined,
      transformOrigin: "center center",
      backgroundSize: "250% 100%",
    }

    if (!shimmerColor) {
      // Default dual-mode sheen
      return sheenStyle
    }

    // Custom shimmer color: construct dynamic linear gradient
    const isFullGradient = shimmerColor.includes("gradient")
    if (isFullGradient) {
      sheenStyle.backgroundImage = shimmerColor
    } else {
      const halfSpread = Math.min(Math.max(spread / 2, 5), 45)
      const center = 50
      const start = Math.max(center - halfSpread, 0)
      const midStart = Math.max(center - halfSpread / 2, 0)
      const midEnd = Math.min(center + halfSpread / 2, 100)
      const end = Math.min(center + halfSpread, 100)

      sheenStyle.backgroundImage = `linear-gradient(${angle}deg, transparent ${start}%, ${shimmerColor} ${midStart}%, #ffffff ${center}%, ${shimmerColor} ${midEnd}%, transparent ${end}%)`
    }

    return sheenStyle
  }, [shimmerColor, angle, spread, bevelScale, baseStyle])

  const MotionComponent = useMemo(() => motion.create(Component), [Component])

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center text-center select-none",
        className
      )}
    >
      <div className="relative inline-block">
        {/* Base Gradient / Colored Text */}
        <Component
          className={cn(
            "font-logo whitespace-nowrap tracking-wider leading-none text-transparent bg-clip-text",
            sizeClass,
            weightClass,
            !isCustomColorCSS && (color ?? defaultBaseColorClass),
            textClassName
          )}
          style={baseStyle}
          {...props}
        >
          {content}
        </Component>

        {/* Shimmer Sheen Layer with optional Bevel Specular Rim */}
        <MotionComponent
          key={`${effectiveDuration}-${shimmerColor}-${bevelScale}`}
          aria-hidden="true"
          className={cn(
            "pointer-events-none font-logo absolute inset-0 whitespace-nowrap tracking-wider leading-none text-transparent bg-clip-text bg-no-repeat",
            sizeClass,
            weightClass,
            !shimmerColor &&
              "bg-[linear-gradient(110deg,transparent_20%,rgba(226,232,240,0.35)_45%,rgba(255,255,255,0.75)_50%,rgba(226,232,240,0.35)_55%,transparent_80%)] dark:bg-[linear-gradient(110deg,transparent_20%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.3)_55%,transparent_80%)] bg-[length:250%_100%]",
            textClassName
          )}
          style={shimmerSheenStyle}
          initial={{ backgroundPosition: "150% 0" }}
          animate={{
            backgroundPosition: ["150% 0", "-150% 0"],
          }}
          transition={{
            duration: effectiveDuration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay,
          }}
        >
          {content}
        </MotionComponent>
      </div>
    </div>
  )
}

export default ShimmerText
