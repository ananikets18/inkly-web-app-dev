"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"
import HeroSection from "../../components/explore/HeroSection"
import EditorsInks from "../../components/explore/EditorsInks"
import TrendingEchoes from "../../components/explore/TrendingEchoes"
import DeepDives from "../../components/explore/DeepDives"
import YouMayResonateWith from "../../components/explore/YouMayResonateWith"
import TopicUniverses from "../../components/explore/TopicUniverses"
import WhatsNewOnInkly from "../../components/explore/WhatsNewOnInkly"
import Footer from "@/components/Footer"

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-row">
          <div className="hidden md:block">
            <SideNav />
          </div>
          <main className="flex-1 max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8 p-8">
              <div className="h-32 bg-muted rounded-2xl" />
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-40 bg-muted rounded-2xl" />
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <div className="flex flex-row w-full">
        {/* SideNav: hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <SideNav />
        </div>

        {/* Main content area */}
        <main className="flex-1 pb-24 w-full" role="main">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero Section */}
            <HeroSection />

            {/* Content sections with staggered animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <EditorsInks />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TrendingEchoes />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <DeepDives />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <YouMayResonateWith />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <TopicUniverses />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <WhatsNewOnInkly />
            </motion.div>
          </motion.div>
        </main>
      </div>
      <BottomNav />
      <Footer />
    </div>
  )
}
