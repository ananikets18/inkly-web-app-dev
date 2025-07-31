"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import InkCard from "./InkCard"
import InkCardMobile from "./InkCardMobile"
import { useSoundEffects } from "../hooks/use-sound-effects"
import useCooldown from "../hooks/useCooldown"

interface ResponsiveInkCardProps {
  // Match the full props of InkCard for now
  id: number
  inkId?: string // add optional inkId for navigation
  content: string
  author: string
  avatarColor: string
  isLong?: boolean
  readingTime: { text: string; minutes: number }
  views?: number // make optional
  echoCount: number
  reaction?: { reaction: string; count: number }
  bookmarkCount: number
  hasReflected?: boolean
  hasInkified?: boolean
  reactionCount: number
  reflectionCount: number
  shareUrl: string
  onClick: () => void
  onHover: () => void
  onReact?: (reactionId: string | null) => void
  onBookmark: () => void
  onShare: () => void
  onFollow: () => void
  small?: boolean
}

// Memoized function to generate random views based on ID
function getRandomViews(id: number) {
  // Use a deterministic seed based on ID to ensure consistent views for same ID
  const seed = id * 9301 + 49297
  const random = (seed * 233280) % 2147483647
  return Math.floor((random / 2147483647) * 1000) + 100
}

// Memoized echo users array to prevent unnecessary re-renders
const createEchoUsers = () => [
  { name: "Sarah Chen", avatar: "SC" },
  { name: "Alex Rivera", avatar: "AR" },
  { name: "Maya Patel", avatar: "MP" },
  { name: "David Kim", avatar: "DK" },
  { name: "Emma Wilson", avatar: "EW" },
]

export default function ResponsiveInkCard(props: ResponsiveInkCardProps) {
  const { small = false, ...rest } = props
  const [isMobile, setIsMobile] = useState(false)
  const { playSound } = useSoundEffects()

  // LIFTED STATE - Memoized to prevent unnecessary re-renders
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkLocked, setBookmarkLocked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isFollowIntent, setIsFollowIntent] = useState<"follow" | "unfollow" | null>(null)
  const [localReaction, setLocalReaction] = useState<{ reaction: string | null }>({
    reaction: props.reaction?.reaction || null,
  })
  const [reactionCountLocal, setReactionCountLocal] = useState(props.reactionCount)
  const [reflectionCountLocal, setReflectionCountLocal] = useState(props.reflectionCount)
  const [bookmarkCountLocal, setBookmarkCountLocal] = useState(props.bookmarkCount)
  const [hasReflected, setHasReflected] = useState(false)
  const [hasInkified, setHasInkified] = useState(false)
  const [echoCount, setEchoCount] = useState(0)
  const [showEchoAnim, setShowEchoAnim] = useState(false)
  const [bookmarkMessage, setBookmarkMessage] = useState<string | null>(null)
  const [followMessage, setFollowMessage] = useState<string | null>(null)
  const [reflectOpen, setReflectOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [animateBookmark, setAnimateBookmark] = useState(false)
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false)

  // Cooldown hooks with longer durations to prevent frequent triggers
  const { isCoolingDown: isBookmarkCoolingDown, trigger: triggerBookmarkCooldown } = useCooldown(1500)
  const { isCoolingDown: isFollowCoolingDown, trigger: triggerFollowCooldown } = useCooldown(1500)
  const { isCoolingDown: isShareCoolingDown, trigger: triggerShareCoolingDown } = useCooldown(1500)
  const { isCoolingDown: isReportCoolingDown, trigger: triggerReportCooldown } = useCooldown(1500)

  // Memoized echo users to prevent recreation on every render
  const echoUsers = useMemo(() => createEchoUsers(), [])

  // Debounced screen size check
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 786)
    checkScreen()
    
    let timeoutId: NodeJS.Timeout
    const debouncedCheck = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreen, 100)
    }
    
    window.addEventListener("resize", debouncedCheck)
    return () => {
      window.removeEventListener("resize", debouncedCheck)
      clearTimeout(timeoutId)
    }
  }, [])

  // Memoized echo count calculation to prevent unnecessary updates
  const calculatedEchoCount = useMemo(() => {
    return reactionCountLocal + bookmarkCountLocal + reflectionCountLocal + (hasInkified ? 1 : 0)
  }, [reactionCountLocal, bookmarkCountLocal, reflectionCountLocal, hasInkified])

  // Update echo count only when it actually changes
  useEffect(() => {
    if (calculatedEchoCount !== echoCount) {
      setEchoCount(calculatedEchoCount)
    }
  }, [calculatedEchoCount, echoCount])

  // Debounced echo animation reset
  const resetEchoAnim = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setShowEchoAnim(false)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  // SHARED HANDLERS - Optimized with proper debouncing
  const handleReaction = useCallback((reactionId: string | null) => {
    // Play sound only when adding a reaction
    if (reactionId) playSound("like")
    const hadReaction = localReaction.reaction !== null
    const willReact = reactionId !== null
    setLocalReaction({ reaction: reactionId })
    setReactionCountLocal((prev) =>
      !hadReaction && willReact ? prev + 1 : hadReaction && !willReact ? Math.max(0, prev - 1) : prev,
    )
    if (!hadReaction && willReact) {
      setShowEchoAnim(true)
      resetEchoAnim()
    }
    props.onReact?.(reactionId)
  }, [localReaction.reaction, playSound, props, resetEchoAnim])

  const handleBookmark = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation()

    // Play sound immediately for bookmark
    if (bookmarkLocked || isBookmarkCoolingDown) {
      playSound("click")
      setBookmarkMessage("Too fast! Hold on a sec.")
      return
    }
    if (!triggerBookmarkCooldown()) return

    const next = !bookmarked
    setBookmarkLocked(true)
    setBookmarked(next)
    setBookmarkCountLocal((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
    setAnimateBookmark(true)

    if (next) {
      setShowEchoAnim(true)
      resetEchoAnim()
      playSound("bookmark")
      setBookmarkMessage("Saved to your inspirations ✨")
    } else {
      playSound("click")
      setBookmarkMessage("Removed from bookmarks 🗂️")
    }

    props.onBookmark?.()

    // Debounced animation reset
    const timeoutId = setTimeout(() => {
      setBookmarkLocked(false)
      setAnimateBookmark(false)
    }, 800)
    
    const messageTimeoutId = setTimeout(() => setBookmarkMessage(null), 1800)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(messageTimeoutId)
    }
  }, [bookmarked, bookmarkLocked, isBookmarkCoolingDown, playSound, props, resetEchoAnim, triggerBookmarkCooldown])

  // Separate handler for InkCard that only accepts MouseEvent
  const handleBookmarkDesktop = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    // Play sound immediately for bookmark
    if (bookmarkLocked || isBookmarkCoolingDown) {
      playSound("click")
      setBookmarkMessage("Too fast! Hold on a sec.")
      return
    }
    if (!triggerBookmarkCooldown()) return

    const next = !bookmarked
    setBookmarkLocked(true)
    setBookmarked(next)
    setBookmarkCountLocal((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
    setAnimateBookmark(true)

    if (next) {
      setShowEchoAnim(true)
      resetEchoAnim()
      playSound("bookmark")
      setBookmarkMessage("Saved to your inspirations ✨")
    } else {
      playSound("click")
      setBookmarkMessage("Removed from bookmarks 🗂️")
    }

    props.onBookmark?.()

    // Debounced animation reset
    const timeoutId = setTimeout(() => {
      setBookmarkLocked(false)
      setAnimateBookmark(false)
    }, 800)
    
    const messageTimeoutId = setTimeout(() => setBookmarkMessage(null), 1800)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(messageTimeoutId)
    }
  }, [bookmarked, bookmarkLocked, isBookmarkCoolingDown, playSound, props, resetEchoAnim, triggerBookmarkCooldown])

  const handleSaveToCollections = useCallback((collectionIds: string[]) => {
    setBookmarked(true)
    setBookmarkCountLocal((prev) => prev + 1)
    setShowEchoAnim(true)
    setAnimateBookmark(true)
    playSound("bookmark")
    props.onBookmark?.()

    const timeoutId = setTimeout(() => {
      setAnimateBookmark(false)
    }, 800)
    
    resetEchoAnim()
    
    return () => clearTimeout(timeoutId)
  }, [playSound, props, resetEchoAnim])

  const handleFollowClick = useCallback(() => {
    // Play sound immediately for follow/unfollow
    playSound(isFollowing ? "modalClose" : "follow")
    if (isFollowLoading || isFollowCoolingDown) {
      playSound("click")
      setFollowMessage("Too fast! Hold on a sec.")
      return
    }
    if (!triggerFollowCooldown()) return
    setIsFollowIntent(isFollowing ? "unfollow" : "follow")
    setIsFollowLoading(true)
    
    const timeoutId = setTimeout(() => {
      const newFollowState = !isFollowing
      setIsFollowing(newFollowState)
      setIsFollowLoading(false)
      if (newFollowState) {
        setFollowMessage(`You followed ${props.author}`)
      } else {
        setFollowMessage(`You Unfollowed ${props.author} !`)
      }
      props.onFollow?.()
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [isFollowing, isFollowLoading, isFollowCoolingDown, playSound, props, triggerFollowCooldown])

  const handleShare = useCallback(() => {
    // Play sound immediately for share
    if (isShareCoolingDown) {
      playSound("click")
      return
    }
    if (!triggerShareCoolingDown()) return
    playSound("click")
    props.onShare?.()
  }, [isShareCoolingDown, playSound, props, triggerShareCoolingDown])

  const handleReportClick = useCallback(() => {
    if (isReportCoolingDown) {
      playSound("click")
      return
    }
    if (!triggerReportCooldown()) return
    setReportOpen(true)
  }, [isReportCoolingDown, triggerReportCooldown])

  // Memoized shared state to prevent unnecessary re-renders
  const sharedState = useMemo(() => ({
    animateBookmark,
    setAnimateBookmark,
    bookmarked,
    setBookmarked,
    bookmarkLocked,
    setBookmarkLocked,
    isFollowing,
    setIsFollowing,
    isFollowLoading,
    setIsFollowLoading,
    isFollowIntent,
    setIsFollowIntent,
    localReaction,
    setLocalReaction,
    reactionCountLocal,
    setReactionCountLocal,
    reflectionCountLocal,
    setReflectionCountLocal,
    bookmarkCountLocal,
    setBookmarkCountLocal,
    hasReflected,
    setHasReflected,
    hasInkified,
    setHasInkified,
    echoCount,
    setEchoCount,
    showEchoAnim,
    setShowEchoAnim,
    bookmarkMessage,
    setBookmarkMessage,
    followMessage,
    setFollowMessage,
    reflectOpen,
    setReflectOpen,
    reportOpen,
    setReportOpen,
    echoUsers,
    collectionPickerOpen,
    setCollectionPickerOpen,
    handleSaveToCollections,
    handleReaction,
    handleBookmark,
    handleBookmarkDesktop,
    handleFollowClick,
    handleShare,
    handleReportClick,
  }), [
    animateBookmark, bookmarked, bookmarkLocked, isFollowing, isFollowLoading, isFollowIntent,
    localReaction, reactionCountLocal, reflectionCountLocal, bookmarkCountLocal, hasReflected,
    hasInkified, echoCount, showEchoAnim, bookmarkMessage, followMessage, reflectOpen, reportOpen,
    echoUsers, collectionPickerOpen, handleSaveToCollections, handleReaction, handleBookmark,
    handleBookmarkDesktop, handleFollowClick, handleShare, handleReportClick
  ])

  // Memoized random views to prevent recalculation
  const randomViews = useMemo(() => getRandomViews(props.id), [props.id])

  // Remove console.log to prevent unnecessary work
  // console.log("ResponsiveInkCard rendered", { isMobile })

  if (isMobile) {
    return (
      <InkCardMobile
        {...rest}
        views={randomViews}
        inkId={props.inkId}
        {...sharedState}
        isFollowIntent={isFollowIntent === "follow" ? true : isFollowIntent === "unfollow" ? false : null}
        setIsFollowIntent={(v) => setIsFollowIntent(v === true ? "follow" : v === false ? "unfollow" : null)}
        followMessage={followMessage || ""}
      />
    )
  }

  return (
    <InkCard 
      {...rest} 
      views={randomViews} 
      inkId={props.inkId} 
      baseEchoCount={props.echoCount}
      {...sharedState} 
      handleBookmark={handleBookmarkDesktop}
      small={small} 
    />
  )
}
