"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Sparkles, Loader2, RefreshCw } from "lucide-react"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import EchoSummary from "@/components/analytics/EchoSummary"
import XPBadgeProgress from "@/components/analytics/XPBadgeProgress"
import TopInks from "@/components/analytics/TopInks"
import StreakTracker from "@/components/analytics/StreakTracker"
import TotalInksPosted from "@/components/analytics/TotalInksPosted"
import ViewsImpressions from "@/components/analytics/ViewsImpressions"
import EngagementRate from "@/components/analytics/EngagementRate"
import BestTimeToPost from "@/components/analytics/BestTimeToPost"
import GrowthRate from "@/components/analytics/GrowthRate"
import Footer from "@/components/Footer"
import { useUserAnalytics, AnalyticsAPIError } from "@/lib/api/analytics"
import { useToast } from "@/hooks/use-toast"
import { NetworkWarning } from "@/components/NetworkWarning"
// Authentication removed - using mock authentication

const TABS = [
  { label: "Overview", value: "overview", desc: "Core metrics and progress" },
  { label: "Performance", value: "performance", desc: "What works best" },
  { label: "Engagement", value: "engagement", desc: "Community interaction" },
]

// Mock user data
interface UserProfile {
  name: string
  username: string
  image: string
}
const mockUser: UserProfile = {
  name: "Alex Johnson",
  username: "alexj",
  image: "", // Set to a URL for real image, or leave blank for initials
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
}

function getColorFromName(name: string): string {
  // Simple hash to color
  const colors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-rose-500",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[hash % colors.length]
}

function getDynamicGreeting() {
  const hour = new Date().getHours()
  let timeGreeting = ""
  if (hour < 12) timeGreeting = "Good morning"
  else if (hour < 18) timeGreeting = "Good afternoon"
  else timeGreeting = "Good evening"

  const messages = [
    `${timeGreeting}, Inkly Creator!`,
    "Hope you're having a creative day!",
    "Let's see how your words are inspiring others!",
    "Your quotes are making waves!",
    "Ready to check your Inkly journey?",
    "Welcome, storyteller!",
    "Keep spreading inspiration!",
    "Your creativity is contagious!",
    "Every ink counts—let's see your impact!",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Full Page Loader Component
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
            <BarChart3 className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Loading Analytics
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Gathering your insights and performance data...
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

// Error State Component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <BarChart3 className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Analytics Unavailable
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

// Hero Section Component
function AnalyticsHeroSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden w-full" aria-labelledby="hero-heading">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950/20 dark:via-background dark:to-orange-950/20" />

      {/* Floating particles/ambient elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60"
          animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-16 w-1 h-1 bg-orange-400 rounded-full opacity-40"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-50"
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 mb-6 leading-tight"
          >
            Analytics Dashboard
          </h1>
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Track your impact and see how your words inspire the world
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <BarChart3 className="w-5 h-5 text-purple-500" aria-hidden="true" />
            <span className="text-sm text-muted-foreground font-medium">Your creative insights await</span>
            <Sparkles className="w-5 h-5 text-orange-500" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import AuthGuard from "@/components/AuthGuard"

export default function AnalyticsDashboard() {
  return (
    <AuthGuard>
      <AnalyticsDashboardContent />
    </AuthGuard>
  )
}

function AnalyticsDashboardContent() {
  const [tab, setTab] = useState("overview")
  const [greeting, setGreeting] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [now, setNow] = useState<Date>(new Date())
  const timeRange = "7d"

  // Get current user ID from auth context
  // Mock user for demo
  const user = {
    id: "demo-user-id",
    fullName: "Demo User",
    username: "demo_user",
    email: "demo@example.com"
  }
  const userId = user?.id || "current-user-id"

  // Analytics data hook
  const { data, refetch, clearCache } = useUserAnalytics(userId, timeRange)
  const { toast } = useToast()

  useEffect(() => {
    setGreeting(getDynamicGreeting())
    // Simulate loading user/profile data
    setTimeout(() => {
      setUserProfile(mockUser)
      setLastUpdated(new Date())
    }, 1200)
  }, [])

  // Update the "now" time every 30 seconds for freshness
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle retry
  const handleRetry = () => {
    clearCache()
    refetch()
  }

  // Show full page loader while data is loading
  if (data.isLoading) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (data.error) {
    return <ErrorState error={data.error} onRetry={handleRetry} />
  }

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
        <main className="flex-1 w-full" aria-label="Analytics dashboard main content">
          {/* Hero Section */}
          <AnalyticsHeroSection />

          {/* Dashboard Content */}
          <div className="px-0 md:px-5 py-4 md:py-10 text-xs md:text-sm">
            <div className="max-w-7xl mx-auto">
              {/* Network Warning */}
              <NetworkWarning variant="banner" />
              
              {/* Last Updated Info */}
              <div className="flex items-center justify-between mb-6 px-3 md:px-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Last 7 days</span>
                  <button
                    onClick={handleRetry}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Never'}
                </div>
              </div>

              {/* Tabs */}
              <nav
                className="mb-6 flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-3 md:px-0"
                aria-label="Analytics dashboard tabs"
                role="tablist"
              >
                {TABS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`px-3 py-1 rounded-full font-medium text-xs md:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                      tab === t.value
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                    aria-label={t.label}
                    aria-selected={tab === t.value}
                    aria-controls={`tabpanel-${t.value}`}
                    role="tab"
                    title={t.desc}
                    tabIndex={tab === t.value ? 0 : -1}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>

              {/* Tab Content */}
              <div className="space-y-6 md:space-y-8 px-3 md:px-0">
                {tab === "overview" && (
                  <section id="tabpanel-overview" role="tabpanel" aria-labelledby="overview" tabIndex={0}>
                    {/* Core Metrics Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <TotalInksPosted />
                      </div>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <ViewsImpressions />
                      </div>
                    </div>

                    {/* Engagement and Progress */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <EngagementRate />
                      </div>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <StreakTracker />
                      </div>
                    </div>

                    {/* XP Progress */}
                    <div className="rounded-2xl bg-card p-4 md:p-6">
                      <XPBadgeProgress />
                    </div>
                  </section>
                )}
                {tab === "performance" && (
                  <section id="tabpanel-performance" role="tabpanel" aria-labelledby="performance" tabIndex={0}>
                    {/* Top Performing Content */}
                    <div className="rounded-2xl bg-card p-4 md:p-6 mb-8">
                      <TopInks />
                    </div>

                    {/* Performance Insights */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <BestTimeToPost />
                      </div>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <GrowthRate />
                      </div>
                    </div>
                  </section>
                )}
                {tab === "engagement" && (
                  <section id="tabpanel-engagement" role="tabpanel" aria-labelledby="engagement" tabIndex={0}>
                    <div className="rounded-2xl bg-card p-4 md:p-6">
                      <EchoSummary />
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Bottom Navigation (always visible) */}
      <nav className="block sticky bottom-0 z-50" aria-label="Bottom navigation" role="navigation">
        <BottomNav />
      </nav>
      <Footer />
    </div>
  )
}
