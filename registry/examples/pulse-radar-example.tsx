"use client"

import { useState } from "react"
import { PulseRadar, type RadarTarget } from "@/registry/components/pulse-radar"
import { Button } from "@/components/ui/button"

const EDGE_NODES: RadarTarget[] = [
  { id: "fra1", x: 42, y: 32, label: "fra1-edge", region: "Frankfurt, EU", status: "operational", latency: "14ms" },
  { id: "iad1", x: 28, y: 46, label: "iad1-edge", region: "Ashburn, US-East", status: "operational", latency: "28ms" },
  { id: "lhr1", x: 46, y: 24, label: "lhr1-core", region: "London, UK", status: "operational", latency: "11ms" },
  { id: "hnd1", x: 74, y: 40, label: "hnd1-edge", region: "Tokyo, AP", status: "operational", latency: "76ms" },
  { id: "syd1", x: 82, y: 78, label: "syd1-edge", region: "Sydney, AU", status: "degraded", latency: "148ms" },
]

export default function PulseRadarExample() {
  const [color, setColor] = useState<"emerald" | "cyan" | "amber" | "violet">("emerald")
  const [speed, setSpeed] = useState<number>(5)
  const [targets, setTargets] = useState<RadarTarget[]>(EDGE_NODES)

  const handlePing = (point: { x: number; y: number }) => {
    const customId = `probe-${Math.floor(Math.random() * 900 + 100)}`
    setTargets((prev) => [
      ...prev,
      {
        id: customId,
        x: point.x,
        y: point.y,
        label: `${customId}-pop`,
        region: "User Ingress",
        status: "operational",
        latency: `${Math.floor(Math.random() * 30 + 15)}ms`,
      },
    ])
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 p-4">
      {/* Precision Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1 text-xs">
          {(["emerald", "cyan", "amber", "violet"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`rounded-md px-2.5 py-1 capitalize font-medium transition-colors ${
                color === c
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1 text-xs">
          {[
            { label: "3s Sweep", val: 3 },
            { label: "5s Normal", val: 5 },
            { label: "8s Slow", val: 8 },
          ].map((s) => (
            <button
              key={s.val}
              onClick={() => setSpeed(s.val)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                speed === s.val
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTargets(EDGE_NODES)}
          className="text-xs h-7"
        >
          Reset Nodes
        </Button>
      </div>

      <div className="w-full max-w-lg">
        <PulseRadar
          accentColor={color}
          sweepSpeed={speed}
          targets={targets}
          onPing={handlePing}
        />
      </div>

      <p className="text-xs text-muted-foreground font-mono text-center">
        Click anywhere on the coordinate grid to deploy an ad-hoc latency probe.
      </p>
    </div>
  )
}
