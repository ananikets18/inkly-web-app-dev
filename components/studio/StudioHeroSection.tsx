"use client"

import { motion } from "framer-motion"
import { Palette } from "lucide-react"

export default function StudioHeroSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden w-full" aria-labelledby="studio-hero-heading">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />

      {/* Floating particles/ambient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60"
          animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-16 w-1 h-1 bg-pink-400 rounded-full opacity-40"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50"
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-6">
            <Palette className="w-12 h-12 text-purple-500 drop-shadow-lg" aria-hidden="true" />
          </div>
          <h1
            id="studio-hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 mb-6 leading-tight"
          >
            Inkly Studio
          </h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Your creative command center. Craft, manage, and analyze your inks with powerful tools designed for creators.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
