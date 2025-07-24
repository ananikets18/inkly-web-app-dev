"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"

import UserIdentityPanel from "@/components/profile/UserIdentityPanel"
import ProgressAchievementsSidebar from "@/components/profile/ProgressAchievementsSidebar"
import ContentTabs from "@/components/profile/ContentTabs"
import PinnedInksSection from "@/components/profile/PinnedInksSection"
import AchievementsModal from "@/components/AchievementsModal"
import FollowersModal from "@/components/profile/FollowersModal"
import FollowingModal from "@/components/profile/FollowingModal"

import { useToast } from "@/hooks/use-toast"

/* -------------------------------------------------------------------------- */
/*                              MOCK USER DATA                               */
/* -------------------------------------------------------------------------- */

const mockUserData = {
  id: "cosmic-ray",
  name: "Cosmic Ray",
  username: "@cosmicray",
  bio: "Collecting stardust and weaving words into constellations. ✨ Believer in the magic of midnight thoughts and morning coffee.",
  location: "San Francisco, CA",
  joinedDate: "March 2023",
  avatar: "from-purple-400 to-pink-400",
  avatarColor: "#6BCB77",
  pronouns: "they/them",
  level: 12,
  xp: 2847,
  xpToNext: 3200,
  externalLinks: [
    { url: "https://twitter.com/cosmicray", label: "Twitter" },
    { url: "https://instagram.com/cosmic.ray.art", label: "Instagram" },
  ],
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
  /* ...additional mock achievements... */
]

const mockInks = [
  {
    id: 1,
    content:
      "The stars don't compete with each other; they simply shine. Maybe that's the secret to finding peace in a world that constantly asks us to compare.",
    author: "Cosmic Ray",
    avatarColor: "#6BCB77",
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
    isPinned: true,
    tags: ["wisdom", "mindfulness", "peace"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  /* ...additional mock inks... */
]

const MAX_PINS = 3

/* -------------------------------------------------------------------------- */
/*                              PROFILE COMPONENT                             */
/* -------------------------------------------------------------------------- */

export default function ProfilePage() {
  /* ----------------------------- Local State ----------------------------- */
  const [userData, setUserData] = useState(mockUserData)
  const [isOwnProfile] = useState(true)

  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followIntent, setFollowIntent] = useState<"follow" | "unfollow" | null>(null)

  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false)
  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)

  const [createdInks, setCreatedInks] = useState(mockInks)
  const [reflectedInks] = useState<any[]>([])
  const [bookmarkedInks] = useState<any[]>([])
  const [pinnedInks, setPinnedInks] = useState(mockInks.filter((ink) => ink.isPinned))
  const [hasMore, setHasMore] = useState({
    created: true,
    reflected: false,
    bookmarked: false,
  })
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  /* -------------------------- Derived / Side-effects -------------------------- */
  useEffect(() => {
    setPinnedInks(createdInks.filter((ink) => ink.isPinned))
  }, [createdInks])

  /* ------------------------------- Handlers ------------------------------ */
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFollowLoading(true)
    setFollowIntent(isFollowing ? "unfollow" : "follow")

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

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (tab === "created") {
      const newInks = Array.from({ length: 5 }, (_, i) => ({
        ...mockInks[0],
        id: createdInks.length + i + 1,
        content: `This is a dynamically loaded ink #${createdInks.length + i + 1} by ${userData.name}.`,
        isPinned: false,
      }))
      setCreatedInks((prev) => [...prev, ...newInks])

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
      return
    }
    setCreatedInks((prev) => prev.map((ink) => (ink.id === inkId ? { ...ink, isPinned: true } : ink)))
    toast({ title: "Pinned to profile ✅", description: "This ink is now highlighted on your profile." })
  }

  const handleUnpinInk = (inkId: number) => {
    setCreatedInks((prev) => prev.map((ink) => (ink.id === inkId ? { ...ink, isPinned: false } : ink)))
    toast({ title: "Unpinned 💨", description: "This ink is no longer highlighted on your profile." })
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex">
        <div className="hidden md:block">
          <SideNav />
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* ------------------------------------------------------------------ */}
            {/*                          USER IDENTITY PANEL                        */}
            {/* ------------------------------------------------------------------ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <UserIdentityPanel
                userData={userData}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                followIntent={followIntent}
                onFollow={handleFollow}
                onProfileUpdate={handleProfileUpdate}
                /* NEW: open the modals */
                onFollowersClick={() => setFollowersModalOpen(true)}
                onFollowingClick={() => setFollowingModalOpen(true)}
              />
            </motion.div>

            {/* --------------------------- PINNED INKS --------------------------- */}
            {isOwnProfile && (
              <PinnedInksSection pinnedInks={pinnedInks} isOwnProfile={isOwnProfile} onUnpinInk={handleUnpinInk} />
            )}

            {/* ---------------------- GRID (sidebar + content) ------------------- */}
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

      {/* Bottom navigation for mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>
      <Footer />

      {/* ------------------------------ MODALS ------------------------------ */}
      <AchievementsModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        badges={mockAchievements}
      />

      <FollowersModal
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        totalCount={userData.stats.followers}
        userName={userData.name}
        // followers={[]}
      />

      <FollowingModal
        isOpen={followingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
        totalCount={userData.stats.following}
        userName={userData.name}
        // following={[]}
      />
    </div>
  )
}
