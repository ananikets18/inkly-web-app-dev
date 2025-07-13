"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  MapPin,
  Calendar,
  Share2,
  Star,
  Zap,
  Heart,
  Bookmark,
  MessageCircle,
  Trophy,
  Sparkles,
  Camera,
  MoreHorizontal,
  Flag,
} from "lucide-react"
import { motion } from "framer-motion"
import ResponsiveInkCard from "@/components/ResponsiveInkCard"
import { formatCount } from "@/utils/formatCount"
import FollowButton from "@/components/FollowButton"
import BadgeModal from "@/components/BadgeModal"
import ShareProfileModal from "@/components/ShareProfileModal"
import ReportProfile from "@/components/ReportProfile"
import AchievementsModal from "@/components/AchievementsModal"


// Mock user data
const userData = {
  id: "cosmic-ray",
  name: "Cosmic Ray",
  username: "@cosmicray",
  bio: "Collecting stardust and weaving words into constellations. ✨ Believer in the magic of midnight thoughts and morning coffee.",
  avatar: "from-purple-400 to-pink-400",
  location: "San Francisco, CA",
  joinedDate: "March 2023",
  isFollowing: false,
  level: 12,
  xp: 2847,
  xpToNext: 3200,
  stats: {
    echoes: 15420,
    followers: 2847,
    following: 892,
    totalInks: 156,
  },
  badges: [
    {
      id: 1,
      name: "Wordsmith",
      icon: "✍️",
      description: "Created 50+ beautiful inks",
      rarity: "rare",
      earned: "2 weeks ago",
    },
    {
      id: 2,
      name: "Echo Master",
      icon: "🔄",
      description: "Received 1000+ echoes",
      rarity: "epic",
      earned: "1 month ago",
    },
    {
      id: 3,
      name: "Night Owl",
      icon: "🦉",
      description: "Posted at midnight 10 times",
      rarity: "common",
      earned: "3 days ago",
    },
    {
      id: 4,
      name: "Inspiration",
      icon: "💫",
      description: "Ink featured in daily highlights",
      rarity: "legendary",
      earned: "1 week ago",
    },
    {
      id: 5,
      name: "Connector",
      icon: "🤝",
      description: "Helped 100+ users discover new content",
      rarity: "rare",
      earned: "5 days ago",
    },
    {
      id: 6,
      name: "Streak Master",
      icon: "🔥",
      description: "Posted daily for 30 days",
      rarity: "epic",
      earned: "2 weeks ago",
    },
    {
      id: 7,
      name: "Early Bird",
      icon: "🌅",
      description: "Posted before 6 AM 15 times",
      rarity: "common",
      earned: "1 week ago",
    },
    {
      id: 8,
      name: "Philosopher",
      icon: "🧠",
      description: "Created 25+ wisdom-themed inks",
      rarity: "rare",
      earned: "3 weeks ago",
    },
    {
      id: 9,
      name: "Community Star",
      icon: "⭐",
      description: "Top 1% most engaged user this month",
      rarity: "legendary",
      earned: "2 days ago",
    },
    {
      id: 10,
      name: "Poet",
      icon: "📝",
      description: "Created 20+ poetic inks",
      rarity: "rare",
      earned: "1 month ago",
    },
    {
      id: 11,
      name: "Trendsetter",
      icon: "🚀",
      description: "Started 5+ trending conversations",
      rarity: "epic",
      earned: "4 days ago",
    },
    {
      id: 12,
      name: "Mentor",
      icon: "🎓",
      description: "Helped 50+ new users get started",
      rarity: "epic",
      earned: "1 week ago",
    },
  ],
}

// Mock ink data
const mockInks = [
  {
    id: 1,
    content:
      "The stars don't compete with each other; they simply shine. Maybe that's the secret to finding peace in a world that constantly asks us to compare.",
    author: "Cosmic Ray",
    avatarColor: "from-purple-400 to-pink-400",
    views: 4200,
    reactionCount: 89,
    reflectionCount: 23,
    bookmarkCount: 156,
    readingTime: { text: "30 sec", minutes: 0.5 },
    echoCount: 12,
    echoUsers: [
      { name: "Luna", avatar: "from-blue-400 to-cyan-400" },
      { name: "Sol", avatar: "from-yellow-400 to-orange-400" },
    ],
  },
  {
    id: 2,
    content:
      "I collect sunsets like other people collect stamps. Each one unique, each one a reminder that endings can be beautiful too.",
    author: "Cosmic Ray",
    avatarColor: "from-purple-400 to-pink-400",
    views: 3100,
    reactionCount: 67,
    reflectionCount: 18,
    bookmarkCount: 89,
    readingTime: { text: "25 sec", minutes: 0.4 },
    echoCount: 8,
    echoUsers: [{ name: "River", avatar: "from-green-400 to-blue-400" }],
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("created")
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followIntent, setFollowIntent] = useState<string | null>(null)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)

  const xpProgress = (userData.xp / userData.xpToNext) * 100

  const handleFollowClick = async () => {
    setIsFollowLoading(true)
    setFollowIntent(isFollowing ? "unfollow" : "follow")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsFollowing(!isFollowing)
    setIsFollowLoading(false)
    setFollowIntent(null)
  }

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "epic":
        return "from-purple-400 to-purple-600"
      case "legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getBadgeGlow = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "shadow-gray-400/20"
      case "rare":
        return "shadow-blue-400/30"
      case "epic":
        return "shadow-purple-400/40"
      case "legendary":
        return "shadow-yellow-400/50"
      default:
        return "shadow-gray-400/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 lg:pb-6">
      {/* Cover Image Section */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Cover Actions */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 flex gap-2 sm:gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 text-white w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
          >
            <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 text-white w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
              >
                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[160px] p-1 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-sm z-50"
            >
              <DropdownMenuItem
                onClick={() => setShowShareModal(true)}
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Share2 className="w-4 h-4 text-zinc-500 group-hover:text-blue-600 transition" />
                <span className="text-[13px] md:text-sm">Share Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <Flag className="w-4 h-4" />
                <span>Report Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ambient Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative -mt-16 sm:-mt-20 lg:-mt-24">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Mobile Layout */}
              <div className="flex flex-col sm:hidden">
                {/* Avatar and Level */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-20 h-20 ring-4 ring-white shadow-2xl">
                      <AvatarFallback className={`bg-gradient-to-br ${userData.avatar} text-white text-xl font-bold`}>
                        CR
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Lv.{userData.level}
                    </div>
                  </div>

                  {/* Action Buttons - Mobile */}
                  <div className="flex gap-2 ml-auto">
                    <FollowButton
                      onFollow={handleFollowClick}
                      isFollowing={isFollowing}
                      isLoading={isFollowLoading}
                      followIntent={followIntent as "follow" | "unfollow" | null}
                      className="text-base px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* User Info - Mobile */}
                <div className="mb-4">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h1>
                  <p className="text-purple-600 font-medium text-sm mb-2">{userData.username}</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{userData.bio}</p>

                  {/* Meta Info - Mobile */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {userData.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet/Desktop Layout */}
              <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-end gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row lg:flex-row lg:items-end gap-4 sm:gap-6 flex-1">
                  <div className="relative flex-shrink-0 sm:self-start lg:self-end">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 ring-4 sm:ring-6 ring-white shadow-2xl">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${userData.avatar} text-white text-2xl sm:text-3xl lg:text-4xl font-bold`}
                      >
                        CR
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                      Lv.{userData.level}
                    </div>
                  </div>

                  {/* User Info - Tablet/Desktop */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {userData.name}
                        </h1>
                        <p className="text-purple-600 font-medium text-sm sm:text-base mb-2 sm:mb-3">
                          {userData.username}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3 sm:mb-4 max-w-2xl">{userData.bio}</p>

                        {/* Meta Info - Tablet/Desktop */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{userData.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {userData.joinedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Tablet/Desktop */}
                      <div className="flex gap-3 sm:flex-col sm:items-end lg:flex-col lg:items-end">
                        <FollowButton
                          onFollow={handleFollowClick}
                          isFollowing={isFollowing}
                          isLoading={isFollowLoading}
                          followIntent={followIntent as "follow" | "unfollow" | null}
                          className="text-base px-8 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg border-0 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200/50">
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {formatCount(userData.stats.echoes)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Echoes</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {formatCount(userData.stats.followers)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {formatCount(userData.stats.following)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {userData.stats.totalInks}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Inks</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* XP Progress Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" />
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Level Progress</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Level {userData.level}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {userData.xp.toLocaleString()} / {userData.xpToNext.toLocaleString()} XP
                    </div>
                  </div>

                  <Progress value={xpProgress} className="h-3 sm:h-4 bg-gray-200/50" />

                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-600">
                      {(userData.xpToNext - userData.xp).toLocaleString()} XP to next level
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Badges Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Achievements</h3>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    {userData.badges.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {userData.badges.slice(0, 6).map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBadge(badge)}
                      className={`relative p-2 sm:p-3 bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} rounded-xl sm:rounded-2xl cursor-pointer shadow-lg ${getBadgeGlow(badge.rarity)} hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="text-center">
                        <div className="text-base sm:text-lg mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium text-white leading-tight">{badge.name}</div>
                      </div>
                      {badge.rarity === "legendary" && (
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="w-2 sm:w-3 h-2 sm:h-3 text-yellow-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {userData.badges.length > 6 && (
                  <div className="mt-3 sm:mt-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm"
                      onClick={() => setShowAchievementsModal(true)}
                    >
                      View all {userData.badges.length} achievements
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl overflow-hidden"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-white/20 bg-white/30 backdrop-blur-sm">
                    <TabsList className="w-full bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="created"
                        className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500"
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Created Inks</span>
                          <span className="sm:hidden text-xs">Created</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="reflected"
                        className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500"
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Reflected</span>
                          <span className="sm:hidden text-xs">Reflected</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="bookmarked"
                        className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500"
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Bookmark className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Bookmarked</span>
                          <span className="sm:hidden text-xs">Saved</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="echoes"
                        className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500"
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Heart className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Echo History</span>
                          <span className="sm:hidden text-xs">Echoes</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-3 sm:p-6">
                    <TabsContent value="created" className="mt-0">
                      <div className="space-y-4 sm:space-y-6">
                        {mockInks.map((ink) => (
                          <ResponsiveInkCard 
                            key={ink.id} 
                            {...ink}
                            shareUrl={`https://inkly.app/ink/${ink.id}`}
                            onClick={() => {}}
                            onHover={() => {}}
                            onBookmark={() => {}}
                            onShare={() => {}}
                            onFollow={() => {}}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="reflected" className="mt-0">
                      <div className="text-center py-8 sm:py-12">
                        <MessageCircle className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Reflected Inks Yet</h3>
                        <p className="text-gray-600 text-sm">Start reflecting on others' inks to see them here.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="bookmarked" className="mt-0">
                      <div className="text-center py-8 sm:py-12">
                        <Bookmark className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Bookmarked Inks</h3>
                        <p className="text-gray-600 text-sm">Bookmark inks you want to revisit later.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="echoes" className="mt-0">
                      <div className="text-center py-8 sm:py-12">
                        <Heart className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Echo History</h3>
                        <p className="text-gray-600 text-sm">
                          Your recent reactions and interactions will appear here.
                        </p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Modal */}
      <BadgeModal badge={selectedBadge} isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} />

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={`https://inkly.app/profile/${userData.id}`}
        title={`Check out ${userData.name}'s profile on Inkly`}
      />

      {/* Report Profile Modal */}
      <ReportProfile
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        profileId={userData.id}
        profileName={userData.name}
        profileBio={userData.bio}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        badges={userData.badges}
      />
    </div>
  )
}
