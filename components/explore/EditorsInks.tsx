"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Award, Heart, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCount } from "@/utils/formatCount"

interface EditorInk {
  id: string
  content: string
  author: string
  avatarColor: string
  tags: string[]
  reactions: number
  echoes: number
  readingTime: string
}

const editorInks: EditorInk[] = [
  {
    id: "1",
    content: "The moon doesn't compete with the sun. It simply shines when it's time to shine.",
    author: "Luna Martinez",
    avatarColor: "from-purple-500 to-pink-500",
    tags: ["#wisdom", "#nature"],
    reactions: 847,
    echoes: 234,
    readingTime: "30s",
  },
  {
    id: "2",
    content: "Your healing is not a destination. It's a daily practice of choosing yourself over and over again.",
    author: "Dr. Sarah Chen",
    avatarColor: "from-emerald-500 to-teal-500",
    tags: ["#healing", "#selfcare"],
    reactions: 1203,
    echoes: 456,
    readingTime: "45s",
  },
  {
    id: "3",
    content:
      "We are all just walking each other home. Some paths are longer, some shorter, but we're all heading to the same place.",
    author: "Marcus Thompson",
    avatarColor: "from-blue-500 to-cyan-500",
    tags: ["#philosophy", "#connection"],
    reactions: 692,
    echoes: 178,
    readingTime: "1m",
  },
  {
    id: "4",
    content: "The art of being happy lies in the power of extracting happiness from common things.",
    author: "Elena Rodriguez",
    avatarColor: "from-orange-500 to-red-500",
    tags: ["#happiness", "#mindfulness"],
    reactions: 934,
    echoes: 287,
    readingTime: "35s",
  },
  {
    id: "5",
    content: "Your story is not over. The pen is still in your hand, and there are blank pages waiting.",
    author: "James Wilson",
    avatarColor: "from-violet-500 to-purple-500",
    tags: ["#hope", "#resilience"],
    reactions: 1456,
    echoes: 523,
    readingTime: "40s",
  },
]

export default function EditorsInks() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 320
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
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="editors-inks-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="editors-inks-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <span className="text-2xl" role="img" aria-label="Orange heart">
                🧡
              </span>
              Editor's Inks
            </h2>
            <p className="text-muted-foreground mt-2">Handpicked inks that moved us</p>
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
          aria-label="Editor's picks carousel"
        >
          {editorInks.map((ink, index) => (
            <motion.article
              key={ink.id}
              className="flex-none w-80 max-w-xs w-full sm:w-80 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              tabIndex={0}
              role="article"
              aria-labelledby={`ink-${ink.id}-content`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 flex items-center gap-1"
                    aria-label="Editor's pick"
                  >
                    <Award className="w-3 h-3" aria-hidden="true" />
                    Editor's Pick
                  </Badge>
                  <span className="text-xs text-muted-foreground">{ink.readingTime}</span>
                </div>

                <blockquote
                  id={`ink-${ink.id}-content`}
                  className="text-lg font-semibold text-foreground leading-relaxed mb-6 line-clamp-4"
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
                  <div>
                    <p className="text-sm font-medium text-foreground">{ink.author}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {ink.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-purple-600 hover:text-purple-800 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" aria-hidden="true" />
                      <span>{formatCount(ink.reactions)}</span>
                    </div>
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
