"use client"

import { Zap, ExternalLink, Play, Star, BarChart3, BookOpen, PenTool, Users, Bell } from "lucide-react"
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
    title: "Inkly Studio - Creator Dashboard",
    description: "Track your content performance with detailed analytics, manage drafts, and monitor your growth with our comprehensive creator tools.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "New Feature",
    link: "/studio",
    isNew: true,
  },
  {
    id: "2",
    type: "feature",
    title: "Collections & Bookmarks",
    description: "Organize your favorite inks into personalized collections. Save inspiration, create themed collections, and keep your discoveries organized.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "New Feature",
    link: "/profile",
    isNew: true,
  },
  {
    id: "3",
    type: "update",
    title: "Enhanced Echo System",
    description: "React with emotions, add reflections, and share your thoughts. Our echo system now includes reactions, bookmarks, and meaningful interactions.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Update",
    link: "/",
    isNew: false,
  },
  {
    id: "4",
    type: "feature",
    title: "Personal Analytics Dashboard",
    description: "Track your writing journey with detailed insights. Monitor your XP progress, view engagement metrics, and understand your audience better.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "New Feature",
    link: "/analytics",
    isNew: true,
  },
  {
    id: "5",
    type: "update",
    title: "Smart Draft Management",
    description: "Save your work in progress with our enhanced draft system. Auto-save, organize drafts, and never lose your creative flow again.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Update",
    link: "/drafts",
    isNew: false,
  },
  {
    id: "6",
    type: "spotlight",
    title: "Community Spotlight: Maya Chen",
    description: "Meet the poet whose vulnerability has touched thousands of hearts across the platform. Discover her journey and latest works.",
    image: "/placeholder.svg?height=120&width=200",
    badge: "Spotlight",
    link: "/maya_chen",
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
            <span className="text-2xl" role="img" aria-label="Sparkles">
              ✨
            </span>
            What's New on Inkly
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest features, updates, and community highlights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              tabIndex={0}
              role="article"
              aria-labelledby={`news-${item.id}-title`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className={`${getBadgeStyle(item.type)} border-0 flex items-center gap-1`}
                    aria-label={item.badge}
                  >
                    {getIcon(item.type)}
                    {item.badge}
                  </Badge>
                  {item.isNew && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                <h3
                  id={`news-${item.id}-title`}
                  className="text-lg font-semibold text-foreground mb-3 leading-tight"
                >
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {item.description}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (item.link.startsWith('/')) {
                      window.location.href = item.link
                    } else {
                      window.open(item.link, '_blank')
                    }
                  }}
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-2" aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
