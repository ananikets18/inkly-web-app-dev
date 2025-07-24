"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Users, Loader2 } from "lucide-react"
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

interface FollowersModalProps {
  isOpen: boolean
  onClose: () => void
  followers?: User[]
  totalCount: number
  isLoading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  userName: string
}

// Mock followers data
const mockFollowers: User[] = [
  {
    id: "1",
    name: "Luna Starweaver",
    username: "@lunastar",
    bio: "Dreaming in pixels and poetry ✨",
    avatarColor: "#3B82F6",
    isFollowing: true,
    isFollowingYou: true,
    followers: 1234,
  },
  {
    id: "2",
    name: "Echo Chambers",
    username: "@echochambers",
    bio: "Sound designer & digital artist",
    avatarColor: "#10B981",
    isFollowing: false,
    isFollowingYou: true,
    followers: 856,
  },
  {
    id: "3",
    name: "River Flow",
    username: "@riverflow",
    bio: "Going with the flow of creativity",
    avatarColor: "#8B5CF6",
    isFollowing: true,
    isFollowingYou: false,
    followers: 2341,
  },
  {
    id: "4",
    name: "Sage Wisdom",
    username: "@sagewords",
    bio: "Ancient wisdom for modern minds",
    avatarColor: "#F59E0B",
    isFollowing: false,
    isFollowingYou: true,
    followers: 567,
  },
  {
    id: "5",
    name: "Nova Bright",
    username: "@novabright",
    bio: "Illuminating the digital cosmos",
    avatarColor: "#EF4444",
    isFollowing: true,
    isFollowingYou: true,
    followers: 3456,
  },
  {
    id: "6",
    name: "Celeste Dreamer",
    username: "@celestedreamer",
    bio: "Exploring the stars of imagination",
    avatarColor: "#6366F1",
    isFollowing: false,
    isFollowingYou: false,
    followers: 789,
  },
  {
    id: "7",
    name: "Atlas Writer",
    username: "@atlaswriter",
    bio: "Mapping stories across worlds",
    avatarColor: "#F472B6",
    isFollowing: true,
    isFollowingYou: false,
    followers: 1200,
  },
  {
    id: "8",
    name: "Violet Verse",
    username: "@violetverse",
    bio: "Poetry in every shade of purple",
    avatarColor: "#A78BFA",
    isFollowing: false,
    isFollowingYou: true,
    followers: 980,
  },
  {
    id: "9",
    name: "Orion Sketch",
    username: "@orionsketch",
    bio: "Drawing constellations with words",
    avatarColor: "#FBBF24",
    isFollowing: true,
    isFollowingYou: false,
    followers: 1500,
  },
  {
    id: "10",
    name: "Mira Muse",
    username: "@miramuse",
    bio: "Inspired by the universe within",
    avatarColor: "#34D399",
    isFollowing: false,
    isFollowingYou: true,
    followers: 1100,
  },
]

export default function FollowersModal({
  isOpen,
  onClose,
  followers = mockFollowers,
  totalCount,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  userName,
}: FollowersModalProps) {
  // const [searchQuery, setSearchQuery] = useState("")
  const [followStates, setFollowStates] = useState<
    Record<string, { isFollowing: boolean; isLoading: boolean; intent: "follow" | "unfollow" | null }>
  >({})

  const filteredFollowers = followers;

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
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {userName}'s Followers
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({formatCount(totalCount)})</span>
          </DialogTitle>
        </DialogHeader>

        {/* Followers List */}
        <ScrollArea className="flex-1 px-4 sm:px-6 max-h-[60vh]">
          <div className="space-y-3 pb-4">
            <AnimatePresence>
              {filteredFollowers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {"No followers yet"}
                  </p>
                </motion.div>
              ) : (
                filteredFollowers.map((user, index) => {
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
        {filteredFollowers.length > 0 && (
          <div className="px-4 sm:px-6 pb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            "Your followers are your creative community. Engage, inspire, and grow together!"
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
