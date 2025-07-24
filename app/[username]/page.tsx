"use client"

import React, { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"
import UserIdentityPanel from "../../components/profile/UserIdentityPanel"
import PinnedInksSection from "../../components/profile/PinnedInksSection"
import ContentTabs from "../../components/profile/ContentTabs"
import ProgressAchievementsSidebar from "../../components/profile/ProgressAchievementsSidebar"
import { motion } from "framer-motion"
import { generateRandomInkId } from "@/utils/random-ink-id"
import { calculateReadingTime } from "@/utils/reading-time"
import AchievementsModal from "../../components/AchievementsModal"
import FollowToast from "../../components/FollowToast"

interface UserProfilePageProps {
  params: {
    username: string
  }
}

// Reserved paths that should not be treated as usernames
const RESERVED_PATHS = [
  "about",
  "help",
  "settings",
  "profile",
  "create",
  "explore",
  "analytics",
  "notifications",
  "drafts",
  "studio",
  "ink",
  "api",
  "admin",
  "support",
  "terms",
  "privacy",
  "contact",
  "login",
  "signup",
  "auth",
  "dashboard",
]

// Username validation regex: alphanumeric, dots, underscores, hyphens, 3-30 chars
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/

// Helper function to validate username
function isValidUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false
  if (RESERVED_PATHS.includes(username.toLowerCase())) return false
  return USERNAME_REGEX.test(username)
}

// Helper function to safely decode username
function safeDecodeUsername(encodedUsername: string): string | null {
  try {
    const decoded = decodeURIComponent(encodedUsername)
    return isValidUsername(decoded) ? decoded : null
  } catch {
    return null
  }
}

// Mock function to get user data by username
function getUserByUsername(username: string) {
  // Mock user data - in real app, this would be an API call
  const mockUsers: Record<string, any> = {
    sarah_mitchell: {
      id: "sarah_mitchell",
      name: "Sarah Mitchell",
      username: "@sarah_mitchell",
      bio: "Creator of beautiful words and digital dreams. Passionate about poetry, mindfulness, and connecting souls through storytelling.",
      location: "San Francisco, CA",
      joinedDate: "March 2023",
      avatar: "",
      avatarColor: "from-purple-500 to-pink-500",
      pronouns: "she/her",
      level: 12,
      xp: 2840,
      xpToNext: 160,
      externalLinks: [
        { url: "https://twitter.com/sarah_mitchell", label: "Twitter" },
        { url: "https://instagram.com/sarah.writes", label: "Instagram" },
      ],
      stats: {
        echoes: 1240,
        followers: 892,
        following: 234,
        totalInks: 156,
      },
      badges: [
        {
          id: 1,
          name: "Early Adopter",
          icon: "🌟",
          description: "Joined in the first month of Inkly's launch",
          rarity: "legendary",
          earned: "March 2023",
        },
        {
          id: 2,
          name: "Storyteller",
          icon: "📚",
          description: "Shared 100+ inspiring stories with the community",
          rarity: "epic",
          earned: "June 2023",
        },
        {
          id: 3,
          name: "Community Builder",
          icon: "🤝",
          description: "Helped grow the community through engagement",
          rarity: "rare",
          earned: "August 2023",
        },
        {
          id: 4,
          name: "Wordsmith",
          icon: "✍️",
          description: "Crafted beautiful prose that resonated with many",
          rarity: "rare",
          earned: "September 2023",
        },
        {
          id: 5,
          name: "Inspiration",
          icon: "💡",
          description: "Your words have inspired countless others",
          rarity: "epic",
          earned: "November 2023",
        },
        {
          id: 6,
          name: "Consistent Creator",
          icon: "🔥",
          description: "Posted every day for 30 consecutive days",
          rarity: "common",
          earned: "December 2023",
        },
      ],
    },
    maya_chen: {
      id: "maya_chen",
      name: "Maya Chen",
      username: "@maya_chen",
      bio: "Exploring the intersection of technology and humanity through words. Software engineer by day, poet by night.",
      location: "Seattle, WA",
      joinedDate: "January 2024",
      avatar: "",
      avatarColor: "from-blue-500 to-cyan-500",
      pronouns: "she/her",
      level: 8,
      xp: 1560,
      xpToNext: 240,
      externalLinks: [
        { url: "https://github.com/mayachen", label: "GitHub" },
        { url: "https://linkedin.com/in/mayachen", label: "LinkedIn" },
      ],
      stats: {
        echoes: 567,
        followers: 423,
        following: 189,
        totalInks: 89,
      },
      badges: [
        {
          id: 1,
          name: "Tech Writer",
          icon: "💻",
          description: "Writes insightful content about technology",
          rarity: "rare",
          earned: "February 2024",
        },
        {
          id: 2,
          name: "Rising Star",
          icon: "⭐",
          description: "Growing rapidly in the community",
          rarity: "common",
          earned: "March 2024",
        },
      ],
    },
    alex_thompson: {
      id: "alex_thompson",
      name: "Alex Thompson",
      username: "@alex_thompson",
      bio: "Admin and community guardian. Keeping Inkly a safe and inspiring space for all creators.",
      location: "New York, NY",
      joinedDate: "February 2023",
      avatar: "",
      avatarColor: "from-red-500 to-pink-500",
      pronouns: "they/them",
      level: 15,
      xp: 3920,
      xpToNext: 80,
      externalLinks: [{ url: "https://twitter.com/alexthompson", label: "Twitter" }],
      stats: {
        echoes: 2100,
        followers: 1340,
        following: 456,
        totalInks: 203,
      },
      badges: [
        {
          id: 1,
          name: "Admin",
          icon: "🛡️",
          description: "Platform administrator with special privileges",
          rarity: "legendary",
          earned: "February 2023",
        },
        {
          id: 2,
          name: "Community Guardian",
          icon: "🏛️",
          description: "Protects and nurtures the community",
          rarity: "epic",
          earned: "March 2023",
        },
        {
          id: 3,
          name: "Veteran",
          icon: "🎖️",
          description: "Long-time member with deep community roots",
          rarity: "rare",
          earned: "August 2023",
        },
      ],
    },
  }

  return mockUsers[username] || null
}

// Mock function to get user's inks
function getUserInks(username: string) {
  const sampleContents = [
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    "\"Are you coming?\" she asked. He smiled, 'Always.'",
    "Whisper to the universe what you seek and it shall echo back tenfold.",
    "A silent affirmation each morning shaped her every decision.",
    "Confession: I still believe in magic.",
    "Did you know? Honey never spoils. Archaeologists have found edible honey in ancient tombs.",
    "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
  ]

  const avatarColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
  ]

  return Array.from({ length: 12 }).map((_, idx) => {
    const content = sampleContents[idx % sampleContents.length]
    const readingTime = calculateReadingTime(content)
    const inkId = generateRandomInkId()

    return {
      id: idx + 1,
      inkId,
      content,
      author: `@${username}`,
      avatarColor: avatarColors[idx % avatarColors.length],
      readingTime,
      views: Math.floor(Math.random() * 1000) + 100,
      reactionCount: Math.floor(Math.random() * 50),
      reflectionCount: Math.floor(Math.random() * 20),
      bookmarkCount: Math.floor(Math.random() * 30),
      echoCount: Math.floor(Math.random() * 15),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      isPinned: idx < 2, // First 2 inks are pinned
      shareUrl: `https://inkly.app/ink/${inkId}`,
    }
  })
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [userInks, setUserInks] = useState<any[]>([])
  const [pinnedInks, setPinnedInks] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followIntent, setFollowIntent] = useState<"follow" | "unfollow" | null>(null)
  const [loading, setLoading] = useState(false)
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false)
  const [followMessage, setFollowMessage] = useState("")

  // Unwrap params if it's a Promise (Next.js 14+), fallback to direct access for backward compatibility
  let username = ""
  if (params && typeof params === "object" && typeof (params as any).then === "function") {
    // @ts-ignore: React.use is for experimental Next.js API
    const unwrappedParams = React.use(params) as { username: string }
    username = unwrappedParams?.username || ""
  } else {
    username = (params as any)?.username || ""
  }
  const decodedUsername = safeDecodeUsername(username)

  useEffect(() => {
    setMounted(true)

    // If username is invalid, show 404
    if (!decodedUsername) {
      notFound()
      return
    }

    // Fetch user data
    const user = getUserByUsername(decodedUsername)
    if (!user) {
      notFound()
      return
    }

    setUserData(user)

    // Fetch user's inks
    const inks = getUserInks(decodedUsername)
    setUserInks(inks || [])
    setPinnedInks(inks?.filter((ink) => ink.isPinned) || [])

    // Mock follow status
    setIsFollowing(Math.random() > 0.5)
  }, [decodedUsername])

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFollowLoading(true)
    setFollowIntent(isFollowing ? "unfollow" : "follow")

    setTimeout(() => {
      const newFollowState = !isFollowing
      setIsFollowing(newFollowState)
      setIsFollowLoading(false)
      setFollowIntent(null)
      setFollowMessage(
        newFollowState
          ? `You followed ${userData?.name || "this user"}`
          : `You unfollowed ${userData?.name || "this user"}`,
      )
    }, 1000)
  }

  const handleProfileUpdate = (updatedData: any) => {
    setUserData({ ...userData, ...updatedData })
  }

  const handleLoadMore = (tab: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handlePinInk = (inkId: number) => {
    const ink = userInks.find((i) => i.id === inkId)
    if (ink && !ink.isPinned) {
      const updatedInks = userInks.map((i) => (i.id === inkId ? { ...i, isPinned: true } : i))
      setUserInks(updatedInks)
      setPinnedInks([...pinnedInks, { ...ink, isPinned: true }])
    }
  }

  const handleUnpinInk = (inkId: number) => {
    const updatedInks = userInks.map((i) => (i.id === inkId ? { ...i, isPinned: false } : i))
    setUserInks(updatedInks)
    setPinnedInks(pinnedInks.filter((ink) => ink.id !== inkId))
  }

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <Header />
        <div className="flex sm:flex-row flex-col">
          <SideNav />
          <main className="flex-1 sm:px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-gray-200/60 dark:bg-gray-800/60 rounded-3xl" />
                <div className="h-32 bg-gray-200/60 dark:bg-gray-800/60 rounded-3xl" />
                <div className="h-96 bg-gray-200/60 dark:bg-gray-800/60 rounded-3xl" />
              </div>
            </div>
          </main>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 sm:px-4 py-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <UserIdentityPanel
                userData={userData}
                isOwnProfile={false}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                followIntent={followIntent}
                onFollow={handleFollow}
                onProfileUpdate={handleProfileUpdate}
              />
            </motion.div>

            <PinnedInksSection
              pinnedInks={pinnedInks}
              isOwnProfile={false}
              onUnpinInk={handleUnpinInk}
              enableMobileScroll
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <ContentTabs
                  createdInks={userInks.filter((ink) => !ink.isPinned)}
                  reflectedInks={[]}
                  bookmarkedInks={[]}
                  pinnedInks={pinnedInks}
                  isOwnProfile={false}
                  onLoadMore={handleLoadMore}
                  hasMore={{ created: true, reflected: false, bookmarked: false }}
                  loading={loading}
                  onPinInk={handlePinInk}
                />
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <ProgressAchievementsSidebar
                  userData={userData}
                  achievements={userData.badges}
                  onViewAllAchievements={() => setAchievementsModalOpen(true)}
                />
              </div>
            </div>
            {/* Mobile sidebar below main content */}
            <div className="block lg:hidden">
              <ProgressAchievementsSidebar
                userData={userData}
                achievements={userData.badges}
                onViewAllAchievements={() => setAchievementsModalOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
      <AchievementsModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        badges={userData?.badges || []}
      />
      {followMessage && <FollowToast key={followMessage} message={followMessage} />}
    </div>
  )
}
