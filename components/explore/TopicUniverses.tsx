"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopicUniverse {
  id: string
  name: string
  emoji: string
  gradient: string
  count: number
  description: string
}

const topicUniverses: TopicUniverse[] = [
  {
    id: "philosophy",
    name: "Philosophy",
    emoji: "🧘",
    gradient: "from-purple-500 to-indigo-600",
    count: 2847,
    description: "Deep thoughts and existential musings",
  },
  {
    id: "healing",
    name: "Healing",
    emoji: "🧠",
    gradient: "from-emerald-500 to-teal-600",
    count: 3456,
    description: "Mental health and emotional wellness",
  },
  {
    id: "feminism",
    name: "Feminism",
    emoji: "✊",
    gradient: "from-pink-500 to-rose-600",
    count: 1923,
    description: "Empowerment and equality voices",
  },
  {
    id: "creativity",
    name: "Creativity",
    emoji: "🧪",
    gradient: "from-orange-500 to-red-600",
    count: 2134,
    description: "Artistic expression and innovation",
  },
  {
    id: "spirituality",
    name: "Spirituality",
    emoji: "🔮",
    gradient: "from-violet-500 to-purple-600",
    count: 1678,
    description: "Soul searching and inner wisdom",
  },
  {
    id: "love",
    name: "Love",
    emoji: "💕",
    gradient: "from-rose-500 to-pink-600",
    count: 4567,
    description: "Romance, relationships, and connection",
  },
  {
    id: "nature",
    name: "Nature",
    emoji: "🌿",
    gradient: "from-green-500 to-emerald-600",
    count: 1845,
    description: "Earth wisdom and natural beauty",
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    emoji: "🕯️",
    gradient: "from-amber-500 to-orange-600",
    count: 2789,
    description: "Present moment awareness",
  },
  {
    id: "dreams",
    name: "Dreams",
    emoji: "🌙",
    gradient: "from-blue-500 to-indigo-600",
    count: 1234,
    description: "Aspirations and night visions",
  },
  {
    id: "resilience",
    name: "Resilience",
    emoji: "💪",
    gradient: "from-cyan-500 to-blue-600",
    count: 2456,
    description: "Strength through adversity",
  },
]

export default function TopicUniverses() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 280
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
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="topic-universes-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="topic-universes-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <span className="text-2xl" role="img" aria-label="Planet">
                🪐
              </span>
              Topic Universes
            </h2>
            <p className="text-muted-foreground mt-2">Explore vast realms of thought</p>
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

        {/* Desktop/Tablet Carousel */}
        <div className="hidden sm:block w-full">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pb-4 w-full"
            style={{ scrollSnapType: "x mandatory" }}
            role="region"
            aria-label="Topic universes carousel"
          >
            {topicUniverses.map((topic, index) => (
              <motion.button
                key={topic.id}
                className={`flex-none w-64 max-w-xs w-full sm:w-64 h-32 relative rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                style={{ scrollSnapAlign: "start" }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-labelledby={`topic-${topic.id}-name`}
                aria-describedby={`topic-${topic.id}-description`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient}`} />

                {/* Content */}
                <div className="relative h-full p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={topic.name}>
                      {topic.emoji}
                    </span>
                    <div className="text-left">
                      <h3 id={`topic-${topic.id}-name`} className="font-bold text-lg">
                        {topic.name}
                      </h3>
                      <p id={`topic-${topic.id}-description`} className="text-sm opacity-90">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs opacity-75">{topic.count.toLocaleString()} inks</span>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3 w-full">
          {topicUniverses.map((topic, index) => (
            <motion.button
              key={topic.id}
              className={`h-24 relative rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              aria-labelledby={`topic-mobile-${topic.id}-name`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient}`} />

              {/* Content */}
              <div className="relative h-full p-3 flex flex-col justify-center items-center text-white text-center">
                <span className="text-xl mb-1" role="img" aria-label={topic.name}>
                  {topic.emoji}
                </span>
                <h3 id={`topic-mobile-${topic.id}-name`} className="font-semibold text-sm">
                  {topic.name}
                </h3>
                <span className="text-xs opacity-75 mt-1">
                  {topic.count > 1000 ? `${Math.round(topic.count / 1000)}k` : topic.count}
                </span>
              </div>

              {/* Tap overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
