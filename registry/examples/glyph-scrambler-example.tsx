"use client"

import { useState } from "react"
import { GlyphScrambler, GLYPH_SETS } from "@/registry/components/glyph-scrambler"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const PRODUCTION_METRICS = [
  "p99 latency: 12.4ms across 34 edge regions",
  "commit 7f83ad9: ship edge telemetry pipeline",
  "cache hit ratio: 99.4% (redis-cluster-01)",
  "build verified: 0 errors, 42 chunks emitted in 1.2s",
  "encryption: AES-256-GCM session key active",
]

export default function GlyphScramblerExample() {
  const [glyphSet, setGlyphSet] = useState<keyof typeof GLYPH_SETS>("technical")
  const [direction, setDirection] = useState<"left-to-right" | "random" | "center-out">("left-to-right")
  const [key, setKey] = useState(0)

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-10 px-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1">
          {(Object.keys(GLYPH_SETS) as Array<keyof typeof GLYPH_SETS>).map((g) => (
            <button
              key={g}
              onClick={() => {
                setGlyphSet(g)
                setKey((k) => k + 1)
              }}
              className={`rounded-md px-2.5 py-1 capitalize font-medium transition-colors ${
                glyphSet === g
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1">
          {(["left-to-right", "random", "center-out"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => {
                setDirection(dir)
                setKey((k) => k + 1)
              }}
              className={`rounded-md px-2.5 py-1 capitalize font-medium transition-colors ${
                direction === dir
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {dir.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setKey((k) => k + 1)}
          className="h-7 text-xs flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Reroll
        </Button>
      </div>

      {/* Main Terminal Box */}
      <div className="flex flex-col items-start justify-center min-h-[110px] rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl w-full max-w-xl">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-zinc-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          <span>PRODUCTION TELEMETRY</span>
        </div>
        <div className="text-base sm:text-lg font-mono">
          <GlyphScrambler
            key={key}
            text={PRODUCTION_METRICS}
            glyphs={glyphSet}
            revealDirection={direction}
            trigger="auto"
            cycleInterval={3500}
            duration={700}
            speed={24}
          />
        </div>
      </div>

      {/* Inline Hover Example */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          Hover to scramble:
        </span>
        <div className="group rounded-lg border border-border/60 bg-muted/20 px-5 py-2.5 cursor-pointer hover:border-zinc-500 transition-colors">
          <GlyphScrambler
            text="DEPLOY_KEY_PROD_8849204A"
            glyphs="hex"
            trigger="hover"
            duration={600}
            speed={22}
            className="text-sm font-mono font-medium"
          />
        </div>
      </div>
    </div>
  )
}
