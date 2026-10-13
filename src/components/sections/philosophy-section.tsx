import { useState, useEffect, useRef } from "react"

export const TAGLINE_WORDS = [
  "Source",
  "code",
  "you",
  "own,",
  "crafted",
  "for",
  "React",
  "19",
  "and",
  "Tailwind",
  "CSS",
  "version",
  "4.",
  "No",
  "runtime",
  "bloat,",
  "no",
  "vendor",
  "lock.",
]

export function PhilosophySection() {
  const [activeWordCount, setActiveWordCount] = useState(0)
  const taglineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = taglineRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let count = 0
            const interval = setInterval(() => {
              count += 1
              setActiveWordCount(count)
              if (count >= TAGLINE_WORDS.length) {
                clearInterval(interval)
              }
            }, 60)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto text-center" ref={taglineRef}>
      <div className="max-w-[680px] mx-auto">
        <p className="text-xs uppercase font-mono font-semibold tracking-wider text-primary mb-4">
          Registry philosophy
        </p>
        <h2
          style={{ textWrap: "balance" }}
          className="text-3xl sm:text-5xl font-bold leading-tight flex flex-wrap justify-center gap-x-2.5 gap-y-1.5"
        >
          {TAGLINE_WORDS.map((word, index) => (
            <span
              key={word + index}
              className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                index < activeWordCount
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-30"
              }`}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
