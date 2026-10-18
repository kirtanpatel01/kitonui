"use client"

import * as React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"

export const GLYPH_SETS = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  hex: "0123456789abcdefABCDEF",
  symbols: "_/#-+=*<>[]~%&",
  technical: "0123456789ABCDEF_/#-+=*",
  binary: "01",
}

export interface GlyphScramblerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string | string[] // Single string or array of strings to cycle through
  glyphs?: keyof typeof GLYPH_SETS | string
  speed?: number // ms between glyph flips (default: 28)
  duration?: number // total scramble duration in ms (default: 800)
  trigger?: "mount" | "hover" | "click" | "auto"
  cycleInterval?: number // ms between cycles if trigger="auto" (default: 3500)
  revealDirection?: "left-to-right" | "right-to-left" | "random" | "center-out"
  onComplete?: (settledText: string) => void
}

export function GlyphScrambler({
  text,
  glyphs = "technical",
  speed = 28,
  duration = 800,
  trigger = "hover",
  cycleInterval = 3500,
  revealDirection = "left-to-right",
  className,
  onComplete,
  ...props
}: GlyphScramblerProps) {
  const textList = Array.isArray(text) ? text : [text]
  const [currentIndex, setCurrentIndex] = useState(0)
  const targetText = textList[currentIndex] || ""

  const [displayText, setDisplayText] = useState(targetText)
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set())
  const [isScrambling, setIsScrambling] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animFrameRef = useRef<number | null>(null)

  const charPool =
    typeof glyphs === "string" && glyphs in GLYPH_SETS
      ? GLYPH_SETS[glyphs as keyof typeof GLYPH_SETS]
      : glyphs || GLYPH_SETS.technical

  const startScramble = useCallback(
    (newTarget?: string) => {
      const finalWord = newTarget ?? targetText
      const length = finalWord.length
      const startTime = performance.now()

      setIsScrambling(true)
      const locked = new Set<number>()

      // Compute resolve order based on direction
      const indices = Array.from({ length }, (_, i) => i)
      if (revealDirection === "right-to-left") {
        indices.reverse()
      } else if (revealDirection === "random") {
        indices.sort(() => Math.random() - 0.5)
      } else if (revealDirection === "center-out") {
        const mid = Math.floor(length / 2)
        indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))
      }

      let lastFlip = startTime

      const frame = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)

        const lettersToLock = Math.floor(progress * length)
        for (let i = 0; i < lettersToLock; i++) {
          if (indices[i] !== undefined) {
            locked.add(indices[i])
          }
        }
        setLockedIndices(new Set(locked))

        if (now - lastFlip >= speed) {
          lastFlip = now
          const currentResult = Array.from({ length }, (_, i) => {
            if (locked.has(i)) {
              return finalWord[i] || ""
            }
            if (finalWord[i] === " ") {
              return " "
            }
            const randIdx = Math.floor(Math.random() * charPool.length)
            return charPool[randIdx]
          }).join("")

          setDisplayText(currentResult)
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(frame)
        } else {
          setDisplayText(finalWord)
          setLockedIndices(new Set(indices))
          setIsScrambling(false)
          onComplete?.(finalWord)
        }
      }

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      animFrameRef.current = requestAnimationFrame(frame)
    },
    [targetText, duration, speed, charPool, revealDirection, onComplete]
  )

  useEffect(() => {
    if (trigger === "mount") {
      startScramble()
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [trigger, startScramble])

  useEffect(() => {
    if (trigger === "auto" || (textList.length > 1 && trigger !== "click")) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % textList.length
          startScramble(textList[next])
          return next
        })
      }, cycleInterval)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [trigger, textList, cycleInterval, startScramble])

  const handleMouseEnter = () => {
    if (trigger === "hover" && !isScrambling) {
      startScramble()
    }
  }

  const handleClick = () => {
    if (trigger === "click") {
      if (textList.length > 1) {
        const next = (currentIndex + 1) % textList.length
        setCurrentIndex(next)
        startScramble(textList[next])
      } else {
        startScramble()
      }
    }
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "inline-flex select-none font-mono tracking-tight cursor-default transition-all duration-150",
        trigger === "click" && "cursor-pointer hover:opacity-90 active:scale-98",
        className
      )}
      {...props}
    >
      {displayText.split("").map((char, index) => {
        const isLocked = lockedIndices.has(index)
        const isSpace = char === " "

        return (
          <span
            key={index}
            className={cn(
              "inline-block transition-opacity duration-75",
              isSpace && "w-[0.5ch]",
              !isLocked && "opacity-40 text-muted-foreground font-normal",
              isLocked && "opacity-100 text-foreground font-medium"
            )}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}
