"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, Share2, Eye, MessageSquareText, Clock, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ReactionButton from "./reaction-button"
import { calculateReadingTime } from "../utils/reading-time"

interface InkData {
  id: number
  content: string
  author: string
  timestamp: string
  hashtags: string[]
  mood: string
  likes: number
  bookmarks: number
  comments: number
  views: string
  reaction?: string
  reactionCount?: number
  readingTime?: string
}

interface InkDetailModalProps {
  isOpen: boolean
  onClose: () => void
  inkData: InkData | null
  onSoundPlay: (soundType: "click" | "hover" | "like" | "follow" | "bookmark") => void
}

export default function InkDetailModal({ isOpen, onClose, inkData, onSoundPlay }: InkDetailModalProps) {
  const router = useRouter()

  if (!inkData) return null

  const readingTime = calculateReadingTime(inkData.content)

  const handleButtonHover = () => {
    onSoundPlay("hover")
  }

  const handleViewFull = () => {
    onSoundPlay("click")
    onClose()
    // Small delay to ensure modal closes before navigation
    setTimeout(() => {
      router.push(`/ink/${inkData.id}`)
    }, 100)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Very top right */}
            <button
              onClick={onClose}
              onMouseEnter={handleButtonHover}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-transparent hover:bg-gray-100 flex items-center justify-center transition-colors touch-manipulation"
            >
              <svg
                className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
              {/* Author Header */}
              <div className="flex items-start gap-3 sm:gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 active:scale-95"
                    onMouseEnter={handleButtonHover}
                    onClick={() => onSoundPlay("click")}
                  >
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {inkData.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight truncate">
                        {inkData.author}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mt-0.5 flex-wrap">
                        <span>{inkData.timestamp}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{inkData.views} views</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{readingTime.text}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 text-xs sm:text-sm font-medium touch-manipulation"
                      onMouseEnter={handleButtonHover}
                      onClick={() => onSoundPlay("follow")}
                    >
                      Follow
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-gray-800 text-sm sm:text-base leading-relaxed sm:leading-relaxed">
                {inkData.content}
              </div>

              {/* Hashtags & Mood */}
              <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {inkData.hashtags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium transition-all duration-200 hover:scale-105 hover:bg-purple-50 px-2 py-1 rounded-md text-xs sm:text-sm touch-manipulation active:scale-95"
                      onMouseEnter={handleButtonHover}
                      onClick={() => onSoundPlay("click")}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="bg-purple-100 text-purple-700 font-medium px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                  {inkData.mood}
                </span>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 sm:gap-6 text-gray-600 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{inkData.likes.toLocaleString()}</span>
                  <span className="text-xs sm:text-sm">likes</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{inkData.comments}</span>
                  <span className="text-xs sm:text-sm">comments</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{inkData.bookmarks}</span>
                  <span className="text-xs sm:text-sm">saves</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
                  <ReactionButton
                    onReaction={(reactionId) => console.log("Reaction:", reactionId)}
                    onSoundPlay={onSoundPlay}
                    selectedReaction={inkData.reaction}
                    reactionCount={inkData.reactionCount || inkData.likes}
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:scale-105 active:scale-95 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium touch-manipulation"
                    onMouseEnter={handleButtonHover}
                    onClick={() => onSoundPlay("bookmark")}
                  >
                    <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 hover:scale-110" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-purple-500 hover:bg-purple-50 flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:scale-105 active:scale-95 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium touch-manipulation"
                    onMouseEnter={handleButtonHover}
                    onClick={() => onSoundPlay("click")}
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 hover:scale-110" />
                    Share
                  </Button>
                </div>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 text-xs sm:text-sm font-medium w-full sm:w-auto justify-center touch-manipulation group"
                  onMouseEnter={handleButtonHover}
                  onClick={handleViewFull}
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  View Full
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
