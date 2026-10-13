import React from "react"

function AnimatedLogo() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto size-56"
    >
      {/* Top-Left Module */}
      <path
        d="M18 13h8a3 3 0 0 1 3 3v8l-4 4h-9a3 3 0 0 1-3-3v-8a4 4 0 0 1 5-4Z"
        fill="oklch(76.8% 0.233 130.85)"
      />

      {/* Top-Right Module */}
      <path
        d="M38 13h8a4 4 0 0 1 5 4v8a3 3 0 0 1-3 3h-9l-4-4v-8a3 3 0 0 1 3-3Z"
        fill="oklch(72.3% 0.219 149.579)"
      />

      {/* Bottom-Right Module */}
      <path
        d="M35 39l4-4h9a3 3 0 0 1 3 3v8a4 4 0 0 1-5 4h-8a3 3 0 0 1-3-3v-8Z"
        fill="oklch(70.4% 0.14 182.503)"
      />

      {/* Bottom-Left Module */}
      <path
        d="M13 38a3 3 0 0 1 3-3h9l4 4v8a3 3 0 0 1-3 3h-8a4 4 0 0 1-5-4v-8Z"
        fill="oklch(69.6% 0.17 162.48)"
      />

      {/* Center Spark */}
      <path
        d="M32 25.5 34.6 29.4 38.5 32 34.6 34.6 32 38.5 29.4 34.6 25.5 32 29.4 29.4 32 25.5Z"
        className="fill-foreground"
      />
    </svg>
  )
}

export default AnimatedLogo
