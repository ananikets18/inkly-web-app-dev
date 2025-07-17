"use client"

import { motion } from "framer-motion"
import { Zap, ExternalLink, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NewsItem {
  id: string
  type: "feature" | "update" | "spotlight" | "event"
  title: string
  description: string
  image?: string
  badge: string
  link: string
  isNew: boolean
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    type: "feature",
    title: "Mood-Based Discovery",
    description: "Find inks that match your current emotional state with our new AI-powered mood detection.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "New Feature",
    link: "#",
    isNew: true,
  },
  {
    id: "2",
    type: "spotlight",
    title: "Creator Spotlight: Maya Chen",
    description: "Meet the poet whose vulnerability has touched thousands of hearts across the platform.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Spotlight",
    link: "#",
    isNew: false,
  },
  {
    id: "3",
    type: "update",
    title: "Enhanced Echo System",
    description: "Echoes now show emotional resonance levels and suggest similar content you might love.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Update",
    link: "#",
    isNew: true,
  },
  {
    id: "4",
    type: "event",
    title: "Poetry Month Challenge",
    description: "Join thousands in our 30-day poetry challenge. Share your daily verses and win prizes!",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Event",
    link: "#",
    isNew: false,
  },
]

const getBadgeStyle = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    case "update":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    case "spotlight":
      return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
    case "event":
      return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Star className="w-3 h-3" />
    case "update":
      return <Zap className="w-3 h-3" />
    case "spotlight":
      return <Play className="w-3 h-3" />
    case "event":
      return <ExternalLink className="w-3 h-3" />
    default:
      return <Zap className="w-3 h-3" />
  }
}

export default function WhatsNewOnInkly() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="whats-new-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="whats-new-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-4"
          >
            <span className="text-2xl" role="img" aria-label="Lightning bolt">
              ⚡
            </span>
            What's New on Inkly
            <Badge className="ml-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide">
              Fresh
            </Badge>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest features, creator spotlights, and platform updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              tabIndex={0}
              role="article"
              aria-labelledby={`news-${item.id}-title`}
              aria-describedby={`news-${item.id}-description`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  // Handle news item click
                }
              }}
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {item.isNew && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                      New
                    </div>
                  )}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getBadgeStyle(item.type)} border-0 flex items-center gap-1 text-xs`}>
                    {getIcon(item.type)}
                    {item.badge}
                  </Badge>
                </div>

                <h3
                  id={`news-${item.id}-title`}
                  className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors"
                >
                  {item.title}
                </h3>

                <p
                  id={`news-${item.id}-description`}
                  className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4"
                >
                  {item.description}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20 transition-colors"
                  aria-label={`Learn more about ${item.title}`}
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
