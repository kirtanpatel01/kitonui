import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"

import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@/registry": path.resolve(__dirname, "./registry"),
      "@/content": path.resolve(__dirname, "./content"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    devtools(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [rehypeSlug],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
