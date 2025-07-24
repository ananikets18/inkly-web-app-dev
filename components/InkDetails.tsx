"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  User,
  Globe,
  Users,
  Lock,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"
import { useSoundEffects } from "@/hooks/use-sound-effects"

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

export default function InkDetails({ ink }: InkDetailsProps) {
  const router = useRouter()
  const { playSound } = useSoundEffects()

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(ink.likes || 0)
  const [bookmarksCount, setBookmarksCount] = useState(ink.bookmarks || 0)

  const theme = ink.theme !== undefined ? BACKGROUND_THEMES[ink.theme] : BACKGROUND_THEMES[0]

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
    playSound(isLiked ? "unlike" : "like")
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    setBookmarksCount((prev) => (isBookmarked ? prev - 1 : prev + 1))
    playSound("bookmark")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ink by ${ink.author}`,
        text: ink.content.substring(0, 100) + "...",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      playSound("share")
    }
  }

  const getVisibilityIcon = () => {
    switch (ink.visibility) {
      case "followers":
        return <Users className="w-4 h-4" />
      case "private":
        return <Lock className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const getVisibilityLabel = () => {
    switch (ink.visibility) {
      case "followers":
        return "Followers only"
      case "private":
        return "Private"
      default:
        return "Public"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Author Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{ink.author}</h3>
                  <p className="text-sm text-muted-foreground">@{ink.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatTimeAgo(ink.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  {getVisibilityIcon()}
                  {getVisibilityLabel()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ink Content */}
        <Card>
          <CardContent className="p-0">
            <div className={`p-8 ${theme.bg} ${theme.text} rounded-lg`}>
              <div className="text-lg leading-relaxed whitespace-pre-wrap">{ink.content}</div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {ink.tags && ink.tags.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {ink.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatCount(Number.parseInt(ink.views))} views
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ink.readingTime}
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {ink.type}
                </div>
                {ink.xpEarned && (
                  <div className="flex items-center gap-1 text-purple-600">
                    <Zap className="w-4 h-4" />+{ink.xpEarned} XP
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${isLiked ? "text-red-600" : ""}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  {formatCount(likesCount)}
                </Button>

                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {formatCount(ink.comments || 0)}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 ${isBookmarked ? "text-blue-600" : ""}`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                  {formatCount(bookmarksCount)}
                </Button>

                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XP Earned Display */}
        {ink.xpEarned && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">XP Earned</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  You earned {ink.xpEarned} XP for this quality content!
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">+{ink.xpEarned}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comments Section Placeholder */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Comments</h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Comments feature coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
