"use client"
import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  Globe,
  Users,
  Lock,
  Sparkles,
  Trophy,
  Zap,
  Copy,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { cn } from "@/lib/utils"
import ReactionButton from "@/components/reaction-button"
import { VerifiedTick, getUserBadgeType, shouldShowVerifiedTick, getDisplayName } from "./ui/user-badges"
import { AvatarBadge } from "./ui/user-badges"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import ResponsiveInkCard from "./ResponsiveInkCard"
import ShareButton from "./ShareButton"
import ReflectModal from "./ReflectModal"
import ShareModal from "./ShareModal"
import ReportModal from "./ReportModal"

interface InkDetailsProps {
  ink: {
    id: string
    content: string
    author: string
    username: string
    createdAt: string
    readingTime: string
    views: string
    type: string
    theme?: number
    visibility?: string
    tags?: string[]
    likes?: number
    comments?: number
    bookmarks?: number
    xpEarned?: number
    echoCount?: number
  }
}

// Background themes matching the create page
const BACKGROUND_THEMES = [
  {
    name: "Pure White",
    bg: "bg-white",
    text: "text-gray-900",
  },
  {
    name: "Soft Paper",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
    text: "text-gray-900",
  },
  {
    name: "Ocean Breeze",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    text: "text-gray-900",
  },
  {
    name: "Forest Mist",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    text: "text-gray-900",
  },
  {
    name: "Lavender Dream",
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    text: "text-gray-900",
  },
  {
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-orange-100 to-pink-100",
    text: "text-gray-900",
  },
  {
    name: "Rose Garden",
    bg: "bg-gradient-to-br from-rose-50 to-pink-100",
    text: "text-gray-900",
  },
  {
    name: "Golden Hour",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    text: "text-gray-900",
  },
  {
    name: "Mint Fresh",
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    text: "text-gray-900",
  },
  {
    name: "Sky Blue",
    bg: "bg-gradient-to-br from-sky-50 to-blue-100",
    text: "text-gray-900",
  },
  {
    name: "Coral Reef",
    bg: "bg-gradient-to-br from-orange-100 to-pink-100",
    text: "text-gray-900",
  },
  {
    name: "Sage Wisdom",
    bg: "bg-gradient-to-br from-green-100 to-emerald-200",
    text: "text-gray-900",
  },
  {
    name: "Aurora Borealis",
    bg: "bg-gradient-to-br from-green-200 via-blue-200 to-purple-300",
    text: "text-gray-900",
  },
  {
    name: "Cosmic Nebula",
    bg: "bg-gradient-to-br from-purple-300 via-pink-300 to-indigo-400",
    text: "text-gray-900",
  },
  {
    name: "Fire Sunset",
    bg: "bg-gradient-to-br from-red-200 via-orange-300 to-yellow-400",
    text: "text-gray-900",
  },
  {
    name: "Ocean Depths",
    bg: "bg-gradient-to-br from-blue-300 via-teal-400 to-cyan-500",
    text: "text-white",
  },
  {
    name: "Tropical Paradise",
    bg: "bg-gradient-to-br from-lime-200 via-green-300 to-emerald-400",
    text: "text-gray-900",
  },
  {
    name: "Midnight Blue",
    bg: "bg-gradient-to-br from-slate-800 to-blue-900",
    text: "text-white",
  },
  {
    name: "Deep Forest",
    bg: "bg-gradient-to-br from-green-800 to-emerald-900",
    text: "text-white",
  },
  {
    name: "Royal Purple",
    bg: "bg-gradient-to-br from-purple-800 to-indigo-900",
    text: "text-white",
  },
  {
    name: "Charcoal",
    bg: "bg-gradient-to-br from-gray-800 to-slate-900",
    text: "text-white",
  },
  {
    name: "Wine Red",
    bg: "bg-gradient-to-br from-red-800 to-rose-900",
    text: "text-white",
  },
  {
    name: "Electric Blue",
    bg: "bg-gradient-to-br from-cyan-200 to-blue-300",
    text: "text-gray-900",
  },
  {
    name: "Neon Gradient",
    bg: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
    text: "text-white",
  },
  {
    name: "Warm Sunset",
    bg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
    text: "text-white",
  },
]

// Generate sample data for related content
const generateSampleInks = (count: number, authorName?: string) => {
  const sampleContents = [
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    "Whisper to the universe what you seek and it shall echo back tenfold.",
    "Every time your heart is broken, a doorway cracks open to a world full of new beginnings.",
    "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
    "Some stories aren't written. They're felt.",
    "In the silence between heartbeats, I found my truth.",
    "Dreams are the universe's way of showing us what's possible.",
    "The best conversations happen in the spaces between words.",
    "Sometimes the most profound journeys happen while standing still.",
  ]

  const authors = authorName
    ? [authorName]
    : [
        "Maya Chen",
        "Alex Rivera",
        "Jordan Kim",
        "Sam Taylor",
        "Riley Morgan",
        "Casey Wong",
        "Drew Parker",
        "Sage Williams",
        "Quinn Davis",
        "Rowan Lee",
      ]

  const avatarColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-rose-500 to-pink-500",
    "from-emerald-500 to-green-500",
    "from-amber-500 to-orange-500",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1000,
    content: sampleContents[i % sampleContents.length],
    author: authors[i % authors.length],
    avatarColor: avatarColors[i % avatarColors.length],
    isLong: false,
    readingTime: { text: `${Math.floor(Math.random() * 3) + 1} min`, minutes: Math.floor(Math.random() * 3) + 1 },
    views: Math.floor(Math.random() * 1000) + 100,
    echoCount: Math.floor(Math.random() * 50),
    reaction: { reaction: "", count: 0 },
    bookmarkCount: Math.floor(Math.random() * 20),
    hasReflected: false,
    hasInkified: false,
    reactionCount: Math.floor(Math.random() * 30),
    reflectionCount: Math.floor(Math.random() * 15),
    shareCount: Math.floor(Math.random() * 10),
    shareUrl: "#",
    onClick: () => {},
    onHover: () => {},
    onReact: () => {},
    onBookmark: () => {},
    onShare: () => {},
    onFollow: () => {},
  }))
}

// Author Header Component
const AuthorHeader = ({
  ink,
  isFollowing,
  onFollowClick,
  isFollowLoading,
}: {
  ink: InkDetailsProps["ink"]
  isFollowing: boolean
  onFollowClick: () => void
  isFollowLoading: boolean
}) => {
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href={`/${encodeURIComponent(ink.author)}`} className="group">
          <div
            className={`relative ${getUserBadgeType(ink.author) ? "p-0.5 rounded-full" : ""} ${
              getUserBadgeType(ink.author) === "creator"
                ? "bg-gradient-to-r from-purple-400 to-pink-400"
                : getUserBadgeType(ink.author) === "admin"
                  ? "bg-gradient-to-r from-red-400 to-pink-400"
                  : getUserBadgeType(ink.author) === "moderator"
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                    : getUserBadgeType(ink.author) === "contributor"
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : getUserBadgeType(ink.author) === "writer"
                        ? "bg-gradient-to-r from-orange-400 to-amber-400"
                        : getUserBadgeType(ink.author) === "author"
                          ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                          : ""
            }`}
          >
            <Avatar className="w-12 h-12 group-hover:scale-105 transition-transform duration-200">
              <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-medium">
                {getDisplayName(ink.author)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {getUserBadgeType(ink.author) && <AvatarBadge type={getUserBadgeType(ink.author)!} />}
          </div>
        </Link>

        <div className="flex flex-col">
          <Link href={`/${encodeURIComponent(ink.author)}`} className="group">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-purple-600 transition-colors flex items-center gap-2">
              {getDisplayName(ink.author)}
              {!getUserBadgeType(ink.author) && shouldShowVerifiedTick(ink.author) && <VerifiedTick />}
            </h3>
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatTimeAgo(ink.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {ink.visibility === "followers" ? (
                <Users className="w-4 h-4" />
              ) : ink.visibility === "private" ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              {ink.visibility === "followers" ? "Followers only" : ink.visibility === "private" ? "Private" : "Public"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div>
          <Button
            onClick={onFollowClick}
            disabled={isFollowLoading}
            className={cn(
              "px-6 py-2 rounded-full font-medium transition-all duration-200",
              isFollowing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl",
            )}
          >
            {isFollowLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
              "Following"
            ) : (
              "Follow"
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowShareModal(true)}>
              <Copy className="w-4 h-4 mr-2" />
              Share Ink
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => setShowReportModal(true)}>
              <Flag className="w-4 h-4 mr-2" />
              Report Content
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} url={shareUrl} />
        <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} inkId={ink.id} content={ink.content} />
      </div>
    </div>
  )
}

// Main Ink Content Component
const InkContent = ({ ink }: { ink: InkDetailsProps["ink"] }) => {
  const theme = ink.theme !== undefined ? BACKGROUND_THEMES[ink.theme] : BACKGROUND_THEMES[0]

  return (
    <div className="mb-8">
      <Card className="border-0 shadow overflow-hidden">
        <CardContent className="p-0">
          <div className={cn("px-12 py-16 min-h-[400px] flex items-center justify-center", theme.bg, theme.text)}>
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl lg:text-3xl leading-relaxed font-light whitespace-pre-wrap text-center">
                {ink.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Engagement Bar Component
const EngagementBar = ({
  ink,
  stats,
  onReaction,
  onBookmark,
  onShare,
  isBookmarked,
  currentReaction,
}: {
  ink: InkDetailsProps["ink"]
  stats: { likes: number; bookmarks: number; comments: number }
  onReaction: (reaction: string | null) => void
  onBookmark: () => void
  onShare: () => void
  isBookmarked: boolean
  currentReaction: string | null
}) => {
  const { playSound } = useSoundEffects()
  const [reflectOpen, setReflectOpen] = useState(false)

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8 shadow">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Reaction Button */}
          <div>
            <div className="flex items-center gap-2">
              <ReactionButton
                onReaction={onReaction}
                selectedReaction={currentReaction}
                onSoundPlay={() => playSound("hover")}
                size="lg"
              />
              {stats.likes > 0 && (
                <span className="text-sm font-medium text-muted-foreground">{formatCount(stats.likes)}</span>
              )}
            </div>
          </div>

          {/* Reflect/Inkify Button */}
          <div>
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center gap-2 rounded-full px-4"
              onClick={() => setReflectOpen(true)}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Reflect</span>
              {stats.comments > 0 && (
                <span className="text-sm text-muted-foreground">{formatCount(stats.comments)}</span>
              )}
            </Button>
            <ReflectModal
              open={reflectOpen}
              onClose={() => setReflectOpen(false)}
              onRepost={() => setReflectOpen(false)}
              onUndoRepost={() => {}}
              onSubmit={() => setReflectOpen(false)}
              originalInk={{ content: ink.content, author: ink.author, timestamp: ink.createdAt }}
              hasReflected={false}
              hasInkified={false}
            />
          </div>

          {/* Bookmark Button */}
          <div>
            <Button
              variant="ghost"
              size="lg"
              onClick={onBookmark}
              className={cn("flex items-center gap-2 rounded-full px-4", isBookmarked ? "text-purple-600" : "")}
            >
              <Bookmark className={cn("w-5 h-5", isBookmarked ? "fill-current" : "")} />
              <span className="font-medium">Save</span>
              {stats.bookmarks > 0 && (
                <span className="text-sm text-muted-foreground">{formatCount(stats.bookmarks)}</span>
              )}
            </Button>
          </div>

        </div>
      </div>

      {/* Echoes Count & Stats Row */}
      <div className="flex items-center justify-between mb-4">
        {typeof ink.echoCount === "number" ? (
          <div className="flex items-center gap-2 text-purple-700 font-medium">
            <Sparkles className="w-5 h-5" />
            <span>{formatCount(ink.echoCount)} Echoes</span>
          </div>
        ) : <div />}
        <div className="flex items-center text-sm text-muted-foreground gap-6">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatCount(Number.parseInt(ink.views))} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {ink.readingTime}
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            {ink.type}
          </span>
          {ink.xpEarned && (
            <span className="flex items-center gap-1 text-purple-600 font-medium">
              <Zap className="w-4 h-4" />+{ink.xpEarned} XP
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Tags Component
const TagsSection = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors px-3 py-1 text-sm"
            >
              #{tag}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

// More from Author Component
const MoreFromAuthor = ({ authorName }: { authorName: string }) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const sampleInks = useMemo(() => generateSampleInks(8, authorName), [authorName])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("author-scroll")
    if (container) {
      const scrollAmount = 320
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">More from {getDisplayName(authorName)}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="rounded-full">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        id="author-scroll"
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sampleInks.map((ink, index) => (
          <div
            key={ink.id}
            className="flex-shrink-0 w-80"
          >
            <ResponsiveInkCard {...ink} small />
          </div>
        ))}
      </div>
    </div>
  )
}

// Suggested Inks Component
const SuggestedInks = () => {
  const sampleInks = useMemo(() => generateSampleInks(12), [])

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-foreground mb-6">Suggested Inks</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleInks.map((ink, index) => (
          <div
            key={ink.id}
            className="flex-shrink-0 w-full"
          >
            <ResponsiveInkCard {...ink} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InkDetails({ ink }: InkDetailsProps) {
  const router = useRouter()
  const { playSound } = useSoundEffects()

  // State management
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentReaction, setCurrentReaction] = useState<string | null>(null)
  const [stats, setStats] = useState({
    likes: ink.likes || 0,
    bookmarks: ink.bookmarks || 0,
    comments: ink.comments || 0,
  })

  // Handlers
  const handleFollowClick = useCallback(() => {
    setIsFollowLoading(true)
    playSound(isFollowing ? "modalClose" : "follow")

    setTimeout(() => {
      setIsFollowing(!isFollowing)
      setIsFollowLoading(false)
    }, 1000)
  }, [isFollowing, playSound])

  const handleReaction = useCallback(
    (reaction: string | null) => {
      const hadReaction = currentReaction !== null
      const willReact = reaction !== null

      setCurrentReaction(reaction)
      setStats((prev) => ({
        ...prev,
        likes:
          !hadReaction && willReact
            ? prev.likes + 1
            : hadReaction && !willReact
              ? Math.max(0, prev.likes - 1)
              : prev.likes,
      }))

      if (reaction) playSound("like")
    },
    [currentReaction, playSound],
  )

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked)
    setStats((prev) => ({
      ...prev,
      bookmarks: isBookmarked ? Math.max(0, prev.bookmarks - 1) : prev.bookmarks + 1,
    }))
    // playSound(isBookmarked ? "unbookmark" : "bookmark")
  }, [isBookmarked, playSound])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Ink by ${ink.author}`,
        text: ink.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
    // playSound("share")
  }, [ink.author, ink.content, playSound])

  return (
    <div className="min-h-screen">
      {/* Immersive Full-Width Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Author Header */}
        <AuthorHeader
          ink={ink}
          isFollowing={isFollowing}
          onFollowClick={handleFollowClick}
          isFollowLoading={isFollowLoading}
        />

        {/* Main Ink Content */}
        <InkContent ink={ink} />

        {/* Engagement Bar */}
        <EngagementBar
          ink={ink}
          stats={stats}
          onReaction={handleReaction}
          onBookmark={handleBookmark}
          onShare={handleShare}
          isBookmarked={isBookmarked}
          currentReaction={currentReaction}
        />

        {/* Tags */}
        <TagsSection tags={ink.tags} />

        {/* XP Earned Display */}
        {ink.xpEarned && (
          <div
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-lg">XP Earned</h4>
                <p className="text-purple-700 dark:text-purple-300">
                  You earned {ink.xpEarned} XP for this quality content!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{ink.xpEarned}</span>
              </div>
            </div>
          </div>
        )}

        {/* More from Author */}
        <MoreFromAuthor authorName={ink.author} />

        {/* Suggested Inks */}
        <SuggestedInks />
      </div>
    </div>
  )
}
