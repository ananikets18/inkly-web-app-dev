"use client"

import { useState, useEffect } from "react"
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
    "Hope you’re having a creative day!",
    "Let’s see how your words are inspiring others!",
    "Your quotes are making waves!",
    "Ready to check your Inkly journey?",
    "Welcome, storyteller!",
    "Keep spreading inspiration!",
    "Your creativity is contagious!",
    "Every ink counts—let’s see your impact!",
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
        <main
          className="flex-1 w-full px-0 md:px-5 py-4 md:py-10 text-xs md:text-sm"
          aria-label="Analytics dashboard main content"
        >
          <div className="max-w-7xl mx-auto">
            {/* Title and Subtitle Section (like notifications) */}
            <div className="px-3 md:px-0 pb-6 md:pb-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border gap-0 sm:gap-0">
              <div className="pl-2 py-3 mb-0 flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Analytics
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">See how your words are making an impact</p>
                {/* Last updated on mobile */}
                <div className="flex flex-col gap-0.5 w-full mt-4 sm:hidden">
                  {loading ? (
                    <Skeleton className="w-20 h-3 mb-1" />
                  ) : lastUpdated ? (
                    <>
                      <div className="text-xs text-muted-foreground">Last updated</div>
                      <div className="text-xs font-medium text-foreground" aria-live="polite">
                        {timeAgo(lastUpdated)}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
              {/* Last updated on desktop */}
              <div className="hidden sm:flex flex-col gap-0.5 text-right min-w-[70px] mt-0">
                {loading ? (
                  <Skeleton className="w-20 h-3 mb-1" />
                ) : lastUpdated ? (
                  <>
                    <div className="text-xs text-muted-foreground">Last updated</div>
                    <div className="text-xs font-medium text-foreground" aria-live="polite">
                      {timeAgo(lastUpdated)}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* Tabs */}
            <nav
              className="mb-6 flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide"
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
              <div className="space-y-6 md:space-y-8">
                <Skeleton className="w-full h-32 rounded-2xl" />
                <Skeleton className="w-full h-32 rounded-2xl" />
                <Skeleton className="w-full h-32 rounded-2xl" />
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8">
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
        </main>
      </div>
      {/* Bottom Navigation (always visible) */}
      <nav className="block sticky bottom-0 z-50" aria-label="Bottom navigation" role="navigation">
        <BottomNav />
      </nav>
    </div>
  )
}
