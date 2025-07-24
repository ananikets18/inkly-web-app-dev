"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Eye, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"
import { truncate } from "@/utils/truncate"
import { detectInkType } from "@/utils/detectInkType"
import MoreOptionsDropdown from "./MoreOptionsDropdown"
import ShareModal from "./ShareModal"
import ReflectModal from "./ReflectModal"
import { useSoundEffects } from "@/hooks/useSoundEffects"
import Link from "next/link"

interface InkCardProps {
  id: number
  inkId: string
  content: string
  author: string
  avatar?: string
  avatarColor?: string
  readingTime: { minutes: number; seconds: number; text: string }
  views: number
  reactionCount: number
  reflectionCount: number
  bookmarkCount: number
  echoCount: number
  createdAt: string
  shareUrl: string
  onClick: () => void
  onHover: () => void
  onBookmark: () => void
  onShare: () => void
  onFollow: () => void
  isOwnInk?: boolean
  onPinInk?: (inkId: number) => void
  isPinned?: boolean
}

export default function InkCard({
  id,
  inkId,
  content,
  author,
  avatar,
  avatarColor = "from-purple-500 to-pink-500",
  readingTime,
  views,
  reactionCount,
  reflectionCount,
  bookmarkCount,
  echoCount,
  createdAt,
  shareUrl,
  onClick,
  onHover,
  onBookmark,
  onShare,
  onFollow,
  isOwnInk = false,
  onPinInk,
  isPinned = false,
}: InkCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isEchoed, setIsEchoed] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReflectModal, setShowReflectModal] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [localReactionCount, setLocalReactionCount] = useState(reactionCount)
  const [localReflectionCount, setLocalReflectionCount] = useState(reflectionCount)
  const [localBookmarkCount, setLocalBookmarkCount] = useState(bookmarkCount)
  const [localEchoCount, setLocalEchoCount] = useState(echoCount)
  const [isHovered, setIsHovered] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const { playSound } = useSoundEffects()

  const inkType = detectInkType(content)
  const displayContent = truncate(content, 280)
  const timeAgo = formatTimeAgo(createdAt)

  // Get username without @ symbol for URL
  const username = author.startsWith("@") ? author.slice(1) : author

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLocalReactionCount((prev) => (isLiked ? prev - 1 : prev + 1))
    playSound("success")
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    setLocalBookmarkCount((prev) => (isBookmarked ? prev - 1 : prev + 1))
    onBookmark()
    playSound("bookmark")
  }

  const handleEcho = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEchoed(!isEchoed)
    setLocalEchoCount((prev) => (isEchoed ? prev - 1 : prev + 1))
    playSound("notification")
  }

  const handleReflect = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowReflectModal(true)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareModal(true)
    onShare()
  }

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMoreOptions(!showMoreOptions)
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPinInk) {
      onPinInk(id)
    }
  }

  const handleReflectionSubmit = (reflection: string) => {
    setLocalReflectionCount((prev) => prev + 1)
    setShowReflectModal(false)
    playSound("reflection")
  }

  const handleCardClick = () => {
    onClick()
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
          isHovered ? "scale-[1.02] shadow-2xl" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isPinned && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-purple-500 text-white p-1.5 rounded-full shadow-lg">
              <Pin className="w-3 h-3" />
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href={`/${encodeURIComponent(username)}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Avatar className="w-10 h-10 ring-2 ring-white/50 dark:ring-gray-700/50">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-white font-semibold`}>
                      {author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <div>
                <Link
                  href={`/${encodeURIComponent(username)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  {author}
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{timeAgo}</span>
                  <span>•</span>
                  <span>{readingTime.text}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatCount(views)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMoreOptions}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {showMoreOptions && (
                  <MoreOptionsDropdown
                    onClose={() => setShowMoreOptions(false)}
                    isOwnInk={isOwnInk}
                    onPin={handlePin}
                    isPinned={isPinned}
                    onFollow={onFollow}
                    inkId={inkId}
                    author={author}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{displayContent}</p>
            {content.length > 280 && (
              <button className="text-purple-600 dark:text-purple-400 text-sm font-medium mt-2 hover:underline">
                Read more
              </button>
            )}
          </div>

          {/* Ink Type Badge */}
          {inkType !== "general" && (
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  inkType === "question"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : inkType === "confession"
                      ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                      : inkType === "fact"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                }`}
              >
                {inkType.charAt(0).toUpperCase() + inkType.slice(1)}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{formatCount(localReactionCount)}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReflect}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{formatCount(localReflectionCount)}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleEcho}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isEchoed
                    ? "text-green-500 hover:text-green-600"
                    : "text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                }`}
              >
                <Share2 className={`w-4 h-4 ${isEchoed ? "fill-current" : ""}`} />
                <span className="text-sm">{formatCount(localEchoCount)}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`transition-all duration-200 ${
                  isBookmarked
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={shareUrl}
      />

      <ReflectModal
        open={showReflectModal}
        onClose={() => setShowReflectModal(false)}
        onSubmit={handleReflectionSubmit}
        onRepost={() => {}}
        onUndoRepost={() => {}}
        originalInk={{ content, author, timestamp: createdAt }}
        hasReflected={false}
        hasInkified={false}
      />
    </>
  )
}
