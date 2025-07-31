"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bookmark,
  Share2,
  Trophy,
  Star,
  Zap,
  Filter,
  Check,
  Quote,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronUp,
  Brain,
  Flame,
  Circle,
} from "lucide-react"
import { useSoundEffects } from "../../hooks/useSoundEffects"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"
// Authentication removed - using mock authentication

// Remove NotificationType, BaseNotification, ClusteredNotification, SingleNotification, Notification, mockNotifications
// Replace mockNotifications and types with a minimal notification state (empty array for now, to be filled by real data integration)

const getSentimentGradient = (sentiment?: string) => {
  switch (sentiment) {
    case "positive":
      return "from-amber-400/30 to-orange-400/30"
    case "thoughtful":
      return "from-blue-400/30 to-indigo-400/30"
    case "viral":
      return "from-pink-400/30 to-purple-400/30"
    default:
      return "from-purple-400/20 to-indigo-400/20"
  }
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "reaction":
      return Heart
    case "follow":
      return UserPlus
    case "reflection":
      return MessageCircle
    case "bookmark":
      return Bookmark
    case "share":
      return Share2
    case "milestone":
      return Trophy
    case "experimental":
      return Brain
    case "system":
      return Bell
    default:
      return Bell
  }
}

const groupNotificationsByTime = (notifications: any[]) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups = {
    today: [] as any[],
    thisWeek: [] as any[],
    lastMonth: [] as any[],
    milestones: [] as any[],
    older: [] as any[],
  }

  notifications.forEach((notification) => {
    const ts = new Date(notification.timestamp as any)
    if (notification.type === "milestone") {
      groups.milestones.push(notification)
    } else if (ts >= today) {
      groups.today.push(notification)
    } else if (ts >= thisWeek) {
      groups.thisWeek.push(notification)
    } else if (ts >= lastMonth) {
      groups.lastMonth.push(notification)
    } else {
      groups.older.push(notification)
    }
  })

  return groups
}

// Utility for relative time
const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

// Hero Section Component
// Full Page Loader Component for Notifications
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
            <Bell className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Loading Notifications
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Fetching your latest updates and activities...
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

// Error State Component for Notifications
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <Bell className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Notifications Unavailable
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

function NotificationsHeroSection() {
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
            Notifications
          </h1>
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Stay connected with your community and creative journey
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Bell className="w-5 h-5 text-purple-500" aria-hidden="true" />
            <span className="text-sm text-muted-foreground font-medium">Never miss a moment of inspiration</span>
            <Sparkles className="w-5 h-5 text-orange-500" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import AuthGuard from "@/components/AuthGuard"

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsPageContent />
    </AuthGuard>
  )
}

function NotificationsPageContent() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "important" | "social" | "system">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set())
  const [showMilestones, setShowMilestones] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }
  const { playSound } = useSoundEffects()

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      switch (filter) {
        case "important":
          return notification.isImportant
        case "social":
          return ["reaction", "follow", "reflection", "bookmark", "share"].includes(notification.type)
        case "system":
          return ["milestone", "system", "experimental"].includes(notification.type)
        default:
          return true
      }
    })
  }, [notifications, filter])

  const groupedNotifications = useMemo(() => groupNotificationsByTime(filteredNotifications), [filteredNotifications])
  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const toggleCluster = (id: string) => {
    setExpandedClusters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // --- Redesigned Notification Card ---
  const NotificationCard = ({ notification }: { notification: any }) => {
    const Icon = getNotificationIcon(notification.type)
    const isExpanded = expandedClusters.has(notification.id)
    const isUnread = !notification.isRead
    const sentimentGradient = notification.clustered
      ? getSentimentGradient(notification.sentiment)
      : "from-purple-400/20 to-indigo-400/20"
    const ts = new Date(notification.timestamp as any)
    const timeString = getRelativeTime(ts)

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        layout
        className="relative"
      >
        <Card
          className={`overflow-visible flex items-stretch rounded-xl shadow border border-border bg-card transition-all duration-200 hover:shadow-lg group ${isUnread ? "ring-2 ring-purple-100" : ""}`}
        >
          {/* Timeline dot */}
          <div className="absolute -left-6 top-6 flex flex-col items-center">
            <Circle
              className={`w-3 h-3 ${isUnread ? "text-purple-500" : "text-muted-foreground/30"}`}
              fill={isUnread ? "#a78bfa" : "var(--muted-foreground)"}
            />
            <div className="w-px h-full bg-border" />
          </div>
          {/* Icon */}
          <div
            className={`flex items-center justify-center min-w-[48px] h-full p-3 ${notification.clustered ? `bg-gradient-to-br ${sentimentGradient}` : "bg-muted"} rounded-l-xl`}
          >
            <Icon className="w-6 h-6 text-purple-600" />
          </div>
          {/* Content */}
          <div className="flex-1 flex flex-col justify-between p-3 pl-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground text-sm leading-tight">{notification.title}</h3>
                {notification.xpGain && (
                  <span className="ml-1 inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    <Zap className="w-3 h-3" />+{notification.xpGain} XP
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{timeString}</span>
            </div>
            {notification.clustered ? (
              <>
                <p className="text-xs text-muted-foreground mb-2">"{notification.preview}"</p>
                {notification.aiInsight && (
                  <div className="flex items-center gap-1 mb-2">
                    <Brain className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 italic">{notification.aiInsight}</span>
                  </div>
                )}
                {/* Avatars */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex -space-x-2">
                    {notification.users.slice(0, 3).map((user: any, idx: number) => (
                      <Avatar key={idx} className="w-6 h-6 border-2 border-white shadow-sm">
                        <AvatarFallback className="text-xs bg-purple-100">{user.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {notification.users.length > 3 && (
                      <span className="ml-1 text-xs text-muted-foreground font-medium">
                        +{notification.users.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                {/* Actions & Expand */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-1">
                    {notification.actions &&
                      notification.actions.map((action: any, idx: number) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={action.type === "primary" ? "default" : "outline"}
                          className="h-6 px-3 text-xs rounded-full shadow-none bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            action.action()
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 rounded-full hover:bg-purple-50"
                        onClick={() => markAsRead(notification.id)}
                        aria-label="Mark as read"
                      >
                        <Check className="w-4 h-4 text-purple-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 rounded-full hover:bg-black/5"
                      onClick={() => toggleCluster(notification.id)}
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {/* Expandable details */}
                <AnimatePresence>
                  {isExpanded && notification.ink && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2"
                    >
                      <div
                        className={`bg-gradient-to-r ${sentimentGradient} rounded-md p-2 border border-border flex items-start gap-2`}
                      >
                        <Quote className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground italic line-clamp-2">
                          "{notification.ink.content}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                {notification.aiInsight && (
                  <div className="flex items-center gap-1 mb-2">
                    <Brain className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600 italic">{notification.aiInsight}</span>
                  </div>
                )}
                {notification.milestone && (
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      {notification.milestone.type === "streak" && <Flame className="w-3 h-3" />}
                      {notification.milestone.type === "badge" && <Trophy className="w-3 h-3" />}
                      <span>{notification.milestone.value}</span>
                    </div>
                    {notification.milestone.badge && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {notification.milestone.badge}
                      </Badge>
                    )}
                  </div>
                )}
                {/* Actions */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex gap-1">
                    {notification.actions &&
                      notification.actions.map((action: any, idx: number) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant={action.type === "primary" ? "default" : "outline"}
                          className="h-6 px-3 text-xs rounded-full shadow-none bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            action.action()
                          }}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </div>
                  {isUnread && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 rounded-full hover:bg-purple-50"
                      onClick={() => markAsRead(notification.id)}
                      aria-label="Mark as read"
                    >
                      <Check className="w-4 h-4 text-purple-500" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    )
  }

  // --- Redesigned Notification Group as Timeline ---
  const NotificationGroup = ({
    title,
    notifications,
    icon: Icon,
  }: {
    title: string
    notifications: any[]
    icon: any
  }) => {
    if (notifications.length === 0) return null
    return (
      <section className="mb-10 relative">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
            {notifications.length}
          </Badge>
        </div>
        <div className="space-y-6 ml-6 border-l-2 border-border pl-2">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </AnimatePresence>
        </div>
      </section>
    )
  }

  const weeklyStats = {
    newFollowers: 12,
    totalReactions: 45,
    reflections: 8,
    xpGained: 320,
  }

  // Show full page loader while data is loading
  if (isLoading) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />
  }

  // --- Redesigned Layout ---
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Hero Section */}
          <NotificationsHeroSection />

          {/* Notifications Content */}
          <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 relative">
            {/* Network Warning */}
            <NetworkWarning variant="banner" />
            
            {/* Filters */}
            <div className="mb-4 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7 px-3 rounded-full border-border shadow-none bg-transparent"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Read all
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs h-7 px-3 rounded-full border-border shadow-none"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 overflow-hidden"
                >
                  <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted rounded-lg p-1">
                      <TabsTrigger value="all" className="text-xs">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="important" className="text-xs">
                        Important
                      </TabsTrigger>
                      <TabsTrigger value="social" className="text-xs">
                        Social
                      </TabsTrigger>
                      <TabsTrigger value="system" className="text-xs">
                        System
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Weekly Stats */}
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    This Week
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    +{weeklyStats.xpGained} XP
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{weeklyStats.newFollowers}</div>
                    <div className="text-xs text-muted-foreground">New followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{weeklyStats.totalReactions}</div>
                    <div className="text-xs text-muted-foreground">Reactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{weeklyStats.reflections}</div>
                    <div className="text-xs text-muted-foreground">Reflections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{weeklyStats.xpGained}</div>
                    <div className="text-xs text-muted-foreground">XP gained</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Timeline */}
            <div className="space-y-8">
              <NotificationGroup title="Today" notifications={groupedNotifications.today} icon={Bell} />
              <NotificationGroup title="This Week" notifications={groupedNotifications.thisWeek} icon={Users} />
              <NotificationGroup title="Last Month" notifications={groupedNotifications.lastMonth} icon={Star} />

              {/* Milestones Section */}
              <Collapsible open={showMilestones} onOpenChange={setShowMilestones}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-0 h-auto text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight hover:bg-transparent"
                  >
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    Milestones & Achievements
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                      {groupedNotifications.milestones.length}
                    </Badge>
                    {showMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 ml-6 border-l-2 border-border pl-2 mt-4">
                  <AnimatePresence mode="popLayout">
                    {groupedNotifications.milestones.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>

              <NotificationGroup title="Older" notifications={groupedNotifications.older} icon={Circle} />
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            )}
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
