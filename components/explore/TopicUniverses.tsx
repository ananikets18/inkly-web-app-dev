"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useTopics, TopicsAPI, TopicUniverse } from "@/lib/api/topics"

export default function TopicUniverses() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [clickedTopic, setClickedTopic] = useState<string | null>(null)

  // Use real API hook instead of mock data
  const { data: topicUniverses, loading, error } = useTopics()

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 320
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  const handleTopicClick = useCallback(async (topic: TopicUniverse) => {
    try {
      setClickedTopic(topic.id)
      
      // Track topic click analytics
      // TODO: Replace with real user ID from auth context
      const userId = "current-user-id"
      await TopicsAPI.trackTopicClick(topic.id, userId, {
        source: "explore_page",
      })
      
      // Navigate to topic page
      router.push(`/explore/${topic.id}`)
      
      // Show success toast
      toast({
        title: `Exploring ${topic.name}`,
        description: `Discovering ${topic.count.toLocaleString()} inks about ${topic.name.toLowerCase()}`,
      })
      
    } catch (error) {
      console.error('Error navigating to topic:', error)
      toast({
        title: "Navigation Error",
        description: "Unable to load topic content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setClickedTopic(null)
    }
  }, [router])

  // Loading state
  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="topic-universes-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                id="topic-universes-heading"
                className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
              >
                <span className="text-2xl" role="img" aria-label="Galaxy">
                  🌌
                </span>
                Topic Universes
              </h2>
              <p className="text-muted-foreground mt-2">Explore themes that resonate with your soul</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex-none w-64 bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="h-24 bg-muted" />
                  <div className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="topic-universes-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2
              id="topic-universes-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-4"
            >
              <span className="text-2xl" role="img" aria-label="Galaxy">
                🌌
              </span>
              Topic Universes
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
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
              <span className="text-2xl" role="img" aria-label="Galaxy">
                🌌
              </span>
              Topic Universes
            </h2>
            <p className="text-muted-foreground mt-2">Explore themes that resonate with your soul</p>
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
          aria-label="Topic universes carousel"
        >
          {topicUniverses.map((topic) => (
            <article
              key={topic.id}
              className="flex-none w-64 bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              style={{ scrollSnapAlign: "start" }}
              tabIndex={0}
              role="article"
              aria-labelledby={`topic-${topic.id}-name`}
              onClick={() => handleTopicClick(topic)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTopicClick(topic)
                }
              }}
            >
              <div className={`h-24 bg-gradient-to-br ${topic.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-4xl" role="img" aria-label={topic.name}>
                  {topic.emoji}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    id={`topic-${topic.id}-name`}
                    className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors duration-300"
                  >
                    {topic.name}
                  </h3>
                  <span className="text-sm text-muted-foreground">{topic.count.toLocaleString()}</span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {topic.description}
                </p>

                {/* Loading indicator */}
                {clickedTopic === topic.id && (
                  <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
