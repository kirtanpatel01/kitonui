import { useState, useEffect, useRef } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ImageGenerationLoader, type ImageGenerationLoaderEffect } from "@/components/image-loader"

export const Route = createFileRoute("/")({ component: HomePage })

const DEMO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop",
    title: "Tokyo neon night",
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    title: "Mountain twilight",
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    title: "Modern villa architecture",
  },
  {
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    title: "Textured art portrait",
  },
]

const FAQ_ITEMS = [
  {
    question: "How do I install components from this registry?",
    answer:
      "Run the shadcn CLI add command pointing directly to the GitHub repository: pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader. The CLI fetches the source code and places it inside your configured components directory.",
  },
  {
    question: "Does this require an external package dependency for animations?",
    answer:
      "No. The image generation loader runs entirely on an HTML5 canvas element with native requestAnimationFrame loops. You get full source ownership without adding heavy runtime animation bundles.",
  },
  {
    question: "Is this compatible with Tailwind CSS version 4 and React 19?",
    answer:
      "Yes. All components in kitonui target React 19 and use modern Tailwind CSS version 4 CSS variables and theme tokens.",
  },
  {
    question: "Can I customize the colors, text, and wave speed?",
    answer:
      "Every visual property is exposed as a typed prop, including cellSize, gap, bandHeight, duration, easing, overlayOpacity, and text glyphs.",
  },
  {
    question: "Do I need to host a separate registry server?",
    answer:
      "No. shadcn reads source registries directly from public GitHub repositories using the root registry definition file. When you deploy your site, built static JSON files in the public directory also serve as web endpoints.",
  },
  {
    question: "What license applies to the components?",
    answer:
      "All components are published under the MIT license. You can use, modify, and distribute them in commercial and personal projects without restrictions.",
  },
]

const TAGLINE_WORDS = [
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

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function TerminalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function HomePage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [selectedEffect, setSelectedEffect] = useState<ImageGenerationLoaderEffect>("shimmer")
  const [loaderText, setLoaderText] = useState("GENERATING")
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"demo" | "code">("demo")
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const [activeWordCount, setActiveWordCount] = useState(0)
  const taglineRef = useRef<HTMLDivElement>(null)

  const installCmd = "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  // Tagline reveal section scroll observation
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
    <div className="min-h-screen bg-[#07090E] text-neutral-100 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background ambient auras */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-cyan-500/5 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-[600px] right-0 -z-10 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent blur-3xl" />

      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-black focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Floating Island Navigation */}
      <header className="fixed top-0 inset-x-0 z-40 flex justify-center px-4 pt-5 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex items-center justify-between gap-6 sm:gap-10 rounded-full border border-white/10 bg-[#0F141F]/80 px-4 py-2 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <div className="flex items-center gap-2.5">
            <img src="/kitonui-icon.svg" alt="Kiton UI icon" className="size-7 rounded-lg shadow-sm" />
            <span className="font-semibold text-sm tracking-tight text-white">kitonui</span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#components"
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2.5 py-1 rounded-md hover:bg-white/5"
            >
              Components
            </a>
            <a
              href="#how-it-works"
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2.5 py-1 rounded-md hover:bg-white/5"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="text-xs text-neutral-400 hover:text-white transition-colors px-2.5 py-1 rounded-md hover:bg-white/5"
            >
              FAQ
            </a>
            <a
              href="https://github.com/kirtanpatel01/kitonui"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition-all shadow-sm"
            >
              <GitHubIcon className="size-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main id="main-content" className="pt-28 pb-20">
        {/* Section 1: Hero */}
        <section className="px-6 pt-14 pb-16 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1 text-xs text-emerald-300 backdrop-blur-sm shadow-xs">
            <img src="/kitonui-icon.svg" alt="Kiton UI icon" className="size-3.5 rounded-sm shrink-0" />
            <span>Open source shadcn registry for React 19</span>
          </div>

          <h1
            style={{ textWrap: "balance" }}
            className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-[680px] mx-auto leading-tight"
          >
            Add animated UI components directly with shadcn CLI
          </h1>

          <p
            style={{ textWrap: "pretty" }}
            className="mt-5 text-base sm:text-lg text-neutral-400 max-w-[680px] mx-auto leading-relaxed"
          >
            Inspect the live canvas loader below. Install the component into your repository with one terminal command and retain complete control of your source code.
          </p>

          {/* Primary Action Terminal Bar */}
          <div className="mt-8 max-w-lg mx-auto flex items-center justify-between rounded-xl border border-white/10 bg-[#0F141F]/90 p-2 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 overflow-hidden pl-2 text-sm font-mono text-neutral-400">
              <TerminalIcon className="size-4 shrink-0 text-emerald-400" />
              <span className="truncate text-neutral-200">{installCmd}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(installCmd)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 active:scale-98 transition-all shrink-0"
            >
              {copiedCmd === installCmd ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5" />
                  <span>Copy command</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-neutral-500">
            <span>Zero runtime build dependencies</span>
            <span>•</span>
            <span>Tailwind CSS version 4 ready</span>
            <span>•</span>
            <span>MIT license</span>
          </div>
        </section>

        {/* Section 2: Interactive Hero Visual Component Showcase */}
        <section id="components" className="px-6 py-8 max-w-5xl mx-auto">
          {/* Studio Window Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0D111A]/90 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Top window bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 pr-2">
                  <span className="size-2.5 rounded-full bg-rose-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-500/80" />
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-medium text-emerald-400">
                      registry:ui
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Image generation loader</h2>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab("demo")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "demo"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Live controls
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "code"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Code sample
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Canvas Preview */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-inner group">
                  <img
                    src={DEMO_IMAGES[selectedImage].url}
                    alt={DEMO_IMAGES[selectedImage].title}
                    crossOrigin="anonymous"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />

                  <ImageGenerationLoader
                    key={`${selectedEffect}-${loaderText}-${selectedImage}`}
                    effect={selectedEffect}
                    text={loaderText}
                    duration={3600}
                    cellSize={5}
                    gap={2}
                    bandHeight={52}
                  />

                  <div className="absolute top-3.5 left-3.5 z-20 rounded-lg border border-white/15 bg-black/75 px-3 py-1 text-xs font-mono text-neutral-200 backdrop-blur-md shadow-lg">
                    Mode: <span className="text-emerald-400 font-semibold">{selectedEffect}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>Samples pixel colors directly from canvas image</span>
                  <span>Pure HTML5 canvas</span>
                </div>
              </div>

              {/* Right Interactive Controls or Code */}
              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-5 space-y-6">
                {activeTab === "demo" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
                        Wave effect
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["shimmer", "wave", "scale-wave", "none"] as ImageGenerationLoaderEffect[]).map(
                          (effect) => (
                            <button
                              key={effect}
                              type="button"
                              onClick={() => setSelectedEffect(effect)}
                              className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                                selectedEffect === effect
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold shadow-xs"
                                  : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {effect}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
                        Pixel font text
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["GENERATING", "KITON UI", "RENDERING", "AI SCAN"].map((txt) => (
                          <button
                            key={txt}
                            type="button"
                            onClick={() => setLoaderText(txt)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono transition-all ${
                              loaderText === txt
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold"
                                : "border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {txt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
                        Source image
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {DEMO_IMAGES.map((img, idx) => (
                          <button
                            key={img.title}
                            type="button"
                            title={img.title}
                            onClick={() => setSelectedImage(idx)}
                            className={`rounded-lg border p-1 transition-all overflow-hidden ${
                              selectedImage === idx
                                ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10"
                                : "border-white/10 hover:border-white/25 opacity-70 hover:opacity-100 bg-white/5"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.title}
                              crossOrigin="anonymous"
                              className="h-10 w-full object-cover rounded"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Terminal install
                      </span>
                      <div className="mt-1.5 flex items-center justify-between rounded-lg border border-white/10 bg-black/60 p-2 text-xs font-mono text-neutral-300">
                        <span className="truncate pr-2">{installCmd}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(installCmd)}
                          className="text-neutral-400 hover:text-white p-1"
                        >
                          <CopyIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        React usage
                      </span>
                      <pre className="mt-1.5 rounded-lg border border-white/10 bg-black/60 p-3 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`import { ImageGenerationLoader } from "@/components/ui/image-loader"

export function ImageCard() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl">
      <img src="/photo.jpg" alt="Preview" crossOrigin="anonymous" />
      <ImageGenerationLoader
        effect="shimmer"
        text="GENERATING"
        duration={3600}
      />
    </div>
  )
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tagline Reveal Section */}
        <section className="px-6 py-24 max-w-4xl mx-auto text-center" ref={taglineRef}>
          <div className="max-w-[680px] mx-auto">
            <p className="text-xs uppercase font-mono font-semibold tracking-wider text-emerald-400 mb-4">
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
                    index < activeWordCount ? "text-white opacity-100" : "text-neutral-600 opacity-25"
                  }`}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>
        </section>

        {/* Section 4: How it works (3 steps) */}
        <section id="how-it-works" className="px-6 py-16 max-w-5xl mx-auto">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <h2 style={{ textWrap: "balance" }} className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How to install in three steps
            </h2>
            <p style={{ textWrap: "pretty" }} className="mt-2 text-sm text-neutral-400">
              No npm package publishing wait times. Components copy directly to your filesystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#0D111A]/80 backdrop-blur-xl p-6 space-y-3 shadow-lg hover:border-emerald-500/40 transition-colors">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                1
              </span>
              <h3 className="font-semibold text-base text-white">Run the CLI command</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Execute shadcn add with the GitHub path. The CLI pulls the source code directly from git.
              </p>
              <div className="rounded border border-white/10 bg-black/60 p-2 font-mono text-xs text-neutral-300 truncate">
                pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0D111A]/80 backdrop-blur-xl p-6 space-y-3 shadow-lg hover:border-emerald-500/40 transition-colors">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                2
              </span>
              <h3 className="font-semibold text-base text-white">Inspect your components directory</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The file arrives inside your components directory. You can edit the canvas dimensions, tweak easing, or restyle classes.
              </p>
              <div className="rounded border border-white/10 bg-black/60 p-2 font-mono text-xs text-neutral-300 truncate">
                src/components/ui/image-loader.tsx
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0D111A]/80 backdrop-blur-xl p-6 space-y-3 shadow-lg hover:border-emerald-500/40 transition-colors">
              <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                3
              </span>
              <h3 className="font-semibold text-base text-white">Compose in your application</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Import and render inside any image container. The component automatically adjusts to the parent container dimensions.
              </p>
              <div className="rounded border border-white/10 bg-black/60 p-2 font-mono text-xs text-neutral-300 truncate">
                &lt;ImageGenerationLoader /&gt;
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Button Component Companion */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-[#0D111A]/80 backdrop-blur-xl p-6 shadow-xl">
            <div className="pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-medium text-emerald-400">
                  registry:ui
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Button component</h2>
              </div>
              <p className="mt-1 text-sm text-neutral-400">
                Base UI accessible primitive supporting keyboard navigation and variant styling.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
              <span>Install command:</span>
              <span className="font-mono text-neutral-300">pnpm dlx shadcn add kirtanpatel01/kitonui/button</span>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ Accordion */}
        <section id="faq" className="px-6 py-16 max-w-3xl mx-auto">
          <div className="text-center mb-10 max-w-[680px] mx-auto">
            <h2 style={{ textWrap: "balance" }} className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently asked questions
            </h2>
            <p style={{ textWrap: "pretty" }} className="mt-2 text-sm text-neutral-400">
              Clear answers about licensing, compatibility, and registry management.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={item.question}
                className="rounded-xl border border-white/10 bg-[#0D111A]/80 backdrop-blur-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDownIcon
                    className={`size-4 shrink-0 text-neutral-400 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-white/5">
                    <p style={{ textWrap: "pretty" }}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Final CTA */}
        <section className="px-6 py-20 max-w-3xl mx-auto text-center">
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#0F172A] to-[#07090E] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/20 blur-3xl rounded-full" />
            <img src="/kitonui-icon.svg" alt="Kiton UI logo" className="size-14 rounded-2xl mx-auto mb-5 shadow-2xl shadow-emerald-500/20 border border-white/10" />
            <h2 style={{ textWrap: "balance" }} className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to use kitonui components?
            </h2>
            <p style={{ textWrap: "pretty" }} className="mt-3 text-sm text-neutral-400 max-w-md mx-auto">
              Run the command below in your project terminal to install the image loader immediately.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(installCmd)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 active:scale-98 transition-all shadow-lg shadow-emerald-500/20"
              >
                {copiedCmd === installCmd ? (
                  <>
                    <CheckIcon className="size-4" />
                    <span>Copied command</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-4" />
                    <span>Copy install command</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/kirtanpatel01/kitonui"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors shadow-sm"
              >
                <GitHubIcon className="size-4" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-xs text-neutral-500 bg-[#05070A]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/kitonui-icon.svg" alt="Kiton UI icon" className="size-5 rounded" />
            <span className="text-neutral-400 font-medium">kitonui component registry</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/kirtanpatel01/kitonui/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-neutral-300">
              MIT License
            </a>
            <a href="https://github.com/kirtanpatel01/kitonui" target="_blank" rel="noreferrer" className="hover:text-neutral-300">
              GitHub repository
            </a>
            <a href="#main-content" className="hover:text-neutral-300">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
