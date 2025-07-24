import type { Metadata } from "next"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import InklyStudio from "@/components/studio/InklyStudio"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Inkly Studio - Creator Dashboard",
  description: "Manage your inks, track analytics, and grow your audience with Inkly Studio",
}

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <InklyStudio />
        </main>
      </div>
      <Footer />
    </div>
  )
}
