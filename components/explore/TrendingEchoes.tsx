"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Heart, MessageCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCount } from "@/utils/formatCount"

interface TrendingInk {
  id: string
  content: string
  author: string
  avatarColor: string
  tags: string[]
  reactions: number
  echoes: number
  timeAgo: string
  trendingScore: number
}

const trendingInks: TrendingInk[] = [
  {
    id: "1",
    content: "Sometimes the most productive thing you can do is rest.",
    author: "Maya Patel",
    avatarColor: "from-emerald-500 to-teal-500",
    tags: ["#rest", "#productivity"],
    reactions: 2847,
    echoes: 634,
    timeAgo: "2h",
    trendingScore: 95,
  },
  {
    id: "2",
    content: "Your anxiety is lying to you. You are loved, you are worthy, you are enough.",
    author: "Dr. Alex Rivera",
    avatarColor: "from-blue-500 to-cyan-500",
    tags: ["#mentalhealth", "#anxiety"],
    reactions: 4203,
    echoes: 1256,
    timeAgo: "4h",
    trendingScore: 92,
  },
  {
    id: "3",
    content: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chen Wei",
    avatarColor: "from-green-500 to-emerald-500",
    tags: ["#motivation", "#action"],
    reactions: 1892,
    echoes: 445,
    timeAgo: "6h",
    trendingScore: 88,
  },
  {
    id: "4",
    content: "You don't have to be perfect. You just have to be consistent.",
    author: "Sarah Johnson",
    avatarColor: "from-purple-500 to-pink-500",
    tags: ["#consistency", "#growth"],
    reactions: 3156,
    echoes: 789,
    timeAgo: "8h",
    trendingScore: 85,
  },
  {
    id: "5",
    content: "Healing isn't about forgetting. It's about remembering without the pain.",
    author: "Marcus Brown",
    avatarColor: "from-orange-500 to-red-500",
    tags: ["#healing", "#trauma"],
    reactions: 2634,
    echoes: 567,
    timeAgo: "12h",
    trendingScore: 82,
  },
  {
    id: "6",
    content: "Your story matters. Your voice matters. You matter.",
    author: "Luna Garcia",
    avatarColor: "from-violet-500 to-purple-500",
    tags: ["#selfworth", "#validation"],
    reactions: 1789,
    echoes: 334,
    timeAgo: "1d",
    trendingScore: 78,
  },
]

type TimeFilter = "Day" | "Week" | "Month"

export default function TrendingEchoes() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("Day")
  const [pulsingId, setPulsingId] = useState<string | null>(null)

  const handleEchoClick = (id: string) => {
    setPulsingId(id)
    setTimeout(() => setPulsingId(null), 600)
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="trending-echoes-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2
              id="trending-echoes-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <span className="text-2xl" role="img" aria-label="Fire">
                🔥
              </span>
              Trending Echoes
            </h2>
            <p className="text-muted-foreground mt-2">Inks resonating across souls</p>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-1" role="tablist" aria-label="Time filter">
            {(["Day", "Week", "Month"] as TimeFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter ? "shadow-sm bg-purple-500 hover:bg-purple-600" : "hover:bg-background/50 "
                }`}
                role="tab"
                aria-selected={activeFilter === filter}
                aria-controls={`trending-${filter.toLowerCase()}-panel`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            role="tabpanel"
            id={`trending-${activeFilter.toLowerCase()}-panel`}
            aria-labelledby="trending-echoes-heading"
          >
            {trendingInks.map((ink, index) => (
              <motion.article
                key={ink.id}
                className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden group hover:shadow-xl transition-all duration-300 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
                tabIndex={0}
                role="article"
                aria-labelledby={`trending-ink-${ink.id}-content`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-500" aria-hidden="true" />
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                        {ink.trendingScore}% trending
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <time dateTime={ink.timeAgo}>{ink.timeAgo}</time>
                    </div>
                  </div>

                  <blockquote
                    id={`trending-ink-${ink.id}-content`}
                    className="text-base font-semibold text-foreground leading-relaxed mb-4 line-clamp-3"
                  >
                    "{ink.content}"
                  </blockquote>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className={`bg-gradient-to-br ${ink.avatarColor} text-white text-xs font-medium`}>
                        {ink.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{ink.author}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {ink.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-purple-600 hover:text-purple-800 cursor-pointer transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            // Handle tag click
                          }
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        aria-label={`${formatCount(ink.reactions)} reactions`}
                      >
                        <Heart className="w-4 h-4" aria-hidden="true" />
                        <span>{formatCount(ink.reactions)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
