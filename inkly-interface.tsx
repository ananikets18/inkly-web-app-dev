"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import {
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
  Bell,
  MessageSquareText,
  Share2,
  Eye,
  Volume2,
  VolumeX,
  Clock,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Masonry from "react-masonry-css"
import InkDetailModal from "./components/ink-detail-modal"
import ReactionButton from "./components/reaction-button"
import { useSoundEffects } from "./hooks/useSoundEffects"
import { calculateReadingTime } from "./utils/reading-time"

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

function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "..."
}

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  1024: 2,
  640: 1,
}

export default function Component() {
  const router = useRouter()
  const [newInksAvailable, setNewInksAvailable] = useState(false)
  const [newInkAuthors, setNewInkAuthors] = useState([
    { initials: "JK", color: "bg-purple-600" },
    { initials: "AM", color: "bg-yellow-500" },
    { initials: "DS", color: "bg-green-600" },
  ])

  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [selectedInk, setSelectedInk] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Track reactions for each post
  const [postReactions, setPostReactions] = useState<{ [key: number]: { reaction: string; count: number } }>({})

  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()

  const openInkModal = (inkData: any) => {
    playSound("modalOpen")
    setSelectedInk(inkData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    playSound("modalClose")
    setIsModalOpen(false)
    setSelectedInk(null)
  }

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
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

  const handleViewFull = (inkId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    playSound("click")
    // Scroll to top before navigation to ensure clean transition
    window.scrollTo(0, 0)
    router.push(`/ink/${inkId}`)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewInksAvailable(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isLoadingMore) {
        setIsLoadingMore(true)
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10)
          setIsLoadingMore(false)
        }, 1000)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoadingMore])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center gap-2">
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
                onMouseEnter={handleButtonHover}
                onClick={() => handleButtonClick("click")}
              >
                <Search className="w-6 h-6" />
              </Button>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
              onMouseEnter={handleButtonHover}
              onClick={() => handleButtonClick("click")}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-500 hover:text-gray-700"
                onMouseEnter={handleButtonHover}
                onClick={() => handleButtonClick("click")}
              >
                <Bell className="w-6 h-6" />
              </Button>
              <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-purple-600 rounded-full ring-2 ring-white" />
            </div>
            {/* Sound Toggle Button */}
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
            <Avatar className="w-8 h-8 bg-purple-600">
              <AvatarFallback className="bg-purple-600 text-white text-sm font-medium">AS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex sm:flex-row flex-col">
        <aside className="sticky top-[73px] hidden sm:block w-16 bg-white border-r border-gray-200 h-[calc(100vh-73px)]">
          <nav className="flex flex-col items-center py-6 space-y-6">
            {[Home, Zap, Heart, Bookmark, TrendingUp, Users].map((Icon, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                onMouseEnter={handleButtonHover}
                onClick={() => handleButtonClick("click")}
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
              onMouseEnter={handleButtonHover}
              onClick={() => handleButtonClick("click")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </aside>

        <AnimatePresence>
          {newInksAvailable && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="fixed top-[90px] left-1/2 transform -translate-x-1/2 z-50"
            >
              <button
                onClick={() => {
                  handleButtonClick("click")
                  setNewInksAvailable(false)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                onMouseEnter={handleButtonHover}
                className="bg-white border border-gray-300 px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-purple-50 transition-all"
              >
                <div className="flex -space-x-2">
                  {newInkAuthors.map((author, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-full text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white ${author.color}`}
                    >
                      {author.initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-800">{newInkAuthors.length} New Inks</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 py-6">
          <Masonry breakpointCols={breakpointColumnsObj} className="flex gap-4" columnClassName="flex flex-col gap-4">
            {Array.from({ length: visibleCount }).map((_, idx) => {
              const content = sampleContents[idx % sampleContents.length]
              const author = authorNames[idx % authorNames.length]
              const isLong = idx % 3 === 0
              const displayContent = isLong ? content.repeat(2) : content
              const postReaction = postReactions[idx]
              const readingTime = calculateReadingTime(displayContent)

              return (
                <div
                  key={idx}
                  className="break-inside-avoid rounded-xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    openInkModal({
                      id: idx,
                      content: displayContent,
                      author: author,
                      timestamp: "2h ago",
                      hashtags: ["#poetry", "#manifestation"],
                      mood: "Dreamy",
                      likes: Math.floor(Math.random() * 500) + 50,
                      bookmarks: Math.floor(Math.random() * 200) + 20,
                      comments: Math.floor(Math.random() * 50) + 5,
                      views: "1.2k",
                      reaction: postReaction?.reaction,
                      reactionCount: postReaction?.count || Math.floor(Math.random() * 100) + 10,
                      readingTime: readingTime.text,
                    })
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <span>{author} • 2h ago</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{readingTime.text}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="text-xs bg-gray-100 hover:bg-purple-100 text-purple-600"
                      onMouseEnter={handleButtonHover}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleButtonClick("follow")
                      }}
                    >
                      Follow
                    </Button>
                  </div>
                  <div className="border border-gray-100 rounded-md p-3 mb-3 text-sm text-gray-800 relative">
                    <p className="line-clamp-6 overflow-hidden relative">
                      {truncate(displayContent, isLong ? 280 : 120)}
                    </p>
                    {isLong && (
                      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white via-white/90 to-transparent" />
                    )}
                    {isLong && <div className="text-xs mt-2 text-purple-600 font-medium cursor-pointer">Read more</div>}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>#poetry</span>
                      <span>#manifestation</span>
                    </div>
                    <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      Dreamy
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm mt-2 border-t pt-2">
                    <div className="flex gap-4 items-center">
                      <ReactionButton
                        onReaction={(reactionId) => handleReaction(idx, reactionId)}
                        onSoundPlay={playSound}
                        selectedReaction={postReaction?.reaction}
                        reactionCount={postReaction?.count || Math.floor(Math.random() * 100) + 10}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-8 h-8"
                        onMouseEnter={handleButtonHover}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleButtonClick("bookmark")
                        }}
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-8 h-8"
                        onMouseEnter={handleButtonHover}
                        onClick={(e) => handleViewFull(idx, e)}
                        title="View full page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-8 h-8"
                        onMouseEnter={handleButtonHover}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleButtonClick("click")
                        }}
                      >
                        <MessageSquareText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-8 h-8"
                        onMouseEnter={handleButtonHover}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleButtonClick("click")
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-1 text-xs">
                        <Eye className="w-4 h-4" /> 1.2k
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {isLoadingMore &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="animate-pulse break-inside-avoid rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-24 bg-gray-100 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
          </Masonry>
        </main>
      </div>

      {/* Ink Detail Modal */}
      <InkDetailModal isOpen={isModalOpen} onClose={closeModal} inkData={selectedInk} onSoundPlay={playSound} />

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center sm:hidden">
        {[Home, Zap, Heart, Bookmark, TrendingUp, Settings].map((Icon, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className="text-gray-400"
            onMouseEnter={handleButtonHover}
            onClick={() => handleButtonClick("click")}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </nav>
    </div>
  )
}
