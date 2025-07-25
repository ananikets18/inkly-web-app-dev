"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Bookmark } from "lucide-react"
import ReactionButton from "@/components/reaction-button"
import { truncate } from "@/utils/truncate"
import { formatCount } from "@/utils/formatCount"
import BookmarkToast from "../components/BookmarkToast"
import FollowToast from "../components/FollowToast"
import FollowButton from "./FollowButton"
import MoreOptionsDropdown from "./MoreOptionsDropdown"
import ReportModal from "./ReportModal"
import ReflectModal from "./ReflectModal"
import EchoPile from "./EchoPile"
import EchoBurst from "@/components/EchoBurst"
import { motion } from "framer-motion"
import { VerifiedTick, getUserBadgeType, shouldShowVerifiedTick, getDisplayName } from "./ui/user-badges"
import { AvatarBadge } from "./ui/user-badges"
import { useSoundEffects } from "../hooks/use-sound-effects"
import Link from "next/link"
import FloatingToast from "../components/FloatingToast"
import CollectionPickerModal from "./collections/CollectionPickerModal"

interface InkCardProps {
  id: number
  content: string
  author: string
  avatarColor: string
  isLong?: boolean
  reaction?: { reaction: string; count: number }
  bookmarkCount: number
  baseEchoCount: number
  onClick: () => void
  onHover: () => void
  onReact?: (reactionId: string | null) => void
  onBookmark: () => void
  onShare: () => void
  onFollow: () => void
  views: number
  reactionCount: number
  reflectionCount: number
  readingTime: { text: string; minutes: number }
  shareCount?: number
  shareUrl: string
  animateBookmark: boolean
  setAnimateBookmark: (value: boolean) => void
  bookmarked: boolean
  bookmarkLocked: boolean
  setBookmarkLocked: (value: boolean) => void
  bookmarkMessage: string | null
  setBookmarkMessage: (value: string | null) => void
  isFollowing: boolean
  setIsFollowing: (value: boolean) => void
  isFollowLoading: boolean
  setIsFollowLoading: (value: boolean) => void
  isFollowIntent: "follow" | "unfollow" | null
  setIsFollowIntent: (value: "follow" | "unfollow" | null) => void
  reportOpen: boolean
  setReportOpen: (value: boolean) => void
  reflectOpen: boolean
  setReflectOpen: (value: boolean) => void
  localReaction: { reaction: string | null }
  setLocalReaction: (value: { reaction: string | null }) => void
  reactionCountLocal: number
  setReactionCountLocal: (value: number) => void
  reflectionCountLocal: number
  setReflectionCountLocal: (value: number) => void
  bookmarkCountLocal: number
  setBookmarkCountLocal: (value: number) => void
  showEchoAnim: boolean
  setShowEchoAnim: (value: boolean) => void
  hasReflected: boolean
  setHasReflected: (value: boolean) => void
  hasInkified: boolean
  setHasInkified: (value: boolean) => void
  echoCount: number
  setEchoCount: (value: number) => void
  followMessage: string | null
  setFollowMessage: (value: string | null) => void
  echoUsers: { name: string; avatar: string }[]
  handleReaction: (reactionId: string | null) => void
  handleBookmark: (e: React.MouseEvent) => void
  handleFollowClick: (e: React.MouseEvent) => void
  inkId?: string
  small?: boolean
  collectionPickerOpen: boolean
  setCollectionPickerOpen: (value: boolean) => void
  handleSaveToCollections: (collectionIds: string[]) => void
}

// Removed getTagsAndMood function

const InkCardComponent = (props: InkCardProps) => {
  const {
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
    views,
    reactionCount,
    reflectionCount,
    bookmarkCount,
    shareCount = 0,
    animateBookmark,
    setAnimateBookmark,
    bookmarked,
    bookmarkLocked,
    setBookmarkLocked,
    bookmarkMessage,
    setBookmarkMessage,
    isFollowing,
    setIsFollowing,
    isFollowLoading,
    setIsFollowLoading,
    isFollowIntent,
    setIsFollowIntent,
    reportOpen,
    setReportOpen,
    reflectOpen,
    setReflectOpen,
    localReaction,
    setLocalReaction,
    reactionCountLocal,
    setReactionCountLocal,
    reflectionCountLocal,
    setReflectionCountLocal,
    bookmarkCountLocal,
    setBookmarkCountLocal,
    showEchoAnim,
    setShowEchoAnim,
    hasReflected,
    setHasReflected,
    hasInkified,
    setHasInkified,
    echoCount,
    setEchoCount,
    followMessage,
    setFollowMessage,
    echoUsers,
    handleReaction,
    handleBookmark: handleBookmarkProp,
    handleFollowClick,
    inkId,
    small = false,
    collectionPickerOpen,
    setCollectionPickerOpen,
    handleSaveToCollections,
    ...rest
  } = props

  const hasReacted = localReaction.reaction !== null
  const shareUrl = `https://inkly.app/?share=${id}`

  const handleReportClick = useCallback(() => setReportOpen(true), [setReportOpen])

  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { playSound } = useSoundEffects()

  // Determine truncation length
  const TRUNCATE_LENGTH = isLong ? 280 : 120
  const isTruncatable = content.length > TRUNCATE_LENGTH

  const [undoInkifyMsg, setUndoInkifyMsg] = useState<string | null>(null)

  useEffect(() => {
    if (followMessage) {
      const timeout = setTimeout(() => setFollowMessage(null), 2500)
      return () => clearTimeout(timeout)
    }
  }, [followMessage])

  useEffect(() => {
    if (showEchoAnim) {
      const timeout = setTimeout(() => setShowEchoAnim(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [showEchoAnim, setShowEchoAnim])

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768)
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  // Handle bookmark button click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Right click or Ctrl+click opens collection picker
    if (e.button === 2 || e.ctrlKey || e.metaKey) {
      playSound("modalOpen")
      setCollectionPickerOpen(true)
      return
    }

    // Regular click does quick bookmark
    handleBookmarkProp(e)
  }

  // Handle bookmark button context menu (right click)
  const handleBookmarkContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    playSound("modalOpen")
    setCollectionPickerOpen(true)
  }

  // Handler to go to public profile
  const handleViewProfile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.location.href = `/${encodeURIComponent(author)}`;
  };

  return (
    <>
      <div
        className={`w-full bg-card rounded-xl shadow-sm px-4 py-5 mb-4 sm:border sm:border-border${small ? " text-xs" : ""}`}
        onClick={onClick}
      >
        <div className={`flex items-center justify-between mb-3${small ? " text-xs" : ""}`}>
          <div className="flex items-center gap-2">
            <Link href={`/${encodeURIComponent(author)}`} passHref legacyBehavior>
              <div
                className={`relative cursor-pointer ${getUserBadgeType(author) ? "p-0.5 rounded-full" : ""} ${
                  getUserBadgeType(author) === "creator"
                    ? "bg-gradient-to-r from-purple-400 to-pink-400"
                    : getUserBadgeType(author) === "admin"
                      ? "bg-gradient-to-r from-red-400 to-pink-400"
                      : getUserBadgeType(author) === "moderator"
                        ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                        : getUserBadgeType(author) === "contributor"
                          ? "bg-gradient-to-r from-green-400 to-emerald-400"
                          : getUserBadgeType(author) === "writer"
                            ? "bg-gradient-to-r from-orange-400 to-amber-400"
                            : getUserBadgeType(author) === "author"
                              ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                              : ""
                }`}
                onClick={e => e.stopPropagation()}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`bg-gradient-to-br ${avatarColor} text-white text-base font-medium`}>
                    {getDisplayName(author)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {getUserBadgeType(author) && <AvatarBadge type={getUserBadgeType(author)!} />}
              </div>
            </Link>
            <Link href={`/${encodeURIComponent(author)}`} passHref legacyBehavior>
              <div className="flex flex-col -space-y-1 cursor-pointer" onClick={e => e.stopPropagation()}>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  {getDisplayName(author)}
                  {/* Only show verified tick for contributors (not special users) */}
                  {!getUserBadgeType(author) && shouldShowVerifiedTick(author) && <VerifiedTick />}
                </span>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-0">
            <FollowButton
              onFollow={handleFollowClick}
              isFollowing={isFollowing}
              isLoading={isFollowLoading}
              followIntent={isFollowIntent}
            />
            <MoreOptionsDropdown url={shareUrl} onShared={onShare} onReportClick={handleReportClick} />
          </div>
        </div>

        <div
          className={`mb-4 ${small ? "text-xs" : "text-base sm:text-[16px] md:text-[17px] lg:text-[18px]"} font-semibold text-foreground leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed whitespace-pre-line sm:px-2 sm:py-2`}
        >
          <Link href={`/ink/${inkId ?? id}`} passHref legacyBehavior>
            <a style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
              {expanded || !isTruncatable ? (
                <>
                  {content}
                  {isTruncatable && expanded && (
                    <button
                      className="ml-2 text-xs text-purple-600 underline hover:text-purple-800 transition-colors font-medium"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpanded(false)
                      }}
                    >
                      Read less
                    </button>
                  )}
                </>
              ) : (
                <>
                  {truncate(content, TRUNCATE_LENGTH)}
                  <button
                    className="ml-2 text-xs text-purple-600 underline hover:text-purple-800 transition-colors font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded(true)
                    }}
                  >
                    Read more
                  </button>
                </>
              )}
            </a>
          </Link>
        </div>

        <div
          className={`flex justify-between items-center ${small ? "text-[11px]" : "text-xs"} text-muted-foreground pt-2 border-t border-border`}
        >
          <div className="flex items-center gap-3">
            <ReactionButton
              onReaction={handleReaction}
              selectedReaction={localReaction.reaction}
              onSoundPlay={onHover}
              size="sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setReflectOpen(true)
              }}
              onMouseEnter={onHover}
              className="relative text-muted-foreground hover:text-blue-600 w-8 h-8"
              disabled={hasReflected && hasInkified}
              title="Add reflection or repost"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582a10.054 10.054 0 0115.775-1.317M20 20v-5h-.582a10.054 10.054 0 01-15.775 1.317"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkClick}
              onContextMenu={handleBookmarkContextMenu}
              onMouseEnter={onHover}
              className={`relative w-8 h-8 transition-all ${
                bookmarked ? "text-purple-600 hover:text-purple-700" : "text-muted-foreground hover:text-purple-600"
              } ${bookmarkLocked ? "opacity-50" : ""}`}
              disabled={bookmarkLocked}
              title={
                bookmarked
                  ? "Remove from bookmarks (Right-click for collections)"
                  : "Save to bookmarks (Right-click for collections)"
              }
            >
              <motion.div animate={animateBookmark ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
              </motion.div>
              {bookmarkCountLocal > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {bookmarkCountLocal > 99 ? "99+" : bookmarkCountLocal}
                </span>
              )}
            </Button>
          </div>
          <div
            className={`flex items-center gap-3 ${small ? "text-[11px]" : "text-xs sm:text-sm"} text-muted-foreground`}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime.text}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{formatCount(views)}</span>
            </div>
          </div>
        </div>

        {echoCount > 0 && (
          <div className="relative flex items-center gap-2 text-xs text-muted-foreground pt-1 pl-1">
            <motion.div
              className="flex"
              key={echoCount}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <EchoPile users={echoUsers} total={echoCount} />
            </motion.div>
            <EchoBurst show={showEchoAnim} />
          </div>
        )}
      </div>

      <ReflectModal
        open={reflectOpen}
        onClose={() => setReflectOpen(false)}
        onRepost={() => {
          playSound("modalOpen")
          setHasInkified(true)
          setReflectOpen(false)
        }}
        onUndoRepost={() => {
          setHasInkified(false)
          setUndoInkifyMsg("Inkify undone. You can repost if you wish.")
          setReflectOpen(false)
        }}
        onSubmit={(text) => {
          setReflectionCountLocal(reflectionCountLocal + 1)
          setHasReflected(true)
          console.log("Reflection text:", text)
        }}
        originalInk={{ content, author, timestamp: "2h ago" }}
        hasReflected={hasReflected}
        hasInkified={hasInkified}
      />

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} inkId={id.toString()} content={content} />
      {bookmarkMessage && <BookmarkToast message={bookmarkMessage} />}
      {followMessage && <FollowToast key={followMessage} message={followMessage} />}
      {undoInkifyMsg && <FloatingToast key={undoInkifyMsg} message={undoInkifyMsg} />}

      <CollectionPickerModal
        isOpen={collectionPickerOpen}
        onClose={() => setCollectionPickerOpen(false)}
        inkId={id}
        inkTitle={content}
        isMobile={isMobile}
      />
    </>
  )
}

export default React.memo(InkCardComponent)
