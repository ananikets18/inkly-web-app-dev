"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, RefreshCw } from "lucide-react"

import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"

import UserIdentityPanel from "@/components/profile/UserIdentityPanel"
import ContentTabs from "@/components/profile/ContentTabs"
import PinnedInksSection from "@/components/profile/PinnedInksSection"
import AchievementsModal from "@/components/AchievementsModal"
import FollowersModal from "@/components/profile/FollowersModal"
import FollowingModal from "@/components/profile/FollowingModal"
import PerformanceMonitor from "@/components/PerformanceMonitor"

import { useToast } from "@/hooks/use-toast"
import { useProfilePerformance } from "@/hooks/useProfilePerformance"
import { useProfileData } from "@/hooks/useProfileData"
import { NetworkWarning } from "@/components/NetworkWarning"
// Authentication removed - using mock authentication

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                    */
/* -------------------------------------------------------------------------- */

const MAX_PINS = 3

// Full Page Loader Component for Profile
function FullPageLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950 dark:via-background dark:to-orange-950"
      >
        <div className="text-center">
          {/* Animated Logo/Icon */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mx-auto mb-8 w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Loading Profile
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Gathering your profile data and achievements...
          </motion.p>

          {/* Animated Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-purple-500 rounded-full"
              />
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Error State Component for Profile
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <User className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Profile Unavailable
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error}
        </p>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              PROFILE COMPONENT                             */
/* -------------------------------------------------------------------------- */

import AuthGuard from "@/components/AuthGuard"

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  )
}

function ProfilePageContent() {
  /* ----------------------------- Local State ----------------------------- */
  // Get authenticated user data
  // Mock user for demo
  const user = {
    id: "demo-user-id",
    fullName: "Demo User",
    username: "demo_user",
    email: "demo@example.com",
    avatarUrl: undefined,
    bio: "This is a demo profile for testing purposes.",
    status: "active" as const,
    onboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    provider: "demo"
  }
  const userId = user?.id || "current-user-id"
  
  // Profile data management with real API integration
  const {
    userData,
    achievements,
    createdInks,
    reflectedInks,
    bookmarkedInks,
    pinnedInks,
    followers,
    following,
    isFollowing,
    isLoading,
    error,
    hasMore,
    handleFollow,
    handlePinInk,
    handleUnpinInk,
    handleLoadMore,
    clearError
  } = useProfileData({
    userId,
    enableRealAPI: false, // Set to true when backend is ready
    fallbackToMock: true
  })

  const [isOwnProfile] = useState(userId === user?.id)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followIntent, setFollowIntent] = useState<"follow" | "unfollow" | null>(null)

  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false)
  const [followersModalOpen, setFollowersModalOpen] = useState(false)
  const [followingModalOpen, setFollowingModalOpen] = useState(false)

  // Performance monitoring
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Performance optimization hook
  const {
    metrics,
    isMemoryWarning,
    performanceWarnings,
    trackApiCall,
    updateCardCount,
    finishLoading,
    performMemoryCleanup,
    getPerformanceSummary,
    isMonitoringEnabled
  } = useProfilePerformance({
    maxCards: 80,
    memoryThreshold: 150, // Increased threshold to reduce false warnings
    enableMonitoring: process.env.NODE_ENV === 'development'
  })

  const { toast } = useToast()

  /* -------------------------- Derived / Side-effects -------------------------- */
  useEffect(() => {
    setMounted(true)
    
    // Show performance monitor in development
    if (process.env.NODE_ENV === 'development') {
      setShowPerformanceMonitor(true)
    }
    
    return () => {
      // Cleanup on unmount
      if (isMonitoringEnabled) {
        performMemoryCleanup()
      }
    }
  }, [isMonitoringEnabled, performMemoryCleanup])

  // Track loading completion
  useEffect(() => {
    if (!isLoading && mounted) {
      finishLoading()
    }
  }, [isLoading, mounted, finishLoading])

  /* ----------------------------- Event Handlers ----------------------------- */
  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isFollowLoading) return
    
    setIsFollowLoading(true)
    setFollowIntent(isFollowing ? "unfollow" : "follow")
    
    try {
      await handleFollow()
      
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing 
          ? `You've unfollowed ${userData?.name || 'this user'}`
          : `You're now following ${userData?.name || 'this user'}`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsFollowLoading(false)
      setFollowIntent(null)
    }
  }

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      // In real app, call API to update profile
      console.log("Profile updated:", updatedData)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleLoadMoreClick = async (tab: string) => {
    try {
      trackApiCall()
      await handleLoadMore(tab)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more content. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handlePinInkClick = async (inkId: number) => {
    try {
      await handlePinInk(inkId)
      
      toast({
        title: "Ink Pinned",
        description: "Ink has been pinned to your profile.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Pin Failed",
        description: "Failed to pin ink. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleUnpinInkClick = async (inkId: number) => {
    try {
      await handleUnpinInk(inkId)
      
      toast({
        title: "Ink Unpinned",
        description: "Ink has been unpinned from your profile.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Unpin Failed",
        description: "Failed to unpin ink. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleViewAllAchievements = () => {
    setAchievementsModalOpen(true)
  }

  const handleViewFollowers = () => {
    setFollowersModalOpen(true)
  }

  const handleViewFollowing = () => {
    setFollowingModalOpen(true)
  }

  /* ----------------------------- Error Handling ----------------------------- */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        duration: 5000,
      })
      clearError()
    }
  }, [error, toast, clearError])

  /* ----------------------------- Performance Warnings ----------------------------- */
  useEffect(() => {
    if (isMemoryWarning) {
      toast({
        title: "Performance Warning",
        description: "High memory usage detected. Consider refreshing the page.",
        variant: "destructive",
        duration: 8000,
      })
    }
  }, [isMemoryWarning, toast])

  /* ----------------------------- Loading States ----------------------------- */
  // Show full page loader while data is loading or user is not authenticated
  if (isLoading && !userData || !user) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={clearError} />
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <Header aria-label="Main navigation bar" />
      
      <div className="flex flex-1 w-full max-w-full">
        {/* Side Navigation (desktop) */}
        <nav className="hidden md:block w-max flex-shrink-0" aria-label="Sidebar navigation" role="navigation">
          <SideNav />
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 w-full" aria-label="Profile page main content">
          {/* Performance Monitor (dev only) */}
          {showPerformanceMonitor && (
            <PerformanceMonitor 
              cardCount={createdInks.length + reflectedInks.length + bookmarkedInks.length}
              isVisible={showPerformanceMonitor}
            />
          )}

          {/* Profile Content */}
          <div className="px-0 md:px-5 py-4 md:py-10 text-xs md:text-sm">
            <div className="max-w-7xl mx-auto">
              {/* Network Warning */}
              <NetworkWarning variant="banner" />
                             {/* User Identity Panel */}
               {userData && (
                 <UserIdentityPanel
                   userData={userData}
                   isFollowing={isFollowing}
                   isOwnProfile={isOwnProfile}
                   isFollowLoading={isFollowLoading}
                   followIntent={followIntent}
                   onFollow={handleFollowClick}
                   onProfileUpdate={handleProfileUpdate}
                   onFollowersClick={handleViewFollowers}
                   onFollowingClick={handleViewFollowing}
                 />
               )}

              {/* Pinned Inks Section */}
              {pinnedInks.length > 0 && (
                <PinnedInksSection
                  pinnedInks={pinnedInks}
                  isOwnProfile={isOwnProfile}
                  onUnpinInk={handleUnpinInkClick}
                />
              )}

                             {/* Content Tabs */}
               <ContentTabs
                 createdInks={createdInks}
                 reflectedInks={reflectedInks}
                 bookmarkedInks={bookmarkedInks}
                 pinnedInks={pinnedInks}
                 hasMore={hasMore}
                 loading={isLoading}
                 onLoadMore={handleLoadMoreClick}
                 onPinInk={handlePinInkClick}
                 isOwnProfile={isOwnProfile}
               />
            </div>
          </div>
        </main>
      </div>
      
      {/* Bottom Navigation (always visible) */}
      <nav className="block sticky bottom-0 z-50" aria-label="Bottom navigation" role="navigation">
        <BottomNav />
      </nav>
      
      <Footer />

             {/* Modals */}
       <AchievementsModal
         isOpen={achievementsModalOpen}
         onClose={() => setAchievementsModalOpen(false)}
         badges={achievements}
       />
       
       <FollowersModal
         isOpen={followersModalOpen}
         onClose={() => setFollowersModalOpen(false)}
         followers={followers}
       />
       
       <FollowingModal
         isOpen={followingModalOpen}
         onClose={() => setFollowingModalOpen(false)}
         following={following}
       />
    </div>
  )
}
