"use client"

import { useState } from "react"
import { MorphingDock, type DockItemData } from "@/registry/components/morphing-dock"
import {
  Layers,
  GitBranch,
  Terminal,
  Inbox,
  Command,
  Sliders,
} from "lucide-react"

export default function MorphingDockExample() {
  const [selected, setSelected] = useState<string>("issues")

  const items: DockItemData[] = [
    { id: "issues", label: "Issues", icon: <Layers className="h-4 w-4" />, shortcut: "⌘1" },
    { id: "branches", label: "Pull Requests", icon: <GitBranch className="h-4 w-4" />, shortcut: "⌘2" },
    { id: "command", label: "Command Menu", icon: <Command className="h-4 w-4" />, shortcut: "⌘K" },
    { id: "terminal", label: "Shell", icon: <Terminal className="h-4 w-4" />, shortcut: "⌘`" },
    { id: "inbox", label: "Notifications", icon: <Inbox className="h-4 w-4" />, badge: 2, shortcut: "⌘N" },
    { id: "sep", label: "separator", icon: null, isSeparator: true },
    { id: "settings", label: "Settings", icon: <Sliders className="h-4 w-4" />, shortcut: "⌘," },
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 py-12 px-4">
      {/* Active Surface Label */}
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-zinc-950/60 px-3 py-1.5 font-mono text-xs text-zinc-400">
        <span className="text-zinc-500">Active View:</span>
        <span className="font-semibold text-zinc-200 uppercase tracking-wider">
          {items.find((i) => i.id === selected)?.label || selected}
        </span>
      </div>

      {/* The Dock */}
      <div className="relative pt-4">
        <MorphingDock
          items={items}
          defaultActiveId="issues"
          magnification={1.38}
          distance={115}
          onSelect={(item) => setSelected(item.id)}
        />
      </div>

      <p className="text-xs text-zinc-500 font-mono text-center">
        Parabolic cursor proximity scaling powered by Framer Motion springs.
      </p>
    </div>
  )
}
