"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Compass, RefreshCw } from "lucide-react"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"
import HeroSection from "../../components/explore/HeroSection"
import PerformanceMonitor from "../../components/PerformanceMonitor"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"

// Lazy load heavy components for better performance
const EditorsInks = lazy(() => import("../../components/explore/EditorsInks"))
const TrendingEchoes = lazy(() => import("../../components/explore/TrendingEchoes"))
const TopicUniverses = lazy(() => import("../../components/explore/TopicUniverses"))
const WhatsNewOnInkly = lazy(() => import("../../components/explore/WhatsNewOnInkly"))

// Loading skeleton for lazy components
const ComponentSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`bg-muted rounded-2xl animate-pulse ${height}`} />
)

// Full Page Loader Component for Explore Page
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
            <Compass className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Exploring Inkly
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Discovering trending content and inspiring stories...
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

// Error State Component for Explore Page
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <Compass className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Explore Unavailable
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

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [cardCount, setCardCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading time for better UX
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    setMounted(true)
    
    // Show performance monitor in development mode
    if (process.env.NODE_ENV === 'development') {
      setShowPerformanceMonitor(true)
    }

    // Track card count for performance monitoring
    const updateCardCount = () => {
      const cards = document.querySelectorAll('[data-card-type]')
      setCardCount(cards.length)
    }

    // Update card count after components load
    const timer = setTimeout(updateCardCount, 1000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(loadingTimer)
    }
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  // Show full page loader while data is loading
  if (isLoading) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />
  }

  // Simplified loading state for mounted check
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-row">
          <div className="hidden md:block">
            <SideNav />
          </div>
          <main className="flex-1 max-w-7xl mx-auto">
            <div className="space-y-8 p-8">
              <div className="h-32 bg-muted rounded-2xl animate-pulse" />
              <div className="h-64 bg-muted rounded-2xl animate-pulse" />
              <div className="h-48 bg-muted rounded-2xl animate-pulse" />
              <div className="h-40 bg-muted rounded-2xl animate-pulse" />
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-row w-full">
        <div className="hidden md:block">
          <SideNav />
        </div>

        <main className="flex-1 pb-24 w-full" role="main">
          {/* Network Warning */}
          <NetworkWarning variant="banner" />
          
          {/* Hero Section */}
          <HeroSection />

          {/* Content sections - lazy loaded with suspense */}
          <Suspense fallback={<ComponentSkeleton height="h-96" />}>
            <EditorsInks />
          </Suspense>
          
          <Suspense fallback={<ComponentSkeleton height="h-96" />}>
            <TrendingEchoes />
          </Suspense>
          
          <Suspense fallback={<ComponentSkeleton height="h-64" />}>
            <TopicUniverses />
          </Suspense>
          
          <Suspense fallback={<ComponentSkeleton height="h-80" />}>
            <WhatsNewOnInkly />
          </Suspense>
        </main>
      </div>
      <BottomNav />
      <Footer />
      
      {/* Performance Monitor - only in development */}
      {showPerformanceMonitor && (
        <PerformanceMonitor 
          cardCount={cardCount} 
          isVisible={showPerformanceMonitor} 
        />
      )}
    </div>
  )
}
