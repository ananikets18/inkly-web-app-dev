"use client"

import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState, useMemo, useRef } from "react"

export default function HeroSection() {
  const [particlePositions, setParticlePositions] = useState<{ x: number; y: number }[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleMotionPreferenceChange)

    // Set up intersection observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Initialize particle positions only if motion is not reduced
    if (!prefersReducedMotion) {
      const positions = Array.from({ length: 20 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
      setParticlePositions(positions)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange)
      observer.disconnect()
    }
  }, [prefersReducedMotion])

  // Memoize particle components to prevent unnecessary re-renders
  const particleComponents = useMemo(() => {
    if (prefersReducedMotion || !isVisible) return null

    return particlePositions.map((pos, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-purple-400/20 dark:bg-purple-300/20 rounded-full"
        initial={{
          x: pos.x,
          y: pos.y,
        }}
        animate={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    ))
  }, [particlePositions, prefersReducedMotion, isVisible])

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 px-4 sm:px-6 lg:px-8 w-full overflow-hidden" 
      aria-labelledby="hero-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950/20 dark:via-background dark:to-orange-950/20" />

      {/* Animated background particles - only render when visible and motion not reduced */}
      {!prefersReducedMotion && isVisible && (
        <div className="absolute inset-0">
          {particleComponents}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.3 : 0.8,
            delay: prefersReducedMotion ? 0 : 0
          }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 mb-6 leading-tight"
        >
          Explore Yourself
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.3 : 0.8, 
            delay: prefersReducedMotion ? 0.1 : 0.2 
          }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Dive into voices, echoes, and themes that connect with you
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.3 : 0.8, 
            delay: prefersReducedMotion ? 0.2 : 0.4 
          }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-purple-500" aria-hidden="true" />
          <span className="text-sm text-muted-foreground font-medium">Your emotional journey begins here</span>
          <Sparkles className="w-5 h-5 text-orange-500" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
}
