import { motion } from "motion/react"

const SHIMMER_DURATION = 4

export function Footer() {
  return (
    <footer className="relative bottom-0 w-full text-center overflow-hidden bg-background pt-16">
      <div className="pointer-events-none absolute -bottom-28 left-1/2 h-66 w-full -translate-x-1/2 rounded-full bg-chart-3/20 blur-3xl" />
      {/* <AnimatedLogo /> */}
      <div className="relative block select-none translate-y-[-0.55vw] -mb-[3.5vw]">
        {/* Base Gradient Text */}
        <h2
          className="font-logo whitespace-nowrap text-[17.4vw] font-extrabold tracking-wider leading-none bg-linear-to-b from-chart-5 dark:from-primary via-chart-2 dark:via-emerald-900 to-chart-1 dark:to-black/50 text-transparent bg-clip-text"
        >
          KitonUi
        </h2>

        {/* Shimmer Sheen Layer: Silver in light mode, Dark/Obsidian in dark mode */}
        <motion.h2
          key={SHIMMER_DURATION}
          aria-hidden="true"
          className="pointer-events-none font-logo absolute inset-0 whitespace-nowrap text-[17.5vw] font-extrabold tracking-wider leading-none text-transparent bg-clip-text bg-no-repeat bg-[linear-gradient(110deg,transparent_20%,rgba(226,232,240,0.35)_45%,rgba(255,255,255,0.75)_50%,rgba(226,232,240,0.35)_55%,transparent_80%)] dark:bg-[linear-gradient(110deg,transparent_20%,rgba(0,0,0,0.3)_45%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.3)_55%,transparent_80%)] bg-[length:250%_100%]"
          initial={{ backgroundPosition: "150% 0" }}
          animate={{
            backgroundPosition: ["150% 0", "-150% 0"],
          }}
          transition={{
            duration: SHIMMER_DURATION,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          KitonUi
        </motion.h2>
      </div>
    </footer>
  )
}
