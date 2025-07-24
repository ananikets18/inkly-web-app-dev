"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import FollowButton from "@/components/FollowButton"

interface User {
  id: string
  name: string
  username: string
  bio?: string
  avatarColor: string
  isFollowing: boolean
  isFollowingYou?: boolean
  followers: number
}

interface FollowingModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

/* 10 mock following users */
const mockFollowing = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Following ${i + 1}`,
  username: `@following${i + 1}`,
  avatarColor: ["#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F87171"][i % 5],
}))

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")

export default function FollowingModal({ isOpen, onClose, userName }: FollowingModalProps) {
  const [followStates, setFollowStates] = useState<
    Record<string, { isFollowing: boolean; isLoading: boolean; intent: "follow" | "unfollow" | null }>
  >({})

  const handleFollow = async (userId: string, currentlyFollowing: boolean) => {
    setFollowStates((prev) => ({
      ...prev,
      [userId]: {
        isFollowing: currentlyFollowing,
        isLoading: true,
        intent: currentlyFollowing ? "unfollow" : "follow",
      },
    }))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFollowStates((prev) => ({
      ...prev,
      [userId]: {
        isFollowing: !currentlyFollowing,
        isLoading: false,
        intent: null,
      },
    }))
  }

  const getFollowState = (userId: string, defaultFollowing: boolean) => {
    return followStates[userId] || { isFollowing: defaultFollowing, isLoading: false, intent: null }
  }

  // Helper function to get text color based on background
  const getTextColor = (backgroundColor: string): string => {
    const hex = backgroundColor.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#FFFFFF"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex flex-col h-[600px]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Following<span className="text-muted-foreground">{` • ${mockFollowing.length}`}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <ul className="divide-y divide-border px-1 pb-4">
            {mockFollowing.map((user) => {
              const followState = getFollowState(user.id, user.isFollowing)
              return (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: user.id * 0.025 }}
                  className="flex items-center gap-3 py-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      style={{
                        backgroundColor: user.avatarColor,
                        color: "#fff",
                      }}
                    >
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                  </div>

                  <FollowButton
                    onFollow={(e) => {
                      e.preventDefault()
                      handleFollow(user.id, followState.isFollowing)
                    }}
                    isFollowing={followState.isFollowing}
                    isLoading={followState.isLoading}
                    followIntent={followState.intent}
                    className="ml-auto px-3"
                  />
                </motion.li>
              )
            })}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
