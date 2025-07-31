"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { TrendingUp, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { truncate } from "@/utils/truncate"
import { formatCount } from "@/utils/formatCount"
import Link from "next/link"

interface TrendingInk {
  id: string
  content: string
  author: string
  avatarColor: string
  views: number
  readingTime: string
  trendingScore: number
  timeAgo: string
}

// Memoized Trending Card component for better performance
const SimpleTrendingCard = memo(({ ink, onClick }: { ink: TrendingInk; onClick: () => void }) => {
  const [expanded, setExpanded] = useState(false)
  const TRUNCATE_LENGTH = 120
  
  // Memoize expensive calculations
  const { isTruncatable, displayContent, authorInitials } = useMemo(() => {
    const isTruncatable = ink.content.length > TRUNCATE_LENGTH
    const displayContent = expanded || !isTruncatable ? ink.content : truncate(ink.content, TRUNCATE_LENGTH)
    const authorInitials = ink.author.split(" ").map((n) => n[0]).join("")
    
    return { isTruncatable, displayContent, authorInitials }
  }, [ink.content, ink.author, expanded, TRUNCATE_LENGTH])

  // Memoize event handlers
  const handleCardClick = useCallback(() => {
    onClick()
  }, [onClick])

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpanded(!expanded)
  }, [expanded])

  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <div className="relative">
      <div
        className="w-full bg-card rounded-xl shadow-sm px-4 py-6 mb-4 sm:border sm:border-border cursor-pointer hover:shadow-md transition-shadow min-h-[280px] flex flex-col"
        onClick={handleCardClick}
      >
        {/* Header with author info and trending badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/${encodeURIComponent(ink.author)}`} passHref legacyBehavior>
              <div className="relative cursor-pointer">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={`bg-gradient-to-br ${ink.avatarColor} text-white text-sm font-medium`}>
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
            <Link href={`/${encodeURIComponent(ink.author)}`} className="group">
              <div className="flex flex-col cursor-pointer" onClick={handleAuthorClick}>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  {ink.author}
                </span>
                <span className="text-xs text-muted-foreground">{ink.timeAgo} ago</span>
              </div>
            </Link>
          </div>
          
          {/* Trending Badge - Always visible */}
          <Badge
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 flex items-center gap-1.5 shadow-lg px-3 py-1.5"
            aria-label={`${ink.trendingScore}% trending`}
          >
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-semibold">{ink.trendingScore}%</span>
          </Badge>
        </div>

        {/* Content section */}
        <div className="flex-1 mb-6">
          <div className="text-base sm:text-[16px] md:text-[17px] lg:text-[18px] font-semibold text-foreground leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed whitespace-pre-line">
            <Link href={`/ink/${ink.id}`} passHref legacyBehavior>
              <a style={{ color: "inherit", textDecoration: "none" }} onClick={handleContentClick}>
                {displayContent}
                {isTruncatable && (
                  <button
                    className="ml-2 text-xs text-purple-600 underline hover:text-purple-800 transition-colors font-medium"
                    onClick={handleExpandClick}
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </a>
            </Link>
          </div>
        </div>

        {/* Footer with stats and time */}
        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {formatCount(ink.views)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {ink.readingTime}
              </span>
            </div>
            
            {/* Time Badge - Always visible */}
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm border border-border/50 flex items-center gap-1.5 shadow-sm px-2.5 py-1"
              aria-label={`Posted ${ink.timeAgo} ago`}
            >
              <Clock className="w-3 h-3" aria-hidden="true" />
              {ink.timeAgo}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
})

SimpleTrendingCard.displayName = 'SimpleTrendingCard'

// TODO: Replace with real backend data
// This will be replaced with actual trending inks based on trending algorithm:
// - High echo count (reposts/shares) within time period
// - Rapid engagement growth (views, reactions increasing quickly)
// - Viral coefficient (how many people each viewer shares with)
// - Time decay factor (newer content gets higher priority)
// - Community engagement (comments, bookmarks)
// - Cross-platform sharing metrics
const trendingInks: TrendingInk[] = [
  {
    id: "1",
    content: "Sometimes the most productive thing you can do is rest.",
    author: "Maya Patel",
    avatarColor: "from-emerald-500 to-teal-500",
    views: 2847,
    readingTime: "1m",
    trendingScore: 95,
    timeAgo: "2h",
  },
  {
    id: "2",
    content: "Your anxiety is lying to you. You are loved, you are worthy, you are enough.",
    author: "Dr. Alex Rivera",
    avatarColor: "from-blue-500 to-cyan-500",
    views: 4203,
    readingTime: "1m",
    trendingScore: 92,
    timeAgo: "4h",
  },
  {
    id: "3",
    content: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chen Wei",
    avatarColor: "from-green-500 to-emerald-500",
    views: 1892,
    readingTime: "1m",
    trendingScore: 88,
    timeAgo: "6h",
  },
  {
    id: "4",
    content: "You don't have to be perfect. You just have to be consistent.",
    author: "Sarah Johnson",
    avatarColor: "from-purple-500 to-pink-500",
    views: 3156,
    readingTime: "1m",
    trendingScore: 85,
    timeAgo: "8h",
  },
  {
    id: "5",
    content: "Beneath the silver whisper of the moon,\nA thousand dreams awaken, drift, and swoon.\nThe city sleeps, but in the quiet deep,\nA poet's heart is far too wild to sleep.\n\nShe pens the ache of longing in the night,\nEach stanza trembling, searching for the light.\nHer verses spill like rivers on the page—\nA gentle storm, a captive bird uncaged.\n\nThe world may never know the words she weaves,\nThe secret hopes she tucks beneath her sleeves.\nBut in the hush, her ink becomes the sea—\nEndless, wild, and beautifully free.",
    author: "Marcus Brown",
    avatarColor: "from-orange-500 to-red-500",
    views: 2634,
    readingTime: "1m",
    trendingScore: 82,
    timeAgo: "12h",
  },
  {
    id: "6",
    content: "Your story matters. Your voice matters. You matter.",
    author: "Luna Garcia",
    avatarColor: "from-violet-500 to-purple-500",
    views: 1789,
    readingTime: "1m",
    trendingScore: 78,
    timeAgo: "1d",
  },
]

type TimeFilter = "Day" | "Week" | "Month"

export default function TrendingEchoes() {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("Day")
  const router = useRouter()

  // Memoize event handlers
  const handleInkClick = useCallback((inkId: string) => {
    router.push(`/ink/${inkId}`)
  }, [router])

  const handleFilterChange = useCallback((filter: TimeFilter) => {
    setActiveFilter(filter)
  }, [])

  // Memoize filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(() => {
    return (["Day", "Week", "Month"] as TimeFilter[]).map((filter) => (
      <Button
        key={filter}
        variant={activeFilter === filter ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange(filter)}
        className="h-9 px-4"
      >
        {filter}
      </Button>
    ))
  }, [activeFilter, handleFilterChange])

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" aria-labelledby="trending-echoes-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="trending-echoes-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <span className="text-2xl" role="img" aria-label="Trending up">
                🔥
              </span>
              Trending Echoes
            </h2>
            <p className="text-muted-foreground mt-2">What's resonating with the community</p>
          </div>

          <div className="flex items-center gap-2">
            {filterButtons}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingInks.map((ink) => (
            <div key={ink.id} data-card-type="trending-echo">
              <SimpleTrendingCard ink={ink} onClick={() => handleInkClick(ink.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
