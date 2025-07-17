"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  Eye,
  Sparkles,
  Quote,
  BookOpen,
  PenLine,
  Info,
  User,
  Volume2,
  Copy,
  Flag,
  Star,
  Bookmark,
  Share,
  UserPlus,
  Check,
  MessageCircle,
  Pause,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { detectInkType } from "@/utils/detectInkType"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import FloatingToast from "@/components/FloatingToast"
import ReactionButton from "@/components/reaction-button"
import ReflectModal from "@/components/ReflectModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InkDetailsProps {
  ink: {
    id: string
    content: string
    author: string
    username: string
    createdAt: string
    readingTime: string
    views: string
    tags: string[]
    mood?: string
    type?: string
    editedAt?: string
  }
}

// Type configuration for different ink types
const TYPE_CONFIG: Record<
  string,
  {
    color: string
    icon: React.ReactElement
    bgGradient: string
    textColor: string
  }
> = {
  poem: {
    color: "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20",
    icon: <PenLine className="w-5 h-5" />,
    bgGradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  quote: {
    color: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
    icon: <Quote className="w-5 h-5" />,
    bgGradient: "from-blue-500/10 to-cyan-500/10 dark:from-blue-400/10 dark:to-cyan-400/10",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  affirmation: {
    color: "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20",
    icon: <Sparkles className="w-5 h-5" />,
    bgGradient: "from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10",
    textColor: "text-green-700 dark:text-green-300",
  },
  story: {
    color: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
    icon: <BookOpen className="w-5 h-5" />,
    bgGradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-400/10 dark:to-orange-400/10",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  fact: {
    color: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
    icon: <Info className="w-5 h-5" />,
    bgGradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  dialogue: {
    color: "border-pink-200 bg-pink-50/50 dark:border-pink-800 dark:bg-pink-950/20",
    icon: <MessageCircle className="w-5 h-5" />,
    bgGradient: "from-pink-500/10 to-rose-500/10 dark:from-pink-400/10 dark:to-rose-400/10",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  default: {
    color: "border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/20",
    icon: <User className="w-5 h-5" />,
    bgGradient: "from-gray-500/10 to-slate-500/10 dark:from-gray-400/10 dark:to-slate-400/10",
    textColor: "text-gray-700 dark:text-gray-300",
  },
}

// Avatar color utility
const AVATAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-orange-500",
  "from-emerald-500 to-green-500",
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatName(name: string) {
  return name
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default function InkDetails({ ink }: InkDetailsProps) {
  const router = useRouter()
  const { playSound } = useSoundEffects()

  // Interaction states
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showReflectModal, setShowReflectModal] = useState(false)
  const [hasReflected, setHasReflected] = useState(false)
  const [hasInkified, setHasInkified] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMoreActions, setShowMoreActions] = useState(false)

  // Counts (would come from API in real app)
  const [reactionCount, setReactionCount] = useState(Math.floor(Math.random() * 200) + 50)
  const [repostCount, setRepostCount] = useState(Math.floor(Math.random() * 100) + 20)
  const [viewCount] = useState(Number.parseInt(ink.views) || Math.floor(Math.random() * 1000) + 100)

  // Toast messages
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Responsive state
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Detect ink type
  const detectedType = ink.type || detectInkType(ink.content) || "default"
  const typeConfig = TYPE_CONFIG[detectedType.toLowerCase()] || TYPE_CONFIG.default

  // Show toast helper
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Interaction handlers
  const handleReaction = (reactionId: string | null) => {
    const wasSelected = selectedReaction === reactionId
    setSelectedReaction(wasSelected ? null : reactionId)
    setReactionCount((prev) => (wasSelected ? prev - 1 : prev + 1))
    playSound(wasSelected ? "click" : "like")
    showToast(wasSelected ? "Reaction removed" : "Reaction added")
  }

  const handleReflect = () => {
    setShowReflectModal(true)
  }

  const handleInkify = () => {
    setHasInkified(!hasInkified)
    setRepostCount((prev) => (hasInkified ? prev - 1 : prev + 1))
    playSound("click")
    showToast(hasInkified ? "Repost removed" : "Reposted to your timeline")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    playSound("click")
    showToast(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks")
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/ink/${ink.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ink by ${ink.author}`,
          text: ink.content.substring(0, 100) + "...",
          url: url,
        })
        showToast("Shared successfully")
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url)
      showToast("Link copied to clipboard")
    }
    playSound("click")
  }

  const handleCopyContent = async () => {
    await navigator.clipboard.writeText(ink.content)
    showToast("Content copied to clipboard")
    playSound("click")
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    playSound("click")
    showToast(isFollowing ? `Unfollowed ${ink.author}` : `Now following ${ink.author}`)
  }

  const handleReport = () => {
    showToast("Report submitted. Thank you for keeping our community safe.")
    playSound("click")
  }

  // Text-to-speech functionality
  const handleListen = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        showToast("Stopped reading")
      } else {
        const utterance = new SpeechSynthesisUtterance(ink.content)
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
        showToast("Reading ink aloud")
      }
      playSound("click")
    } else {
      showToast("Text-to-speech not supported in your browser")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Floating Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Ink Details</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">by {formatName(ink.author)}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`rounded-full transition-all duration-200 ${
                  isBookmarked
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share"
              >
                <Share className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Author Section */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarColor(ink.author)} text-white font-bold text-lg`}
                        >
                          {getInitials(formatName(ink.author))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors">
                            {formatName(ink.author)}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
                          >
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Level 8
                          </Badge>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          @{ink.username || ink.author.toLowerCase().replace(/\s+/g, "")}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>2.4k followers</span>
                          <span>•</span>
                          <span>156 following</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <Button
                      onClick={handleFollow}
                      className={`self-start sm:self-center px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                        isFollowing
                          ? "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      }`}
                      aria-label={isFollowing ? "Unfollow" : "Follow"}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Ink Content */}
                  <div
                    className={`relative rounded-2xl border-2 ${typeConfig.color} p-6 sm:p-8 bg-gradient-to-br ${typeConfig.bgGradient}`}
                  >
                    <div className="absolute top-4 right-4">
                      <div className={`p-2 rounded-full bg-white/80 dark:bg-gray-800/80 ${typeConfig.textColor}`}>
                        {typeConfig.icon}
                      </div>
                    </div>

                    <div className="prose prose-lg sm:prose-xl max-w-none dark:prose-invert">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
                        {ink.content}
                      </p>
                    </div>
                  </div>

                  {/* Tags and Metadata */}
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={`${typeConfig.textColor} border-current bg-transparent`}>
                        {typeConfig.icon}
                        <span className="ml-1 capitalize">{detectedType}</span>
                      </Badge>
                      {ink.mood && (
                        <Badge
                          variant="secondary"
                          className="capitalize bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300"
                        >
                          {ink.mood}
                        </Badge>
                      )}
                      {ink.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <time dateTime={ink.createdAt}>{formatTimeAgo(ink.createdAt)}</time>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{formatCount(viewCount)} views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{ink.readingTime} read</span>
                      </div>
                      {ink.editedAt && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>Edited {formatTimeAgo(ink.editedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-200"
                      onClick={() => showToast("Engagement details coming soon")}
                    >
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCount(reactionCount)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reactions</div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-200"
                      onClick={() => showToast("Repost details coming soon")}
                    >
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCount(repostCount)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reposts</div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-200"
                      onClick={() => showToast("View details coming soon")}
                    >
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCount(viewCount)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                    </motion.button>
                  </div>

                  <Separator className="my-6" />

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {/* Primary Actions */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1 min-w-0">
                        <ReactionButton
                          onReaction={handleReaction}
                          selectedReaction={selectedReaction}
                          onSoundPlay={playSound}
                          reactionCount={reactionCount}
                          size="lg"
                        />
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleReflect}
                        className="flex-1 min-w-0 h-12 rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 bg-transparent"
                        aria-label="Reflect on this ink"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317"
                          />
                        </svg>
                        <span className="hidden sm:inline">Reflect</span>
                        <span className="font-semibold ml-2">{formatCount(repostCount)}</span>
                      </Button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={handleListen}
                        className={`flex-1 min-w-0 h-12 rounded-xl border-2 transition-all duration-200 ${
                          isPlaying
                            ? "bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400"
                            : "hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 dark:hover:border-orange-700"
                        }`}
                        aria-label={isPlaying ? "Stop reading" : "Listen to ink"}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                        <span className="hidden sm:inline">{isPlaying ? "Stop" : "Listen"}</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleBookmark}
                        className={`flex-1 min-w-0 h-12 rounded-xl border-2 transition-all duration-200 ${
                          isBookmarked
                            ? "bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400"
                            : "hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700"
                        }`}
                        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                      >
                        <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                        <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Save"}</span>
                      </Button>

                      <DropdownMenu open={showMoreActions} onOpenChange={setShowMoreActions}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-12 px-4 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 bg-transparent"
                            aria-label="More options"
                          >
                            {showMoreActions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border-2">
                          <DropdownMenuItem onClick={handleCopyContent} className="rounded-lg">
                            <Copy className="w-4 h-4 mr-3" />
                            Copy content
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleShare} className="rounded-lg">
                            <Share className="w-4 h-4 mr-3" />
                            Share ink
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={handleReport}
                            className="text-red-600 focus:text-red-600 rounded-lg"
                          >
                            <Flag className="w-4 h-4 mr-3" />
                            Report ink
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Content Placeholder */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    More from {formatName(ink.author)}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Discover more inspiring inks from this talented author. Coming soon to your feed.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full px-6 py-2 border-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 bg-transparent"
                    onClick={() => showToast("Author profile coming soon")}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Reflect Modal */}
      <ReflectModal
        open={showReflectModal}
        onClose={() => setShowReflectModal(false)}
        onRepost={() => {
          setHasInkified(true)
          setRepostCount((prev) => prev + 1)
          showToast("Reposted to your timeline")
          setShowReflectModal(false)
        }}
        onUndoRepost={() => {
          setHasInkified(false)
          setRepostCount((prev) => prev - 1)
          showToast("Repost removed")
        }}
        onSubmit={(text) => {
          setHasReflected(true)
          showToast("Your reflection has been added")
          setShowReflectModal(false)
        }}
        originalInk={{
          content: ink.content,
          author: ink.author,
          timestamp: ink.createdAt,
        }}
        hasReflected={hasReflected}
        hasInkified={hasInkified}
      />

      {/* Toast Messages */}
      <AnimatePresence>
        {toastMessage && <FloatingToast key={toastMessage} message={toastMessage} duration={3000} />}
      </AnimatePresence>
    </div>
  )
}
