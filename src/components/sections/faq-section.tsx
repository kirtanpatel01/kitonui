import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
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

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-[680px] text-center">
        <h2
          style={{ textWrap: "balance" }}
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Frequently asked questions
        </h2>
        <p
          style={{ textWrap: "pretty" }}
          className="mt-2 text-sm text-muted-foreground"
        >
          Clear answers about licensing, compatibility, and registry management.
        </p>
      </div>

      <Accordion defaultValue={["item-0"]} className={"border-none"}>
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={item.question} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
