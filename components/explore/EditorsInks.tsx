"use client"

import { useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Eye } from "lucide-react"
import { truncate } from "@/utils/truncate"
import { formatCount } from "@/utils/formatCount"
import Link from "next/link"

interface EditorInk {
  id: string
  content: string
  author: string
  avatarColor: string
  views: number
  readingTime: string
}

// Simplified InkCard component for editors picks
const SimpleInkCard = ({ ink, onClick }: { ink: EditorInk; onClick: () => void }) => {
  const [expanded, setExpanded] = useState(false)
  const TRUNCATE_LENGTH = 120
  const isTruncatable = ink.content.length > TRUNCATE_LENGTH
  const displayContent = expanded || !isTruncatable ? ink.content : truncate(ink.content, TRUNCATE_LENGTH)

  return (
    <div
      className="w-full bg-card rounded-xl shadow-sm px-4 py-5 mb-4 sm:border sm:border-border cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Link href={`/${encodeURIComponent(ink.author)}`} passHref legacyBehavior>
            <div className="relative cursor-pointer">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={`bg-gradient-to-br ${ink.avatarColor} text-white text-sm font-medium`}>
                  {ink.author.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <Link href={`/${encodeURIComponent(ink.author)}`} className="group">
            <div className="flex flex-col -space-y-1 cursor-pointer" onClick={e => e.stopPropagation()}>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                {ink.author}
              </span>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mb-4 text-base sm:text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-foreground leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed whitespace-pre-line sm:px-2 sm:py-2">
        <Link href={`/ink/${ink.id}`} passHref legacyBehavior>
          <a style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
            {displayContent}
            {isTruncatable && (
              <button
                className="ml-2 text-xs text-purple-600 underline hover:text-purple-800 transition-colors font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(!expanded)
                }}
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </a>
        </Link>
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatCount(ink.views)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {ink.readingTime}
        </div>
      </div>
    </div>
  )
}

// TODO: Replace with real backend data
// This will be replaced with actual user-generated inks that meet editor's pick criteria:
// - High engagement (views, reactions, echoes)
// - Quality content (no profanity, meaningful length)
// - Recent activity (within last 7 days)
// - Diverse authors (not all from same user)
// - Positive sentiment score
const editorInks: EditorInk[] = [
  {
    id: "1",
    content: "The moon doesn't compete with the sun. It simply shines when it's time to shine.",
    author: "Luna Martinez",
    avatarColor: "from-purple-500 to-pink-500",
    views: 1247,
    readingTime: "30s",
  },
  {
    id: "2",
    content: "Your healing is not a destination. It's a daily practice of choosing yourself over and over again.",
    author: "Dr. Sarah Chen",
    avatarColor: "from-emerald-500 to-teal-500",
    views: 2103,
    readingTime: "45s",
  },
  {
    id: "3",
    content:
      "We are all just walking each other home. Some paths are longer, some shorter, but we're all heading to the same place.",
    author: "Marcus Thompson",
    avatarColor: "from-blue-500 to-cyan-500",
    views: 1692,
    readingTime: "1m",
  },
  {
    id: "4",
    content: "The art of being happy lies in the power of extracting happiness from common things.",
    author: "Elena Rodriguez",
    avatarColor: "from-orange-500 to-red-500",
    views: 1934,
    readingTime: "35s",
  },
  {
    id: "5",
    content: "Your story is not over. The pen is still in your hand, and there are blank pages waiting.",
    author: "James Wilson",
    avatarColor: "from-violet-500 to-purple-500",
    views: 2456,
    readingTime: "40s",
  },
]

export default function EditorsInks() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const router = useRouter()

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

  const handleInkClick = useCallback((inkId: string) => {
    router.push(`/ink/${inkId}`)
  }, [router])

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
          {editorInks.map((ink) => (
            <div
              key={ink.id}
              className="flex-none w-80 max-w-xs w-full sm:w-80"
              style={{ scrollSnapAlign: "start" }}
            >
              <SimpleInkCard ink={ink} onClick={() => handleInkClick(ink.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
