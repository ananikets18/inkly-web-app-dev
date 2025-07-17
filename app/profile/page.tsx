"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import UserIdentityPanel from "@/components/profile/UserIdentityPanel"
import ProgressAchievementsSidebar from "@/components/profile/ProgressAchievementsSidebar"
import ContentTabs from "@/components/profile/ContentTabs"
import AchievementsModal from "@/components/AchievementsModal"
import PinnedInksSection from "@/components/profile/PinnedInksSection" // Import the new component
import { useToast } from "@/hooks/use-toast"

// Mock data - in real app, this would come from API
const mockUserData = {
  id: "cosmic-ray",
  name: "Cosmic Ray",
  username: "@cosmicray",
  bio: "Collecting stardust and weaving words into constellations. ✨ Believer in the magic of midnight thoughts and morning coffee.",
  location: "San Francisco, CA",
  joinedDate: "March 2023",
  avatar: "from-purple-400 to-pink-400",
  coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  pronouns: "they/them",
  level: 12,
  xp: 2847,
  xpToNext: 3200,
  stats: {
    echoes: 15420,
    followers: 2847,
    following: 892,
    totalInks: 156,
  },
}

const mockAchievements = [
  {
    id: 1,
    name: "Wordsmith",
    icon: "✍️",
    description: "Created 50+ beautiful inks",
    rarity: "rare" as const,
    earned: "2 weeks ago",
    category: "Creation",
    unlocked: true,
  },
  {
    id: 2,
    name: "Echo Master",
    icon: "🔄",
    description: "Received 1000+ echoes",
    rarity: "epic" as const,
    earned: "1 month ago",
    category: "Engagement",
    unlocked: true,
  },
  {
    id: 3,
    name: "Night Owl",
    icon: "🦉",
    description: "Posted at midnight 10 times",
    rarity: "common" as const,
    earned: "3 days ago",
    category: "Timing",
    unlocked: true,
  },
  {
    id: 4,
    name: "Inspiration",
    icon: "💫",
    description: "Ink featured in daily highlights",
    rarity: "legendary" as const,
    earned: "1 week ago",
    category: "Recognition",
    unlocked: true,
  },
  {
    id: 5,
    name: "Connector",
    icon: "🤝",
    description: "Helped 100+ users discover new content",
    rarity: "rare" as const,
    earned: "5 days ago",
    category: "Community",
    unlocked: true,
  },
  {
    id: 6,
    name: "Streak Master",
    icon: "🔥",
    description: "Posted daily for 30 days",
    rarity: "epic" as const,
    earned: "2 weeks ago",
    category: "Consistency",
    unlocked: true,
  },
]

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
    isPinned: true, // This ink is initially pinned
    tags: ["wisdom", "mindfulness", "peace"],
    createdAt: "2024-01-15T10:30:00Z",
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
    isPinned: true, // This ink is initially pinned
    tags: ["sunsets", "beauty", "endings"],
    createdAt: "2024-01-14T18:45:00Z",
  },
  {
    id: 3,
    content: "Sometimes the most profound conversations happen in the silence between words.",
    author: "Cosmic Ray",
    avatarColor: "from-purple-400 to-pink-400",
    views: 2800,
    reactionCount: 54,
    reflectionCount: 12,
    bookmarkCount: 67,
    readingTime: { text: "20 sec", minutes: 0.3 },
    echoCount: 15,
    echoUsers: [
      { name: "Sage", avatar: "from-teal-400 to-blue-400" },
      { name: "Echo", avatar: "from-purple-400 to-pink-400" },
    ],
    isPinned: false, // This ink is not initially pinned
    tags: ["silence", "communication", "profound"],
    createdAt: "2024-01-13T14:20:00Z",
  },
  {
    id: 4,
    content: "The universe whispers secrets to those who listen with their hearts.",
    author: "Cosmic Ray",
    avatarColor: "from-purple-400 to-pink-400",
    views: 1800,
    reactionCount: 30,
    reflectionCount: 8,
    bookmarkCount: 45,
    readingTime: { text: "22 sec", minutes: 0.35 },
    echoCount: 7,
    echoUsers: [{ name: "Star", avatar: "from-yellow-400 to-orange-400" }],
    isPinned: false,
    tags: ["universe", "secrets", "heart"],
    createdAt: "2024-01-12T09:00:00Z",
  },
  {
    id: 5,
    content: "Every sunrise is an invitation to begin again, to paint new colors on the canvas of life.",
    author: "Cosmic Ray",
    avatarColor: "from-purple-400 to-pink-400",
    views: 2500,
    reactionCount: 60,
    reflectionCount: 15,
    bookmarkCount: 70,
    readingTime: { text: "35 sec", minutes: 0.6 },
    echoCount: 10,
    echoUsers: [{ name: "Dawn", avatar: "from-orange-400 to-red-400" }],
    isPinned: false,
    tags: ["sunrise", "newbeginnings", "life"],
    createdAt: "2024-01-11T07:00:00Z",
  },
]

const MAX_PINS = 3

export default function ProfilePage() {
  const [userData, setUserData] = useState(mockUserData)
  const [isOwnProfile] = useState(true) // In real app, determine from route params
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followIntent, setFollowIntent] = useState<"follow" | "unfollow" | null>(null)
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false)
  const [createdInks, setCreatedInks] = useState(mockInks)
  const [reflectedInks] = useState<any[]>([]) // Assuming these are empty for now
  const [bookmarkedInks] = useState<any[]>([]) // Assuming these are empty for now
  const [pinnedInks, setPinnedInks] = useState(mockInks.filter((ink) => ink.isPinned))
  const [hasMore, setHasMore] = useState({
    created: true,
    reflected: false,
    bookmarked: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Update pinnedInks whenever createdInks changes (e.g., after a pin/unpin action)
    setPinnedInks(createdInks.filter((ink) => ink.isPinned))
  }, [createdInks])

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFollowLoading(true)
    setFollowIntent(isFollowing ? "unfollow" : "follow")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsFollowing(!isFollowing)
    setIsFollowLoading(false)
    setFollowIntent(null)

    toast({
      title: isFollowing ? "Unfollowed" : "Now following",
      description: isFollowing ? `You unfollowed ${userData.name}` : `You're now following ${userData.name}`,
    })
  }

  const handleProfileUpdate = async (updatedData: any) => {
    setUserData((prev) => ({ ...prev, ...updatedData }))
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleLoadMore = async (tab: string) => {
    if (loading || !hasMore[tab as keyof typeof hasMore]) return

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, load more data from API
    if (tab === "created") {
      const newInks = Array.from({ length: 5 }, (_, i) => ({
        ...mockInks[0], // Use a base ink to generate new ones
        id: createdInks.length + i + 1,
        content: `This is a dynamically loaded ink #${createdInks.length + i + 1} by ${userData.name}.`,
        isPinned: false, // Newly loaded inks are not pinned by default
      }))
      setCreatedInks((prev) => [...prev, ...newInks])

      // Stop loading more after 50 items (simulation)
      if (createdInks.length >= 50) {
        setHasMore((prev) => ({ ...prev, created: false }))
      }
    }

    setLoading(false)
  }

  const handlePinInk = (inkId: number) => {
    if (pinnedInks.length >= MAX_PINS) {
      toast({
        title: "Pin Limit Reached",
        description: `You can only pin up to ${MAX_PINS} inks. Please unpin one first.`,
        variant: "destructive",
      })
      // In a real app, you'd show a modal to choose which to replace
      return
    }

    setCreatedInks((prevInks) => prevInks.map((ink) => (ink.id === inkId ? { ...ink, isPinned: true } : ink)))
    toast({
      title: "Pinned to profile ✅",
      description: "This ink is now highlighted on your profile.",
    })
  }

  const handleUnpinInk = (inkId: number) => {
    setCreatedInks((prevInks) => prevInks.map((ink) => (ink.id === inkId ? { ...ink, isPinned: false } : ink)))
    toast({
      title: "Unpinned 💨",
      description: "This ink is no longer highlighted on your profile.",
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex">
        <div className="hidden md:block">
          <SideNav />
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* User Identity Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <UserIdentityPanel
                userData={userData}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                followIntent={followIntent}
                onFollow={handleFollow}
                onProfileUpdate={handleProfileUpdate}
              />
            </motion.div>

            {/* Pinned Inks Section */}
            {isOwnProfile && (
              <PinnedInksSection pinnedInks={pinnedInks} isOwnProfile={isOwnProfile} onUnpinInk={handleUnpinInk} />
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Progress & Achievements Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24">
                  <ProgressAchievementsSidebar
                    userData={userData}
                    achievements={mockAchievements}
                    onViewAllAchievements={() => setAchievementsModalOpen(true)}
                  />
                </div>
              </motion.div>

              {/* Main Content Area */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3"
              >
                <ContentTabs
                  createdInks={createdInks}
                  reflectedInks={reflectedInks}
                  bookmarkedInks={bookmarkedInks}
                  pinnedInks={pinnedInks}
                  isOwnProfile={isOwnProfile}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loading={loading}
                  onPinInk={handlePinInk}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        badges={mockAchievements}
      />
    </div>
  )
}
