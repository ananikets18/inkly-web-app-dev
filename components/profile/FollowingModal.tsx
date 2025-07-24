"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import FollowButton from "@/components/FollowButton"
import { formatCount } from "@/utils/formatCount"

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
  following?: User[]
  totalCount: number
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  userName: string
}

// Mock following data
const mockFollowing: User[] = [
  {
    id: "1",
    name: "Aurora Borealis",
    username: "@aurorab",
    bio: "Chasing northern lights and digital dreams",
    avatarColor: "#06B6D4",
    isFollowing: true,
    isFollowingYou: true,
    followers: 4567,
  },
  {
    id: "2",
    name: "Midnight Muse",
    username: "@midnightmuse",
    bio: "Inspiration strikes at 3 AM",
    avatarColor: "#8B5CF6",
    isFollowing: true,
    isFollowingYou: false,
    followers: 1234,
  },
  {
    id: "3",
    name: "Digital Nomad",
    username: "@digitalnomad",
    bio: "Working from anywhere with WiFi",
    avatarColor: "#F59E0B",
    isFollowing: true,
    isFollowingYou: true,
    followers: 7890,
  },
  {
    id: "4",
    name: "Pixel Artist",
    username: "@pixelartist",
    bio: "Creating worlds one pixel at a time",
    avatarColor: "#EF4444",
    isFollowing: true,
    isFollowingYou: false,
    followers: 2345,
  },
  {
    id: "5",
    name: "Code Poet",
    username: "@codepoet",
    bio: "Writing poetry in JavaScript",
    avatarColor: "#10B981",
    isFollowing: true,
    isFollowingYou: true,
    followers: 5678,
  },
  {
    id: "6",
    name: "Sunset Chaser",
    username: "@sunsetchaser",
    bio: "Always looking for the perfect golden hour",
    avatarColor: "#F97316",
    isFollowing: true,
    isFollowingYou: false,
    followers: 3456,
  },
  {
    id: "7",
    name: "Echo Writer",
    username: "@echowriter",
    bio: "Echoing stories across the world",
    avatarColor: "#F87171",
    isFollowing: true,
    isFollowingYou: true,
    followers: 2100,
  },
  {
    id: "8",
    name: "Galaxy Scribe",
    username: "@galaxyscribe",
    bio: "Writing across the stars",
    avatarColor: "#60A5FA",
    isFollowing: true,
    isFollowingYou: false,
    followers: 1750,
  },
  {
    id: "9",
    name: "Nova Quill",
    username: "@novaquill",
    bio: "Penning cosmic tales",
    avatarColor: "#A3E635",
    isFollowing: true,
    isFollowingYou: true,
    followers: 990,
  },
  {
    id: "10",
    name: "Stellar Pen",
    username: "@stellarpen",
    bio: "Writing with the light of a thousand stars",
    avatarColor: "#FDE68A",
    isFollowing: true,
    isFollowingYou: false,
    followers: 1300,
  },
]

export default function FollowingModal({
  isOpen,
  onClose,
  following = mockFollowing,
  totalCount,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  userName,
}: FollowingModalProps) {
  // const [searchQuery, setSearchQuery] = useState("")
  const [followStates, setFollowStates] = useState<
    Record<string, { isFollowing: boolean; isLoading: boolean; intent: "follow" | "unfollow" | null }>
  >({})

  const filteredFollowing = following;

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
      <DialogContent className="max-w-md w-full mx-4 sm:mx-auto max-h-[80vh] p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {userName} is following
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({formatCount(totalCount)})</span>
          </DialogTitle>
        </DialogHeader>

        {/* Following List */}
        <ScrollArea className="flex-1 px-4 sm:px-6 max-h-[60vh]">
          <div className="space-y-3 pb-4">
            <AnimatePresence>
              {filteredFollowing.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <UserPlus className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {"Not following anyone yet"}
                  </p>
                </motion.div>
              ) : (
                filteredFollowing.map((user, index) => {
                  const followState = getFollowState(user.id, user.isFollowing)
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/80 transition-colors"
                    >
                      {/* Avatar */}
                      <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-900">
                        <AvatarFallback
                          style={{
                            backgroundColor: user.avatarColor,
                            color: getTextColor(user.avatarColor),
                          }}
                          className="font-semibold"
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatCount(user.followers)} followers
                        </p>
                      </div>

                      {/* Follow Button */}
                      <FollowButton
                        onFollow={(e) => {
                          e.preventDefault()
                          handleFollow(user.id, followState.isFollowing)
                        }}
                        isFollowing={followState.isFollowing}
                        isLoading={followState.isLoading}
                        followIntent={followState.intent}
                        className="text-xs px-3 py-1.5"
                      />
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button onClick={onLoadMore} disabled={isLoading} variant="outline" className="w-full bg-transparent">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
        {/* Meaningful message below the list */}
        {filteredFollowing.length > 0 && (
          <div className="px-4 sm:px-6 pb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            "You are following inspiring creators. Stay curious and keep exploring new ideas!"
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
