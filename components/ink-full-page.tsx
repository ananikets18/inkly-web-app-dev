"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Share2,
  Flag,
  Eye,
  Clock,
  MessageSquareText,
  Send,
  Copy,
  Code,
  Twitter,
  Facebook,
  Search,
  Home,
  Zap,
  Heart,
  Bookmark,
  TrendingUp,
  Users,
  PenLine,
  Plus,
  Settings,
  Volume2,
  VolumeX,
  Quote,
  Feather,
  MessageCircle,
  Sparkles,
  BookOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import ReactionButton from "./reaction-button"
import { useSoundEffects } from "../hooks/use-sound-effects"
import { calculateReadingTime } from "../utils/reading-time"

const contentTypes = {
  poem: {
    label: "Poem",
    icon: Feather,
    color: "bg-purple-100 text-purple-700",
    bgGradient: "from-purple-50 to-pink-50",
  },
  quote: {
    label: "Quote",
    icon: Quote,
    color: "bg-blue-100 text-blue-700",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  dialogue: {
    label: "Dialogue",
    icon: MessageCircle,
    color: "bg-green-100 text-green-700",
    bgGradient: "from-green-50 to-emerald-50",
  },
  affirmation: {
    label: "Affirmation",
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-700",
    bgGradient: "from-yellow-50 to-orange-50",
  },
  story: {
    label: "Story",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-700",
    bgGradient: "from-indigo-50 to-purple-50",
  },
}

const sampleInks = [
  {
    type: "poem",
    content: `Beneath the silver moon's embrace,
I find my soul's forgotten place.
Where whispers dance on midnight air,
And dreams unfold beyond compare.

Each breath a verse, each step a rhyme,
I walk through corridors of time.
The stars above, my faithful guide,
Through realms where truth and beauty hide.`,
    title: null,
  },
  {
    type: "quote",
    content:
      "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    title: null,
    attribution: "Steve Jobs",
  },
  {
    type: "dialogue",
    content: `"What if we fail?" she whispered.

"Then we fail forward," he replied, eyes bright with possibility.

"But what if—"

"What if we succeed beyond our wildest dreams? What if this is exactly where we're meant to be?"

She smiled, fear melting into hope.`,
    title: null,
  },
  {
    type: "affirmation",
    content:
      "I am worthy of love, success, and happiness. My dreams are valid, my voice matters, and I have the power to create positive change in my life and the world around me.",
    title: null,
  },
  {
    type: "story",
    content: `The old bookshop stood at the corner of Memory Lane, its windows fogged with stories untold. Sarah pushed open the creaking door, and the scent of aged paper and forgotten dreams enveloped her.

"Welcome," said a voice from the shadows. "What story are you looking for today?"

She paused, realizing she wasn't looking for a story at all. She was looking for herself.`,
    title: "The Corner of Memory Lane",
  },
  {
    type: "poem",
    content: `I am the storm
I've been waiting for.

Thunder in my chest,
Lightning in my eyes,
Rain washing away
All the lies I told myself
About being small.

Today I rise.`,
    title: null,
  },
  {
    type: "quote",
    content: "Your limitation—it's only your imagination.",
    title: null,
  },
  {
    type: "affirmation",
    content:
      "Every challenge I face is an opportunity to grow stronger. I trust in my ability to overcome obstacles and create the life I desire.",
    title: null,
  },
]

const authorNames = [
  "Maya Chen",
  "Alex Rivera",
  "Jordan Kim",
  "Sam Taylor",
  "Riley Park",
  "Casey Morgan",
  "River Stone",
]
const moods = ["Contemplative", "Empowering", "Mystical", "Peaceful", "Intense", "Dreamy", "Resilient", "Hopeful"]
const hashtagSets = [
  ["#poetry", "#moonlight", "#dreams", "#midnight"],
  ["#motivation", "#success", "#inspiration", "#wisdom"],
  ["#dialogue", "#hope", "#courage", "#possibility"],
  ["#affirmation", "#selfworth", "#positivity", "#mindset"],
  ["#story", "#bookshop", "#selfdiscovery", "#journey"],
  ["#storm", "#strength", "#empowerment", "#rise"],
  ["#limitation", "#imagination", "#potential", "#growth"],
  ["#challenge", "#opportunity", "#resilience", "#trust"],
]

function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "..."
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  return num.toString()
}

const generateInkData = (inkId: string) => {
  const id = Number.parseInt(inkId)
  const inkTemplate = sampleInks[id % sampleInks.length]
  const contentType = contentTypes[inkTemplate.type as keyof typeof contentTypes]

  return {
    id: inkId,
    type: inkTemplate.type,
    title: inkTemplate.title,
    content: inkTemplate.content,
    attribution: (inkTemplate as any).attribution,
    contentType,
    author: {
      name: authorNames[id % authorNames.length],
      bio: "Poet, dreamer, and collector of midnight thoughts. Writing my way through the beautiful chaos of existence.",
      avatar: authorNames[id % authorNames.length]
        .split(" ")
        .map((n) => n[0])
        .join(""),
      xpLevel: 8 + (id % 15),
      followerCount: 1500 + ((id * 127) % 5000),
      isFollowing: false,
      badges: ["Wordsmith", "Night Owl", "Deep Thinker"].slice(0, 1 + (id % 3)),
    },
    timestamp: `Published on ${18 + (id % 12)} June 2025 at ${7 + (id % 5)}:${15 + (id % 45)} PM IST`,
    hashtags: hashtagSets[id % hashtagSets.length],
    mood: moods[id % moods.length],
    reactions: {
      like: 150 + ((id * 23) % 300),
      love: 50 + ((id * 17) % 150),
      wow: 20 + ((id * 11) % 80),
      total: 220 + ((id * 51) % 530),
    },
    bookmarks: 80 + ((id * 19) % 200),
    shares: 15 + ((id * 7) % 40),
    views: 800 + ((id * 43) % 1500),
    comments: [
      {
        id: "1",
        author: authorNames[(id + 1) % authorNames.length],
        avatar: authorNames[(id + 1) % authorNames.length]
          .split(" ")
          .map((n) => n[0])
          .join(""),
        content: "This resonates so deeply with me. Thank you for sharing this beautiful piece.",
        timestamp: "2h ago",
        likes: 8 + (id % 15),
        replies: [
          {
            id: "1-1",
            author: authorNames[id % authorNames.length],
            avatar: authorNames[id % authorNames.length]
              .split(" ")
              .map((n) => n[0])
              .join(""),
            content: "Thank you so much! That means the world to me. ❤️",
            timestamp: "1h ago",
            likes: 3 + (id % 8),
          },
        ],
      },
      {
        id: "2",
        author: authorNames[(id + 2) % authorNames.length],
        avatar: authorNames[(id + 2) % authorNames.length]
          .split(" ")
          .map((n) => n[0])
          .join(""),
        content: "Your words have such power. This gave me chills.",
        timestamp: "3h ago",
        likes: 5 + (id % 12),
        replies: [],
      },
    ],
  }
}

const renderContent = (inkData: any) => {
  const { type, content, title, attribution, contentType } = inkData

  switch (type) {
    case "poem":
      return (
        <div
          className={`bg-gradient-to-br ${contentType.bgGradient} rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden`}
        >
          <div className="absolute top-6 left-6 opacity-20">
            <contentType.icon className="w-12 h-12 text-purple-600" />
          </div>
          <div className="relative z-10">
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{title}</h2>}
            <div className="text-lg sm:text-xl leading-relaxed text-gray-800 font-medium whitespace-pre-line max-w-2xl mx-auto">
              {content}
            </div>
          </div>
        </div>
      )

    case "quote":
      return (
        <div
          className={`bg-gradient-to-br ${contentType.bgGradient} rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden`}
        >
          <div className="absolute top-6 right-6 opacity-20">
            <Quote className="w-16 h-16 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 max-w-3xl mx-auto">
              "{content}"
            </div>
            {attribution && <div className="text-lg text-gray-600 font-medium">— {attribution}</div>}
          </div>
        </div>
      )

    case "dialogue":
      return (
        <div className={`bg-gradient-to-br ${contentType.bgGradient} rounded-3xl p-8 sm:p-12 relative overflow-hidden`}>
          <div className="absolute top-6 left-6 opacity-20">
            <MessageCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="relative z-10">
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>}
            <div className="text-lg sm:text-xl leading-relaxed text-gray-800 whitespace-pre-line max-w-2xl mx-auto">
              {content}
            </div>
          </div>
        </div>
      )

    case "affirmation":
      return (
        <div
          className={`bg-gradient-to-br ${contentType.bgGradient} rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden`}
        >
          <div className="absolute top-6 left-6 opacity-20">
            <Sparkles className="w-12 h-12 text-yellow-600" />
          </div>
          <div className="absolute bottom-6 right-6 opacity-20">
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="relative z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed max-w-3xl mx-auto">
              {content}
            </div>
          </div>
        </div>
      )

    case "story":
      return (
        <div className={`bg-gradient-to-br ${contentType.bgGradient} rounded-3xl p-8 sm:p-12 relative overflow-hidden`}>
          <div className="absolute top-6 right-6 opacity-20">
            <BookOpen className="w-12 h-12 text-indigo-600" />
          </div>
          <div className="relative z-10">
            {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              {content.split("\n\n").map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-6 last:mb-0 text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200">
          <div className="prose prose-lg max-w-none">
            {content.split("\n\n").map((paragraph: string, idx: number) => (
              <p key={idx} className="text-gray-800 leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )
  }
}

interface InkFullPageProps {
  inkId: string
}

export default function InkFullPage({ inkId }: InkFullPageProps) {
  const router = useRouter()
  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [visibleRelatedCount, setVisibleRelatedCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [postReactions, setPostReactions] = useState<{ [key: number]: { reaction: string; count: number } }>({})

  const inkData = generateInkData(inkId)
  const [isFollowing, setIsFollowing] = useState(inkData.author.isFollowing)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isLoadingMore) {
        setIsLoadingMore(true)
        setTimeout(() => {
          setVisibleRelatedCount((prev) => prev + 10)
          setIsLoadingMore(false)
        }, 1000)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoadingMore])

  const handleBack = () => {
    playSound("click")
    router.back()
  }

  const handleFollow = () => {
    playSound("follow")
    setIsFollowing(!isFollowing)
  }

  const handleShare = (platform?: string) => {
    playSound("click")
    if (platform) {
      console.log(`Sharing to ${platform}`)
    }
    setShowShareMenu(false)
  }

  const handleReport = (reason?: string) => {
    playSound("click")
    if (reason) {
      console.log(`Reporting for: ${reason}`)
    }
    setShowReportMenu(false)
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      playSound("click")
      console.log("Submitting comment:", newComment)
      setNewComment("")
    }
  }

  const handleReaction = (postId: number, reactionId: string) => {
    setPostReactions((prev) => ({
      ...prev,
      [postId]: {
        reaction: reactionId,
        count: (prev[postId]?.count || 0) + 1,
      },
    }))
  }

  const handleViewFull = (relatedInkId: number, e?: React.MouseEvent) => {
    e?.stopPropagation?.()
    playSound("click")
    router.push(`/ink/${relatedInkId}`)
  }

  const readingTime = calculateReadingTime(inkData.content)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 mr-2" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Inkly</span>
          </div>
          <div className="hidden sm:flex flex-1 max-w-full mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for an inspiration..."
                className="w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => playSound("click")}
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
              onClick={() => playSound("click")}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 text-gray-500 hover:text-gray-700 ${!isInitialized ? "opacity-50" : ""}`}
              onClick={toggleMute}
              title={!isInitialized ? "Click anywhere to enable sounds" : isMuted ? "Unmute sounds" : "Mute sounds"}
              disabled={!isInitialized}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-full"
              onClick={() => playSound("click")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-[73px] hidden sm:block w-16 bg-white border-r border-gray-200 h-[calc(100vh-73px)]">
          <nav className="flex flex-col items-center py-6 space-y-6">
            {[Home, Zap, Heart, Bookmark, TrendingUp, Users].map((Icon, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                onClick={() => playSound("click")}
              >
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </nav>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
              onClick={() => playSound("click")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Content Type & Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <Badge className={inkData.contentType.color}>
                  <inkData.contentType.icon className="w-3 h-3 mr-1" />
                  {inkData.contentType.label}
                </Badge>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime.text}</span>
                  <span>•</span>
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(inkData.views)} views</span>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-700">{inkData.mood}</Badge>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {renderContent(inkData)}
            </motion.div>

            {/* Author & Actions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200"
            >
              {/* Author Info */}
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                    {inkData.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{inkData.author.name}</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      Level {inkData.author.xpLevel}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{inkData.author.bio}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-500">
                      <strong>{formatNumber(inkData.author.followerCount)}</strong> followers
                    </span>
                    <div className="flex gap-1">
                      {inkData.author.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleFollow}
                    size="sm"
                    className={`${
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    } transition-all duration-200`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {inkData.hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => playSound("click")}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full transition-all duration-200 text-sm font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <ReactionButton
                    onReaction={(reactionId) => console.log("Reaction:", reactionId)}
                    onSoundPlay={playSound}
                    reactionCount={inkData.reactions.total}
                    size="md"
                  />
                  <Button variant="ghost" className="flex items-center gap-2" onClick={() => playSound("bookmark")}>
                    <Bookmark className="w-5 h-5" />
                    <span>{formatNumber(inkData.bookmarks)}</span>
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>{formatNumber(inkData.shares)}</span>
                    </Button>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[200px] z-10"
                        >
                          <button
                            onClick={() => handleShare("twitter")}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Share on Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare("facebook")}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Share on Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare("copy")}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">Copy Link</span>
                          </button>
                          <button
                            onClick={() => handleShare("embed")}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Code className="w-4 h-4 text-gray-600" />
                            <span className="text-sm">Embed Code</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowReportMenu(!showReportMenu)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                    <AnimatePresence>
                      {showReportMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[180px] z-10"
                        >
                          <button
                            onClick={() => handleReport("spam")}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                          >
                            Spam
                          </button>
                          <button
                            onClick={() => handleReport("inappropriate")}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                          >
                            Inappropriate Content
                          </button>
                          <button
                            onClick={() => handleReport("harassment")}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                          >
                            Harassment
                          </button>
                          <button
                            onClick={() => handleReport("other")}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                          >
                            Other
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">{inkData.timestamp}</div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" />
                Comments ({inkData.comments.length})
              </h3>

              {/* Comment Input */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {inkData.comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-100 pl-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-800 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button className="hover:text-purple-600 transition-colors">❤️ {comment.likes}</button>
                          <button className="hover:text-purple-600 transition-colors">Reply</button>
                        </div>
                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                    {reply.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-gray-800 text-sm mb-1">{reply.content}</p>
                                  <button className="text-xs text-gray-500 hover:text-purple-600 transition-colors">
                                    ❤️ {reply.likes}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Inks Section */}
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">More Inks You Might Like</h2>

              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {Array.from({ length: visibleRelatedCount }).map((_, idx) => {
                  const relatedIdx = (Number.parseInt(inkId) + idx + 1) % sampleInks.length
                  const relatedInk = sampleInks[relatedIdx]
                  const author = authorNames[relatedIdx % authorNames.length]
                  const postReaction = postReactions[relatedIdx]
                  const readingTime = calculateReadingTime(relatedInk.content)
                  const contentType = contentTypes[relatedInk.type as keyof typeof contentTypes]

                  const avatarColors = [
                    "from-purple-500 to-pink-500",
                    "from-blue-500 to-cyan-500",
                    "from-green-500 to-teal-500",
                    "from-orange-500 to-red-500",
                    "from-indigo-500 to-purple-500",
                  ]
                  const avatarColor = avatarColors[relatedIdx % avatarColors.length]

                  return (
                    <div
                      key={`related-${idx}`}
                      className="break-inside-avoid rounded-xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] mb-4"
                      onClick={(e) => handleViewFull(relatedIdx, e)}
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${avatarColor} text-white text-sm font-medium`}
                            >
                              {author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{author}</span>
                            <span className="text-xs text-gray-500">{Math.floor(Math.random() * 12) + 1}h ago</span>
                          </div>
                        </div>
                        <Badge className={`${contentType.color} text-xs`}>
                          <contentType.icon className="w-3 h-3 mr-1" />
                          {contentType.label}
                        </Badge>
                      </div>

                      {/* Content Preview */}
                      <div className="border border-gray-100 rounded-md p-3 mb-3 text-sm text-gray-800 relative">
                        <p className="line-clamp-4 overflow-hidden">{truncate(relatedInk.content, 150)}</p>
                      </div>

                      {/* Actions & Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <ReactionButton
                            onReaction={(reactionId) => handleReaction(relatedIdx, reactionId)}
                            onSoundPlay={playSound}
                            selectedReaction={postReaction?.reaction}
                            reactionCount={postReaction?.count || Math.floor(Math.random() * 100) + 10}
                            size="sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-purple-600 w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              playSound("bookmark")
                            }}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-blue-600 w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              playSound("click")
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{readingTime.text}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(Math.floor(Math.random() * 2000) + 500)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Loading Skeletons */}
                {isLoadingMore &&
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="animate-pulse break-inside-avoid rounded-xl border border-gray-200 bg-white p-4 shadow-sm mb-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div className="flex flex-col">
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-20 bg-gray-100 rounded mb-3"></div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center sm:hidden">
        {[Home, Zap, Heart, Bookmark, TrendingUp, Settings].map((Icon, i) => (
          <Button key={i} variant="ghost" size="icon" className="text-gray-400" onClick={() => playSound("click")}>
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </nav>
    </div>
  )
}
