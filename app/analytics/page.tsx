"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import EchoSummary from "@/components/analytics/EchoSummary"
import XPBadgeProgress from "@/components/analytics/XPBadgeProgress"
import SentimentTimeline from "@/components/analytics/SentimentTimeline"
import InkMilestones from "@/components/analytics/InkMilestones"
import TopInks from "@/components/analytics/TopInks"
import AudienceSnapshot from "@/components/analytics/AudienceSnapshot"
import ReflectionSpread from "@/components/analytics/ReflectionSpread"
import XPOverTime from "@/components/analytics/XPOverTime"
import StreakTracker from "@/components/analytics/StreakTracker"
import TotalInksPosted from "@/components/analytics/TotalInksPosted"
import AvgWordCount from "@/components/analytics/AvgWordCount"
import ExplorerPath from "@/components/analytics/ExplorerPath"
import Footer from "@/components/Footer"

const TABS = [
  { label: "Overview", value: "overview", desc: "Echo summary and XP progress" },
  { label: "Sentiment", value: "sentiment", desc: "Emotional sentiment timeline" },
  { label: "Journey", value: "journey", desc: "Ink journey milestones" },
  { label: "Top Inks", value: "topinks", desc: "Top performing inks" },
  { label: "Audience", value: "audience", desc: "Audience insights" },
  { label: "Reflections", value: "reflections", desc: "Reflection chains" },
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

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

function timeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds} seconds ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
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

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("overview")
  const [greeting, setGreeting] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    setGreeting(getDynamicGreeting())
    // Simulate loading user/profile data
    setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
      setLastUpdated(new Date())
    }, 1200)
  }, [])

  // Update the "now" time every 30 seconds for freshness
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

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
                    disabled={loading}
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

              {/* Tab Content Skeleton Loader */}
              {loading ? (
                <div className="space-y-6 md:space-y-8 px-3 md:px-0">
                  <Skeleton className="w-full h-32 rounded-2xl" />
                  <Skeleton className="w-full h-32 rounded-2xl" />
                  <Skeleton className="w-full h-32 rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8 px-3 md:px-0">
                  {tab === "overview" && (
                    <section id="tabpanel-overview" role="tabpanel" aria-labelledby="overview" tabIndex={0}>
                      {/* New Analytics Components */}
                      <div className="space-y-6 md:space-y-8 mb-8">
                        {/* XP and Streak Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="rounded-2xl bg-card p-4 md:p-6">
                            <XPOverTime />
                          </div>
                          <div className="rounded-2xl bg-card p-4 md:p-6">
                            <StreakTracker />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="rounded-2xl bg-card p-4 md:p-6">
                            <TotalInksPosted />
                          </div>
                          <div className="rounded-2xl bg-card p-4 md:p-6">
                            <AvgWordCount />
                          </div>
                        </div>

                        {/* Explorer Path */}
                        <div className="rounded-2xl bg-card p-4 md:p-6">
                          <ExplorerPath />
                        </div>
                      </div>

                      {/* Existing Components */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl bg-card p-4 md:p-6">
                          <EchoSummary />
                        </div>
                        <div className="rounded-2xl bg-card p-4 md:p-6">
                          <XPBadgeProgress />
                        </div>
                      </div>
                    </section>
                  )}
                  {tab === "sentiment" && (
                    <section id="tabpanel-sentiment" role="tabpanel" aria-labelledby="sentiment" tabIndex={0}>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <SentimentTimeline />
                      </div>
                    </section>
                  )}
                  {tab === "journey" && (
                    <section id="tabpanel-journey" role="tabpanel" aria-labelledby="journey" tabIndex={0}>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <InkMilestones />
                      </div>
                    </section>
                  )}
                  {tab === "topinks" && (
                    <section id="tabpanel-topinks" role="tabpanel" aria-labelledby="topinks" tabIndex={0}>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <TopInks />
                      </div>
                    </section>
                  )}
                  {tab === "audience" && (
                    <section id="tabpanel-audience" role="tabpanel" aria-labelledby="audience" tabIndex={0}>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <AudienceSnapshot />
                      </div>
                    </section>
                  )}
                  {tab === "reflections" && (
                    <section id="tabpanel-reflections" role="tabpanel" aria-labelledby="reflections" tabIndex={0}>
                      <div className="rounded-2xl bg-card p-4 md:p-6">
                        <ReflectionSpread />
                      </div>
                    </section>
                  )}
                </div>
              )}
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
