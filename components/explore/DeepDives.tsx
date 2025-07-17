"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeepDive {
  id: string
  title: string
  description: string
  emoji: string
  gradient: string
  pattern: string
  count: number
}

const deepDives: DeepDive[] = [
  {
    id: "inner-child",
    title: "Inner Child",
    description: "Reconnect with wonder, play, and authentic joy",
    emoji: "🧸",
    gradient: "from-pink-400 via-rose-400 to-orange-400",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    count: 1247,
  },
  {
    id: "silence-sound",
    title: "Silence & Sound",
    description: "The poetry of quiet moments and meaningful noise",
    emoji: "🌊",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    pattern:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)",
    count: 892,
  },
  {
    id: "digital-nostalgia",
    title: "Digital Nostalgia",
    description: "When technology meets memory and longing",
    emoji: "📱",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    pattern:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 8px)",
    count: 634,
  },
  {
    id: "urban-solitude",
    title: "Urban Solitude",
    description: "Finding peace in the chaos of city life",
    emoji: "🏙️",
    gradient: "from-gray-600 via-slate-600 to-zinc-600",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
    count: 1089,
  },
  {
    id: "creative-flow",
    title: "Creative Flow",
    description: "The magic of inspiration and artistic expression",
    emoji: "🎨",
    gradient: "from-emerald-400 via-green-500 to-lime-500",
    pattern: "conic-gradient(from 0deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1))",
    count: 756,
  },
  {
    id: "midnight-thoughts",
    title: "Midnight Thoughts",
    description: "The profound clarity that comes with darkness",
    emoji: "🌙",
    gradient: "from-indigo-600 via-purple-600 to-blue-800",
    pattern: "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
    count: 1456,
  },
]

export default function DeepDives() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 350
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="deep-dives-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="deep-dives-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <span className="text-2xl" role="img" aria-label="Ocean wave">
                🌊
              </span>
              Deep Dives
            </h2>
            <p className="text-muted-foreground mt-2">Thematic journeys for the curious soul</p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="h-10 w-10 rounded-full"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="h-10 w-10 rounded-full"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pb-4 w-full"
          style={{ scrollSnapType: "x mandatory" }}
          role="region"
          aria-label="Deep dives carousel"
        >
          {deepDives.map((dive, index) => (
            <motion.div
              key={dive.id}
              className="flex-none w-80 max-w-xs w-full sm:w-80 h-48 relative rounded-2xl overflow-hidden group cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              tabIndex={0}
              role="button"
              aria-labelledby={`dive-${dive.id}-title`}
              aria-describedby={`dive-${dive.id}-description`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  // Handle dive selection
                }
              }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dive.gradient}`} />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: dive.pattern }} />

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                <div>
                  <div className="text-4xl mb-3" role="img" aria-label={dive.title}>
                    {dive.emoji}
                  </div>
                  <h3 id={`dive-${dive.id}-title`} className="text-xl font-bold mb-2">
                    {dive.title}
                  </h3>
                  <p id={`dive-${dive.id}-description`} className="text-sm opacity-90 leading-relaxed">
                    {dive.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-75">{dive.count.toLocaleString()} inks</span>
                  <div className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Explore
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
