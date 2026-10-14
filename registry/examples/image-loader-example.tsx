import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageGenerationLoader } from "../components/image-loader"
import Section from "@/components/layout/section"
import { CodePreview } from "@/components/code-preview"
import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/components/code-block-command"

const PRESETS = [
  {
    src: "https://assets.aceternity.com/components/vertical-sliding-loader-demo.webp",
    text: "UI DESIGN",
  },
  {
    src: "https://assets.aceternity.com/components/vertical-sliding-loader-demo-dark.webp",
    text: "DARK MODE",
  },
  {
    src: "https://images.unsplash.com/photo-1620694563886-c3a80ec55f41",
    text: "YELLOW BIRD",
  },
  {
    src: "https://images.unsplash.com/photo-1526344966-89049886b28d",
    text: "BLOSSOMS",
  },
  {
    src: "https://images.unsplash.com/photo-1762564046286-733d88d62800",
    text: "MOUNTAINS",
  },
  {
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    text: "FOREST",
  },
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    text: "LAKE CABIN",
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    text: "EARTH",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    text: "WORKSPACE",
  },
]

function ImageLoaderExample() {
  const [imageUrl, setImageUrl] = useState(PRESETS[2].src)
  const [inputUrl, setInputUrl] = useState(imageUrl)

  const [loaderText, setLoaderText] = useState(PRESETS[2].text)
  const [inputText, setInputText] = useState(loaderText)

  const applyChanges = () => {
    setImageUrl(inputUrl)
    setLoaderText(inputText)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Section className="w-full">
        <div className="w-fit">
          <CodeBlockCommand
            {...convertNpmCommand(
              "npx shadcn add kirtanpatel01/kitonui/image-loader"
            )}
          />
        </div>
      </Section>

      <Section className="my-0 flex w-full max-w-7xl flex-col gap-6 lg:flex-row">
        {/* Preview & Code Panel */}
        <CodePreview
          componentName="image-loader"
          preview={
            <ScrollArea className="h-full w-full bg-muted/5">
              <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
                <div className="relative w-fit max-w-full overflow-hidden rounded-lg border bg-background shadow-xl">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="block max-h-[400px] w-full max-w-2xl object-cover sm:max-h-[500px] lg:max-h-[600px]"
                    crossOrigin="anonymous"
                  />
                  {/* The key forces React to unmount the old loader and mount a new one, resetting both colors and text immediately! */}
                  <ImageGenerationLoader
                    key={`${imageUrl}-${loaderText}`}
                    text={loaderText}
                    effect="scale-wave"
                  />
                </div>
              </div>
            </ScrollArea>
          }
        />

      {/* Settings Panel */}
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border lg:w-96 lg:shrink-0">
        <div className="z-10 border-b bg-card bg-muted/20 p-3">
          <h2 className="text-lg font-semibold tracking-wide">Customization</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Loader Text
              </label>
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. GENERATING"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Image URL
              </label>
              <Textarea
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                rows={2}
                placeholder="Paste image URL..."
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                * Ensure the image allows CORS sharing or the color extraction
                might fall back to the default palette.
              </p>
            </div>
            <Button onClick={applyChanges}>Apply Changes</Button>

            <div className="border-t border-border/50 pt-4">
              <h3 className="mb-3 text-sm tracking-wider text-muted-foreground">
                Try these examples
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputUrl(preset.src)
                      setImageUrl(preset.src)
                      setInputText(preset.text)
                      setLoaderText(preset.text)
                    }}
                    className="group relative aspect-square overflow-hidden rounded-md border border-border/50 transition-all hover:border-primary/50 hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    title={`Load example ${i + 1}: ${preset.text}`}
                  >
                    <img
                      src={preset.src}
                      alt={`Preset ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Section>
    </div>
  )
}

export default ImageLoaderExample
