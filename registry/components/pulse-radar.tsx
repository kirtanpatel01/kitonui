"use client"

import * as React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "cn"
import { motion, AnimatePresence } from "motion/react"

export interface RadarTarget {
  id: string
  x: number // percentage 0 - 100
  y: number // percentage 0 - 100
  label: string
  region?: string
  status?: "operational" | "degraded" | "standby"
  latency?: string
  ip?: string
}

export interface PulseRadarProps extends React.HTMLAttributes<HTMLDivElement> {
  targets?: RadarTarget[]
  sweepSpeed?: number // seconds per rotation
  rings?: number
  showCardinals?: boolean
  showGrid?: boolean
  interactive?: boolean
  accentColor?: "emerald" | "cyan" | "amber" | "violet"
  onTargetClick?: (target: RadarTarget) => void
  onPing?: (point: { x: number; y: number }) => void
}

const COLOR_MAP = {
  emerald: {
    stroke: "rgba(16, 185, 129, 0.18)",
    sweep: "rgba(16, 185, 129, 0.25)",
    glow: "rgba(16, 185, 129, 0.08)",
    primary: "#10b981",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  cyan: {
    stroke: "rgba(6, 182, 212, 0.18)",
    sweep: "rgba(6, 182, 212, 0.25)",
    glow: "rgba(6, 182, 212, 0.08)",
    primary: "#06b6d4",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  amber: {
    stroke: "rgba(245, 158, 11, 0.18)",
    sweep: "rgba(245, 158, 11, 0.25)",
    glow: "rgba(245, 158, 11, 0.08)",
    primary: "#f59e0b",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  violet: {
    stroke: "rgba(139, 92, 246, 0.18)",
    sweep: "rgba(139, 92, 246, 0.25)",
    glow: "rgba(139, 92, 246, 0.08)",
    primary: "#8b5cf6",
    text: "text-violet-400",
    border: "border-violet-500/30",
  },
}

interface Ripple {
  id: number
  x: number
  y: number
}

export function PulseRadar({
  targets = [],
  sweepSpeed = 5,
  rings = 4,
  showCardinals = true,
  showGrid = true,
  interactive = true,
  accentColor = "emerald",
  onTargetClick,
  onPing,
  className,
  ...props
}: PulseRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTarget, setActiveTarget] = useState<RadarTarget | null>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [blipHits, setBlipHits] = useState<Record<string, number>>({})
  const angleRef = useRef<number>(0)
  const colors = COLOR_MAP[accentColor]

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let lastTime = performance.now()

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000
      lastTime = time

      const speed = (2 * Math.PI) / sweepSpeed
      angleRef.current = (angleRef.current + speed * dt) % (2 * Math.PI)
      const currentAngle = angleRef.current

      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const radius = Math.min(cx, cy) - 28

      // Background ambient vignette
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
      bgGrad.addColorStop(0, colors.glow)
      bgGrad.addColorStop(1, "transparent")
      ctx.fillStyle = bgGrad
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()

      // Concentric Distance Rings with hairline precision
      for (let i = 1; i <= rings; i++) {
        const r = (radius / rings) * i
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = colors.stroke
        ctx.lineWidth = 1
        if (i < rings) {
          ctx.setLineDash([3, 5])
        } else {
          ctx.setLineDash([])
        }
        ctx.stroke()
        ctx.setLineDash([])

        // Subtle range label on axis
        if (i === rings) {
          ctx.fillStyle = "rgba(161, 161, 170, 0.4)"
          ctx.font = "9px ui-monospace, monospace"
          ctx.textAlign = "center"
          ctx.fillText("5000 KM", cx, cy - r + 12)
          ctx.fillText("2500 KM", cx, cy - r / 2 + 10)
        }
      }

      // Hairline crosshairs
      if (showGrid) {
        ctx.beginPath()
        ctx.moveTo(cx - radius, cy)
        ctx.lineTo(cx + radius, cy)
        ctx.moveTo(cx, cy - radius)
        ctx.lineTo(cx, cy + radius)
        ctx.strokeStyle = colors.stroke
        ctx.lineWidth = 1
        ctx.setLineDash([2, 6])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Rotating Conic Sweep Beam
      const sweepAngle = Math.PI / 4 // 45 degree trailing glow
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, currentAngle - sweepAngle, currentAngle)
      ctx.closePath()

      const conic = ctx.createConicGradient(currentAngle, cx, cy)
      conic.addColorStop(0, colors.sweep)
      conic.addColorStop(1 - sweepAngle / (2 * Math.PI), "transparent")
      conic.addColorStop(1, "transparent")
      ctx.fillStyle = conic
      ctx.fill()

      // Leading beam edge
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(
        cx + radius * Math.cos(currentAngle),
        cy + radius * Math.sin(currentAngle)
      )
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // Target angular sweep hit detection
      targets.forEach((t) => {
        const tx = cx + ((t.x - 50) / 50) * radius
        const ty = cy + ((t.y - 50) / 50) * radius
        let targetAngle = Math.atan2(ty - cy, tx - cx)
        if (targetAngle < 0) targetAngle += 2 * Math.PI

        const diff = (currentAngle - targetAngle + 2 * Math.PI) % (2 * Math.PI)
        if (diff < 0.12) {
          setBlipHits((prev) => ({
            ...prev,
            [t.id]: Date.now(),
          }))
        }
      })

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [sweepSpeed, rings, showGrid, colors, targets])

  // High-DPI handling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // User click ping
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      const percentX = Math.round((clickX / rect.width) * 100)
      const percentY = Math.round((clickY / rect.height) * 100)

      setRipples((prev) => [
        ...prev.slice(-3),
        { id: Date.now(), x: percentX, y: percentY },
      ])
      onPing?.({ x: percentX, y: percentY })
    },
    [interactive, onPing]
  )

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-lg select-none overflow-hidden rounded-2xl border border-border/50 bg-zinc-950 p-6 shadow-2xl backdrop-blur-sm cursor-crosshair",
        className
      )}
      {...props}
    >
      {/* Clean Radar Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Axis Degree Markers */}
      {showCardinals && (
        <div className="pointer-events-none absolute inset-0 font-mono text-[9px] tracking-wider text-muted-foreground/50">
          <span className="absolute top-2.5 left-1/2 -translate-x-1/2">000°</span>
          <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2">180°</span>
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2">270°</span>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">090°</span>
        </div>
      )}

      {/* Node Blips */}
      <div className="absolute inset-0">
        {targets.map((target) => {
          const isHit =
            blipHits[target.id] && Date.now() - blipHits[target.id] < 1200
          const statusStyles = {
            operational: "bg-emerald-500 border-emerald-400",
            degraded: "bg-amber-500 border-amber-400",
            standby: "bg-zinc-400 border-zinc-300",
          }
          const blipStyle = statusStyles[target.status || "operational"]

          return (
            <div
              key={target.id}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => {
                e.stopPropagation()
                setActiveTarget(target)
                onTargetClick?.(target)
              }}
              className="group absolute z-20 cursor-pointer p-2"
            >
              {/* Radar hit ripple */}
              <AnimatePresence>
                {isHit && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className={cn(
                      "absolute inset-0 rounded-full border border-current",
                      colors.text
                    )}
                  />
                )}
              </AnimatePresence>

              {/* Blip Dot */}
              <div
                className={cn(
                  "relative h-2 w-2 rounded-full border shadow-sm transition-transform duration-200 group-hover:scale-150",
                  blipStyle
                )}
              />

              {/* Clean Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <div className="whitespace-nowrap rounded-md border border-border/70 bg-zinc-900/95 px-2.5 py-1 text-xs font-mono text-zinc-100 shadow-lg">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {target.label}
                  </div>
                  {target.latency && (
                    <div className="text-[10px] text-zinc-400">
                      {target.region} · {target.latency}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Manual Click Wave */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          className={cn(
            "pointer-events-none absolute h-6 w-6 rounded-full border",
            colors.border
          )}
        />
      ))}

      {/* Top Header Probe HUD */}
      <div className="pointer-events-none absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-zinc-200 tracking-wide">EDGE SPATIAL MESH</span>
        </div>
        <div className="tracking-wider text-zinc-500">
          PROBES: {targets.length} · {sweepSpeed}s/REV
        </div>
      </div>

      {/* Target Details Tray */}
      <AnimatePresence>
        {activeTarget && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-4 left-4 right-4 z-40 rounded-xl border border-border/80 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      activeTarget.status === "degraded"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    )}
                  />
                  <h4 className="font-mono text-xs font-bold text-zinc-100">
                    {activeTarget.label}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    ({activeTarget.region})
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-zinc-400">
                  LATENCY: {activeTarget.latency || "14ms"} · STATUS: {activeTarget.status || "operational"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTarget(null)
                }}
                className="rounded px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
