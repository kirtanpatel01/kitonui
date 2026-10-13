import { useState } from "react"
import { ImageGenerationLoader, type ImageGenerationLoaderEffect } from "@/components/image-loader"
import { CheckIcon, CopyIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"

export interface DemoImage {
  url: string
  title: string
}

export const DEMO_IMAGES: DemoImage[] = [
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

const EFFECT_OPTIONS: ImageGenerationLoaderEffect[] = ["shimmer", "wave", "scale-wave", "none"]
const TEXT_PRESETS = ["GENERATING", "KITON UI", "RENDERING", "AI SCAN"]
const DEFAULT_INSTALL_CMD = "pnpm dlx shadcn add kirtanpatel01/kitonui/image-loader"

export function LoaderShowcaseSection() {
  const [selectedEffect, setSelectedEffect] = useState<ImageGenerationLoaderEffect>("shimmer")
  const [loaderText, setLoaderText] = useState("GENERATING")
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"demo" | "code">("demo")
  const [copiedCmd, setCopiedCmd] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  return (
    <section id="components" className="px-6 py-8 max-w-5xl mx-auto">
      {/* Studio Window Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden transition-colors">
        {/* Top window bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5 pr-2">
              <span className="size-2.5 rounded-full bg-destructive/80" />
              <span className="size-2.5 rounded-full bg-muted-foreground/60" />
              <span className="size-2.5 rounded-full bg-primary/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-mono font-medium text-primary">
                  registry:ui
                </span>
                <h2 className="text-lg font-bold text-card-foreground tracking-tight">Image generation loader</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border/50">
            <Button
              type="button"
              size="sm"
              variant={activeTab === "demo" ? "default" : "ghost"}
              onClick={() => setActiveTab("demo")}
            >
              Live controls
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeTab === "code" ? "default" : "ghost"}
              onClick={() => setActiveTab("code")}
            >
              Code sample
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-inner group">
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

              <div className="absolute top-3.5 left-3.5 z-20 rounded-lg border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono text-foreground backdrop-blur-md shadow-lg">
                Mode: <span className="text-primary font-semibold">{selectedEffect}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Samples pixel colors directly from canvas image</span>
              <span>Pure HTML5 canvas</span>
            </div>
          </div>

          {/* Right Interactive Controls or Code */}
          <div className="lg:col-span-5 rounded-xl border border-border bg-muted/40 p-5 space-y-6">
            {activeTab === "demo" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                    Wave effect
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EFFECT_OPTIONS.map((effect) => (
                      <Button
                        key={effect}
                        type="button"
                        size="sm"
                        variant={selectedEffect === effect ? "default" : "outline"}
                        onClick={() => setSelectedEffect(effect)}
                      >
                        {effect}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                    Pixel font text
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TEXT_PRESETS.map((txt) => (
                      <Button
                        key={txt}
                        type="button"
                        size="sm"
                        variant={loaderText === txt ? "default" : "outline"}
                        onClick={() => setLoaderText(txt)}
                      >
                        {txt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                    Source image
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_IMAGES.map((img, idx) => (
                      <Button
                        key={img.title}
                        type="button"
                        size="sm"
                        variant={selectedImage === idx ? "default" : "outline"}
                        onClick={() => setSelectedImage(idx)}
                      >
                        {img.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    Terminal install
                  </span>
                  <div className="mt-1.5 flex items-center justify-between rounded-lg border border-border bg-muted p-2 text-xs font-mono text-foreground">
                    <span className="truncate pr-2">{DEFAULT_INSTALL_CMD}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(DEFAULT_INSTALL_CMD)}
                    >
                      {copiedCmd ? <CheckIcon className="size-3.5 text-primary" /> : <CopyIcon className="size-3.5" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                    React usage
                  </span>
                  <pre className="mt-1.5 rounded-lg border border-border bg-muted p-3 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
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
  )
}
