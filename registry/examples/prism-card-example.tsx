"use client"

import { useState } from "react"
import { PrismCard, PrismLayer } from "@/registry/components/prism-card"
import { ShieldCheck, KeyRound, ArrowUpRight } from "lucide-react"

export default function PrismCardExample() {
  const [metallicSheen, setMetallicSheen] = useState(true)
  const [borderGlow, setBorderGlow] = useState(true)
  const [tilt, setTilt] = useState(14)

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-10 px-4">
      {/* Precision Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
        <button
          onClick={() => setMetallicSheen(!metallicSheen)}
          className={`rounded-lg border border-border/60 px-3 py-1.5 font-medium transition-colors ${
            metallicSheen
              ? "bg-zinc-100 text-zinc-900"
              : "bg-muted/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          {metallicSheen ? "Specular Sheen: ON" : "Specular Sheen: OFF"}
        </button>

        <button
          onClick={() => setBorderGlow(!borderGlow)}
          className={`rounded-lg border border-border/60 px-3 py-1.5 font-medium transition-colors ${
            borderGlow
              ? "bg-zinc-100 text-zinc-900"
              : "bg-muted/30 text-muted-foreground hover:text-foreground"
          }`}
        >
          {borderGlow ? "Hairline Glow: ON" : "Hairline Glow: OFF"}
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/20 p-1">
          {[10, 14, 20].map((deg) => (
            <button
              key={deg}
              onClick={() => setTilt(deg)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                tilt === deg
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {deg}° Tilt
            </button>
          ))}
        </div>
      </div>

      {/* The 3D Prism Card */}
      <div className="py-2">
        <PrismCard
          maxTilt={tilt}
          metallicSheen={metallicSheen}
          borderGlow={borderGlow}
          className="w-[320px] sm:w-[350px] p-6 bg-zinc-950 border border-zinc-800"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <PrismLayer depth={40}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200">
                <KeyRound className="h-4 w-4" />
              </div>
            </PrismLayer>

            <PrismLayer depth={30}>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                FIDO2 SECURE
              </span>
            </PrismLayer>
          </div>

          {/* Card Body */}
          <div className="mt-8 space-y-1.5">
            <PrismLayer depth={45}>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                HARDWARE SECURITY MODULE
              </div>
              <h3 className="font-sans text-xl font-bold text-zinc-100 tracking-tight">
                Production Access Key
              </h3>
            </PrismLayer>

            <PrismLayer depth={25}>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Curve25519 hardware attestation key enrolled for infrastructure deployments.
              </p>
            </PrismLayer>
          </div>

          {/* Card Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
            <PrismLayer depth={35}>
              <div className="font-mono text-[11px] text-zinc-400">
                ID: 4f82-a910-ce41
              </div>
            </PrismLayer>

            <PrismLayer depth={50}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition-transform hover:scale-105">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </PrismLayer>
          </div>
        </PrismCard>
      </div>

      <p className="text-xs text-muted-foreground font-mono text-center">
        Move your mouse over the card to observe physical spring tilt and anisotropic light reflections.
      </p>
    </div>
  )
}
