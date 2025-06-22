"use client"

import { useState, useEffect, useRef } from "react"
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
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import ReactionButton from "./reaction-button"
import { useSoundEffects } from "../hooks/useSoundEffects"
import { calculateReadingTime } from "../utils/reading-time"

// Replace the mockInkData constant with this function
const generateInkData = (inkId: string) => {
  const id = Number.parseInt(inkId)
  const sampleContents = [
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "I am the storm I've been waiting for.",
    "Whisper to the universe what you seek and it shall echo back tenfold.",
    "A silent affirmation each morning shaped her every decision.",
    "'We meet again,' said destiny as she chose her path yet again.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    "If pain is the price of growth, she was ready to bloom.",
    "These lines hold more truth than silence ever could.",
    "Manifest with intention. Trust the magic in your breath.",
    "Some stories aren't written. They're felt.",
    "I have often regretted my speech, never my silence.",
    "Every time your heart is broken, a doorway cracks open to a world full of new beginnings, new opportunities.",
    "She stood there, watching the world rush by, holding a quiet storm within her chest that neither asked to be seen nor feared to be known. Her eyes weren't just windows to her soul—they were kaleidoscopes of broken mirrors, reflecting every truth she never dared to speak aloud. In the silence of her solitude, she built kingdoms of resilience, wrapped in poetry only she could read.",
    "Every inhale carried a story, and every exhale was a release. Her mind was an ocean of metaphors—waves of unspoken words, thoughts crashing and forming verses in her bones. At midnight, she didn't sleep. She bled ink, inscribing dreams onto the fabric of her pillowcases, where no one but the stars bore witness.",
    "Pain taught her the alphabet of strength. From A for ache to Z for zen, she mastered her narrative. Each scar etched on her heart was a stanza, and each tear, punctuation. When she walked, she carried libraries within her, volumes waiting to be unlocked, one glance at a time.",
    "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep. Poetry didn't come from peace. It was born from her chaos, fed by her resilience, and shaped by every dawn she decided to rise again.",
  ]

  const authorNames = ["Maya Chen", "Alex Rivera", "Jordan Kim", "Sam Taylor", "Riley Park"]
  const titles = [
    "The Symphony of Solitude",
    "Storms Within",
    "Universe Whispers",
    "Morning Affirmations",
    "Destiny's Path",
    "Fire of Hope",
    "Growth Through Pain",
    "Truth in Lines",
    "Magical Breath",
    "Felt Stories",
    "Silent Wisdom",
    "Broken Hearts, New Beginnings",
    "Kaleidoscope Soul",
    "Ocean of Metaphors",
    "Alphabet of Strength",
    "Sea of Softness",
  ]

  const moods = ["Contemplative", "Empowering", "Mystical", "Peaceful", "Intense", "Dreamy", "Resilient", "Hopeful"]
  const hashtagSets = [
    ["#poetry", "#manifestation", "#solitude", "#resilience", "#midnight"],
    ["#strength", "#growth", "#empowerment", "#journey"],
    ["#mystical", "#universe", "#whispers", "#magic"],
    ["#peace", "#morning", "#affirmations", "#mindfulness"],
    ["#destiny", "#path", "#choices", "#life"],
    ["#hope", "#fire", "#inner", "#strength"],
    ["#pain", "#growth", "#transformation", "#healing"],
    ["#truth", "#wisdom", "#silence", "#reflection"],
  ]

  const content = sampleContents[id % sampleContents.length]
  const isLong = id % 3 === 0
  const fullContent = isLong ? content.repeat(3) + "\n\n" + sampleContents[(id + 1) % sampleContents.length] : content

  return {
    id: inkId,
    title: titles[id % titles.length],
    content: fullContent,
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
    xpBadge: {
      name: "Deep Resonance",
      description: "Earned for creating content that deeply resonates with readers",
      xpGained: 30 + (id % 50),
    },
    comments: [
      {
        id: "1",
        author: authorNames[(id + 1) % authorNames.length],
        avatar: authorNames[(id + 1) % authorNames.length]
          .split(" ")
          .map((n) => n[0])
          .join(""),
        content: "This is absolutely beautiful. The way you describe this... just wow.",
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
        content: "Your metaphors are incredible. This line will stay with me.",
        timestamp: "3h ago",
        likes: 5 + (id % 12),
        replies: [],
      },
    ],
    relatedInks: [
      {
        id: ((id + 1) % 100).toString(),
        title: titles[(id + 1) % titles.length],
        author: authorNames[(id + 1) % authorNames.length],
        preview: sampleContents[(id + 1) % sampleContents.length].slice(0, 80) + "...",
        reactions: 100 + (((id + 1) * 31) % 200),
      },
      {
        id: ((id + 2) % 100).toString(),
        title: titles[(id + 2) % titles.length],
        author: authorNames[(id + 2) % authorNames.length],
        preview: sampleContents[(id + 2) % sampleContents.length].slice(0, 80) + "...",
        reactions: 80 + (((id + 2) * 29) % 180),
      },
    ],
  }
}

interface InkFullPageProps {
  inkId: string
}

export default function InkFullPage({ inkId }: InkFullPageProps) {
  const router = useRouter()
  const { playSound } = useSoundEffects()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showXPBadge, setShowXPBadge] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Generate ink data based on ID
  const inkData = generateInkData(inkId)
  const [isFollowing, setIsFollowing] = useState(inkData.author.isFollowing)

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current
        const scrollTop = window.scrollY
        const scrollHeight = element.scrollHeight - window.innerHeight
        const progress = Math.min((scrollTop / scrollHeight) * 100, 100)
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Show XP badge after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowXPBadge(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to top when component mounts to ensure clean start
  useEffect(() => {
    // Scroll to top when component mounts to ensure clean start
    window.scrollTo(0, 0)
  }, [])

  const handleBack = () => {
    playSound("click")
    // Scroll to top before navigating back to ensure clean transition
    window.scrollTo(0, 0)
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

  const readingTime = calculateReadingTime(inkData.content)

  return (
    <div className="min-h-screen bg-gray-50" ref={contentRef}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back Button - Floating */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-40 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </motion.button>

      {/* XP Badge Notification */}
      <AnimatePresence>
        {showXPBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">XP Badge Unlocked!</div>
                <div className="text-xs opacity-90">{inkData.xpBadge.name}</div>
                <div className="text-xs opacity-75">+{inkData.xpBadge.xpGained} XP</div>
              </div>
              <button onClick={() => setShowXPBadge(false)} className="text-white/70 hover:text-white ml-auto">
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-20">
        {/* Title */}
        {inkData.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 leading-tight"
          >
            {inkData.title}
          </motion.h1>
        )}

        {/* Author Profile Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200"
        >
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold">
                {inkData.author.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{inkData.author.name}</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Level {inkData.author.xpLevel}
                </Badge>
              </div>
              <p className="text-gray-600 mb-3 leading-relaxed">{inkData.author.bio}</p>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm text-gray-500">
                  <strong>{inkData.author.followerCount.toLocaleString()}</strong> followers
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
        </motion.div>

        {/* Post Timestamp & Reading Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-gray-500 mb-6 flex-wrap"
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm">{inkData.timestamp}</span>
          <span className="text-sm">•</span>
          <Eye className="w-4 h-4" />
          <span className="text-sm">{inkData.views.toLocaleString()} views</span>
          <span className="text-sm">•</span>
          <span className="text-sm font-medium text-purple-600">{readingTime.text}</span>
        </motion.div>

        {/* Full Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200"
        >
          <div className="prose prose-lg max-w-none">
            {inkData.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="text-gray-800 leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Hashtags & Mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          {inkData.hashtags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => playSound("click")}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 font-medium"
            >
              {tag}
            </button>
          ))}
          <Badge className="bg-purple-100 text-purple-700 ml-auto">{inkData.mood}</Badge>
        </motion.div>

        {/* Reactions & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <ReactionButton
                onReaction={(reactionId) => console.log("Reaction:", reactionId)}
                onSoundPlay={playSound}
                reactionCount={inkData.reactions.total}
                size="md"
              />
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => playSound("bookmark")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>{inkData.bookmarks}</span>
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
                  <span>{inkData.shares}</span>
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
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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

        {/* Related Inks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Inks</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {inkData.relatedInks.map((ink) => (
              <div
                key={ink.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                onClick={() => {
                  playSound("click")
                  router.push(`/ink/${ink.id}`)
                }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{ink.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ink.preview}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">by {ink.author}</span>
                  <span className="text-sm text-gray-500">❤️ {ink.reactions}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Progress Indicator */}
        {scrollProgress > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg border border-gray-200"
          >
            <div className="text-sm font-medium text-gray-700">
              {Math.round(scrollProgress)}%
              {scrollProgress >= 95 && <div className="text-xs text-green-600 mt-1">✓ Finished reading!</div>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
