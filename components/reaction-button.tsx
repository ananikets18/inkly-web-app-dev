"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Laugh, Zap, Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Reaction {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  hoverColor: string
  bgColor: string
}

const reactions: Reaction[] = [
  {
    id: "like",
    icon: <Heart className="w-5 h-5" />,
    label: "Like",
    color: "text-red-500",
    hoverColor: "hover:text-red-600",
    bgColor: "hover:bg-red-50",
  },
  {
    id: "love",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    label: "Love",
    color: "text-pink-500",
    hoverColor: "hover:text-pink-600",
    bgColor: "hover:bg-pink-50",
  },
  {
    id: "laugh",
    icon: <Laugh className="w-5 h-5" />,
    label: "Laugh",
    color: "text-yellow-500",
    hoverColor: "hover:text-yellow-600",
    bgColor: "hover:bg-yellow-50",
  },
  {
    id: "wow",
    icon: <Zap className="w-5 h-5" />,
    label: "Wow",
    color: "text-blue-500",
    hoverColor: "hover:text-blue-600",
    bgColor: "hover:bg-blue-50",
  },
  {
    id: "sad",
    icon: <Frown className="w-5 h-5" />,
    label: "Sad",
    color: "text-gray-500",
    hoverColor: "hover:text-gray-600",
    bgColor: "hover:bg-gray-50",
  },
]

interface ReactionButtonProps {
  onReaction?: (reactionId: string) => void
  onSoundPlay?: (soundType: "click" | "hover" | "like") => void
  selectedReaction?: string | null
  reactionCount?: number
  size?: "sm" | "md" | "lg"
  variant?: "ghost" | "outline"
  className?: string
}

export default function ReactionButton({
  onReaction,
  onSoundPlay,
  selectedReaction = null,
  reactionCount = 0,
  size = "md",
  variant = "ghost",
  className = "",
}: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle mouse events for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      onSoundPlay?.("hover")
      clearTimeout(timeoutRef.current)
      setShowReactions(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setShowReactions(false)
      }, 200)
    }
  }

  // Handle click for mobile
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isMobile) {
      onSoundPlay?.("click")
      setShowReactions(!showReactions)
    } else {
      // On desktop, clicking the main button gives a default like
      onSoundPlay?.("like")
      onReaction?.("like")
    }
  }

  // Handle reaction selection
  const handleReactionSelect = (reactionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSoundPlay?.("like")
    onReaction?.(reactionId)
    setShowReactions(false)
  }

  // Close reactions when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowReactions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobile])

  const selectedReactionData = reactions.find((r) => r.id === selectedReaction)
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className="relative inline-flex items-center">
      <Button
        ref={buttonRef}
        variant={variant}
        size="icon"
        className={`${sizeClasses[size]} ${
          selectedReaction ? selectedReactionData?.color : "text-gray-500"
        } transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {selectedReaction ? (
          selectedReactionData?.icon
        ) : (
          <Heart className={`${size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4 h-4" : "w-5 h-5"}`} />
        )}
      </Button>

      {/* Reaction Count */}
      {reactionCount > 0 && <span className="ml-1 text-xs text-gray-600 font-medium">{reactionCount}</span>}

      {/* Reactions Panel */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: isMobile ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: isMobile ? -10 : 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute z-50 ${
              isMobile
                ? "bottom-full mb-3 left-1/2 transform -translate-x-1/2"
                : "top-full mt-3 left-1/2 transform -translate-x-1/2"
            }`}
            onMouseEnter={() => !isMobile && clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`bg-white rounded-2xl shadow-xl border border-gray-200 ${
                isMobile ? "p-2 flex flex-col gap-1" : "px-4 py-3 flex flex-row gap-2"
              }`}
            >
              {reactions.map((reaction, index) => (
                <motion.button
                  key={reaction.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.15 }}
                  className={`flex items-center justify-center rounded-xl transition-all duration-200 ${reaction.color} ${reaction.hoverColor} ${reaction.bgColor} hover:scale-125 active:scale-95 ${
                    isMobile ? "w-12 h-12" : "w-11 h-11"
                  }`}
                  onClick={(e) => handleReactionSelect(reaction.id, e)}
                  onMouseEnter={() => onSoundPlay?.("hover")}
                  title={reaction.label}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -8, 8, 0],
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {reaction.icon}
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Arrow */}
            <div
              className={`absolute ${
                isMobile
                  ? "top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"
                  : "bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-white"
              }`}
            />

            {/* Shadow for arrow */}
            <div
              className={`absolute ${
                isMobile
                  ? "top-full left-1/2 transform -translate-x-1/2 translate-y-[-1px] w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-200"
                  : "bottom-full left-1/2 transform -translate-x-1/2 translate-y-[1px] w-0 h-0 border-l-[7px] border-r-[7px] border-b-[7px] border-l-transparent border-r-transparent border-b-gray-200"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
