"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Bookmark, UserPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCount } from "@/utils/formatCount"

interface ResonantInk {
  id: string
  content: string
  author: string
  avatarColor: string
  tags: string[]
  reactions: number
  echoes: number
  bookmarks: number
  timeAgo: string
  resonanceReason: string
}

const resonantInks: ResonantInk[] = [
  {
    id: "1",
    content: "The wound is the place where the Light enters you. Every scar tells a story of survival.",
    author: "Rumi Inspired",
    avatarColor: "from-amber-500 to-orange-500",
    tags: ["#healing", "#wisdom"],
    reactions: 1847,
    echoes: 423,
    bookmarks: 267,
    timeAgo: "3h",
    resonanceReason: "Based on your #healing bookmarks",
  },
  {
    id: "2",
    content: "You are not behind in life. There is no timeline you must follow. Your journey is uniquely yours.",
    author: "Maya Angelou Vibes",
    avatarColor: "from-purple-500 to-pink-500",
    tags: ["#selfcompassion", "#journey"],
    reactions: 2156,
    echoes: 634,
    bookmarks: 445,
    timeAgo: "5h",
    resonanceReason: "Matches your recent #journey interactions",
  },
  {
    id: "3",
    content: "Breathe in peace, breathe out anxiety. You have survived 100% of your difficult days so far.",
    author: "Mindful Soul",
    avatarColor: "from-emerald-500 to-teal-500",
    tags: ["#anxiety", "#mindfulness"],
    reactions: 3247,
    echoes: 892,
    bookmarks: 567,
    timeAgo: "1d",
    resonanceReason: "Similar to your saved #mindfulness content",
  },
  {
    id: "4",
    content: "Your sensitivity is not a weakness. It's your superpower in a world that needs more empathy.",
    author: "Empath Guide",
    avatarColor: "from-blue-500 to-cyan-500",
    tags: ["#sensitivity", "#empathy"],
    reactions: 1634,
    echoes: 378,
    bookmarks: 234,
    timeAgo: "2d",
    resonanceReason: "Resonates with your emotional journey",
  },
  {
    id: "5",
    content: "Sometimes the most revolutionary thing you can do is rest without guilt.",
    author: "Rest Advocate",
    avatarColor: "from-violet-500 to-purple-500",
    tags: ["#rest", "#selfcare"],
    reactions: 2789,
    echoes: 567,
    bookmarks: 389,
    timeAgo: "2d",
    resonanceReason: "Aligns with your #selfcare mood",
  },
  {
    id: "6",
    content: "Your story is still being written. Don't let anyone else hold the pen.",
    author: "Story Keeper",
    avatarColor: "from-rose-500 to-pink-500",
    tags: ["#empowerment", "#story"],
    reactions: 1923,
    echoes: 445,
    bookmarks: 312,
    timeAgo: "3d",
    resonanceReason: "Based on your reading patterns",
  },
]

export default function YouMayResonateWith() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="resonate-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="resonate-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-4"
          >
            <span className="text-2xl" role="img" aria-label="Sparkles">
              💫
            </span>
            You may resonate with...
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your emotional journey and past interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {resonantInks.map((ink, index) => (
            <motion.article
              key={ink.id}
              className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden group hover:shadow-xl transition-all duration-300 relative w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              tabIndex={0}
              role="article"
              aria-labelledby={`resonate-ink-${ink.id}-content`}
            >
              {/* Resonance indicator */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span className="sr-only">Personalized recommendation: </span>
                Match
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-3">{ink.resonanceReason}</p>
                </div>

                <blockquote
                  id={`resonate-ink-${ink.id}-content`}
                  className="text-base font-semibold text-foreground leading-relaxed mb-4 line-clamp-4"
                >
                  "{ink.content}"
                </blockquote>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`bg-gradient-to-br ${ink.avatarColor} text-white text-sm font-medium`}>
                      {ink.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{ink.author}</p>
                    <p className="text-xs text-muted-foreground">{ink.timeAgo}</p>
                  </div>
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
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <button
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      aria-label={`${formatCount(ink.reactions)} reactions`}
                    >
                      <Heart className="w-4 h-4" aria-hidden="true" />
                      <span>{formatCount(ink.reactions)}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 px-2"
                      aria-label="Follow author"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
