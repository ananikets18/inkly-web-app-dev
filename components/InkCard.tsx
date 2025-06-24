"use client";

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Eye } from "lucide-react";
import ReactionButton from "@/components/reaction-button";
import ShareButton from "@/components/ShareButton";
import { truncate } from "@/utils/truncate";
import { formatCount } from "@/utils/formatCount";
import { calculateReadingTime } from "@/utils/reading-time";
import BookmarkToast from "../components/BookmarkToast"
import { useAnimatedCount } from "../hooks/useAnimatedCount"
import AnimatedCount from "../components/AnimatedCount"


interface InkCardProps {
  id: number;
  content: string;
  author: string;
  avatarColor: string;
  isLong?: boolean;
  reaction?: {
    reaction: string;
    count: number;
  };
  onClick: () => void;
  onHover: () => void;
  onReact: (reactionId: string) => void;
  onBookmark: () => void;
  onShare: () => void;
  onFollow: () => void;
  readingTime: {
    text: string;
    minutes: number;
  };
  shareCount?: number
  shareUrl: string
}

export default function InkCard({
  id,
  content,
  author,
  avatarColor,
  isLong,
  reaction,
  readingTime,
  onClick,
  onHover,
  onReact,
  onBookmark,
  onShare,
  onFollow,
  shareCount = 0,
}: InkCardProps) {
  const [localShareCount, setLocalShareCount] = useState(shareCount)
  const [animateShare, setAnimateShare] = useState(false)

  const handleShared = () => {
    setLocalShareCount((prev) => prev + 1)
    setAnimateShare(true)
    onShare?.()

    setTimeout(() => setAnimateShare(false), 600)
  }

  const shareUrl = `https://inkly.app/?share=${id}`;

  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [bookmarkLocked, setBookmarkLocked] = useState(false)
  const [showBookmarkMsg, setShowBookmarkMsg] = useState(false)
  const [animateBookmark, setAnimateBookmark] = useState(false)
  const [bookmarkMessage, setBookmarkMessage] = useState<string | null>(null)
  const animatedBookmarkCount = useAnimatedCount(bookmarkCount)


  const handleBookmark = async (e: React.MouseEvent) => {
  e.stopPropagation()
  if (bookmarkLocked) return

  setBookmarkLocked(true)

  const nextState = !bookmarked
  setBookmarked(nextState)
  setBookmarkCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1))
  setAnimateBookmark(true)

  setBookmarkMessage(nextState ? "Saved to your inspirations ✨" : "Removed from bookmarks 🗂️")

  setTimeout(() => {
    setAnimateBookmark(false)
    setBookmarkLocked(false)
  }, 800)

  setTimeout(() => {
    setBookmarkMessage(null)
  }, 1800)

  onBookmark?.()
}



{bookmarkMessage && <BookmarkToast message={bookmarkMessage} />}

 return (
    <>
    <div
      className="break-inside-avoid relative pointer-events-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] mb-4"
      onClick={onClick}
    >
      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-white text-sm font-medium`}>
              {author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{author}</span>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
        </div>
        <Button
          size="sm"
          className="text-xs bg-gray-100 hover:bg-purple-100 text-purple-600 px-3 py-1"
          onMouseEnter={onHover}
          onClick={(e) => {
            e.stopPropagation()
            onFollow()
          }}
        >
          Follow
        </Button>
      </div>

      {/* Content */}
      <div className="border border-gray-100 rounded-md p-3 mb-3 text-sm text-gray-800 relative">
        <p className="line-clamp-6 overflow-hidden relative">
          {truncate(content, isLong ? 280 : 120)}
        </p>
        {isLong && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white via-white/90 to-transparent" />
            <div className="text-xs mt-2 text-purple-600 font-medium cursor-pointer">Read more</div>
          </>
        )}
      </div>

      {/* Hashtags & Mood */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="hover:text-purple-600 cursor-pointer">#poetry</span>
          <span className="hover:text-purple-600 cursor-pointer">#manifestation</span>
        </div>
        <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
          Dreamy
        </span>
      </div>

      {/* Actions & Stats */}
      <div className="relative z-0">
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <ReactionButton
              onReaction={onReact}
              onSoundPlay={onHover}
              selectedReaction={reaction?.reaction}
              reactionCount={reaction?.count}
              size="sm"
            />
            <div className="flex items-center gap-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative text-gray-500 hover:text-purple-600 w-8 h-8 transition-transform ${
                        animateBookmark ? "scale-110" : ""
                      }`}
                      onMouseEnter={onHover}
                      onClick={handleBookmark}
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          bookmarked ? "text-purple-600 fill-purple-100" : ""
                        }`}
                      />
                    </Button>

              <span
                aria-live="polite"
               aria-atomic="true"
            className={`
              text-xs text-gray-500 ml-0 
              inline-block text-center tabular-nums
              transition-opacity duration-300
              ${animateBookmark ? "animate-pop-up-scale" : ""}
              ${bookmarkCount > 0 ? "opacity-100" : "opacity-0"}
            `}
            style={{
              minWidth: "2.8ch", // Prevents shifting from 9 → 10 → 1.2k → 1M
              maxWidth: "4ch",   // Optional: caps large number width
            }}
          >
            {formatCount(animatedBookmarkCount)}
          </span>


                  </div>


            {/* Share Button with Count */}
            <div className="relative flex items-center">
              <ShareButton url={shareUrl} onShared={handleShared} />
              {localShareCount > 0 && (
                <span
                  key={localShareCount} 
                  className={`text-xs text-gray-500 ml-1 transition-all duration-300 ${
                    animateShare ? "animate-pop-up" : ""
                  }`}
                >
                  {localShareCount}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime.text}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>1.2k</span>
            </div>
          </div>
        </div>
      </div>

    </div>
      {bookmarkMessage && <BookmarkToast message={bookmarkMessage} />}
  </>
  )
}
