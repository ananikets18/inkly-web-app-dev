"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Palette, RefreshCw } from "lucide-react"
import StudioHeroSection from "@/components/studio/StudioHeroSection";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import InklyStudio from "@/components/studio/InklyStudio";
import Footer from "@/components/Footer";
import { NetworkWarning } from "@/components/NetworkWarning";
// Authentication removed - using mock authentication

// Full Page Loader Component for Studio
function FullPageLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950"
      >
        <div className="text-center">
          {/* Animated Logo/Icon */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mx-auto mb-8 w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <Palette className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Loading Studio
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Preparing your creative workspace and tools...
          </motion.p>

          {/* Animated Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-purple-500 rounded-full"
              />
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Error State Component for Studio
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <Palette className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Studio Unavailable
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}

import AuthGuard from "@/components/AuthGuard"

export default function StudioPage() {
  return (
    <AuthGuard>
      <StudioPageContent />
    </AuthGuard>
  )
}

function StudioPageContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  // Show full page loader while data is loading
  if (isLoading) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />
  }

  return (
    <div className="min-h-screen ...">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <StudioHeroSection />
          <div className="px-4 lg:px-8 pb-8">
            {/* Network Warning */}
            <NetworkWarning variant="banner" />
            <InklyStudio />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
