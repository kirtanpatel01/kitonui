import { createFileRoute } from "@tanstack/react-router"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
  return (
    <div className="min-h-screen selection:bg-primary/20">
      <Navbar />
      <main className="h-screen w-full flex justify-center items-center">
        kjpatel
      </main>
      <Footer />
    </div>
  )
}
