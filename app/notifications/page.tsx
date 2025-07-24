"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Sparkles } from "lucide-react"
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

type NotificationType =
  | "reaction"
  | "follow"
  | "reflection"
  | "bookmark"
  | "share"
  | "milestone"
  | "system"
  | "experimental"

interface BaseNotification {
  id: string
  type: NotificationType
  timestamp: string
  isRead: boolean
  isImportant: boolean
}

interface ClusteredNotification extends BaseNotification {
  clustered: true
  title: string
  count: number
  preview: string
  users: Array<{
    name: string
    avatar: string
    username: string
  }>
  ink?: {
    id: string
    content: string
    author: string
  }
  actions?: Array<{
    label: string
    type: "primary" | "secondary"
    action: () => void
  }>
  sentiment?: "positive" | "thoughtful" | "viral"
  xpGain?: number
  aiInsight?: string
}

interface SingleNotification extends BaseNotification {
  clustered: false
  title: string
  message: string
  user?: {
    name: string
    avatar: string
    username: string
  }
  ink?: {
    id: string
    content: string
    author: string
  }
  milestone?: {
    type: "xp" | "badge" | "streak"
    value: number
    badge?: string
  }
  actions?: Array<{
    label: string
    type: "primary" | "secondary"
    action: () => void
  }>
  aiInsight?: string
  xpGain?: number
}

type Notification = ClusteredNotification | SingleNotification

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "reaction",
    clustered: true,
    title: "❤️ 18 people reacted to your Ink",
    count: 18,
    preview: "Stay Soft",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    isImportant: true,
    sentiment: "positive",
    xpGain: 36,
    users: [
      { name: "Maya Chen", avatar: "https://i.pravatar.cc/150?img=22", username: "@maya_zen" },
      { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=45", username: "@alex_reflects" },
      { name: "Sam Wilson", avatar: "https://i.pravatar.cc/150?img=33", username: "@sam_writes" },
    ],
    ink: {
      id: "ink-123",
      content: "Stay soft in a world that wants to make you hard. Your gentleness is your strength.",
      author: "You",
    },
  },
  {
    id: "2",
    type: "follow",
    clustered: true,
    title: "👥 5 new followers",
    count: 5,
    preview: "joined your community",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
    isImportant: false,
    users: [
      { name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=32", username: "@rahul_writes" },
      { name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=28", username: "@emma_poet" },
    ],
    actions: [
      {
        label: "Thank All",
        type: "primary",
        action: () => console.log("Thank all"),
      },
    ],
  },
  {
    id: "3",
    type: "milestone",
    clustered: false,
    title: "🔥 3-day reflection streak!",
    message: "You're building a beautiful habit of daily reflection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    isImportant: true,
    milestone: {
      type: "streak",
      value: 3,
    },
    xpGain: 50,
  },
  {
    id: "4",
    type: "reflection",
    clustered: true,
    title: "💭 12 reflections on your quote",
    count: 12,
    preview: "about courage",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isRead: true,
    isImportant: false,
    sentiment: "thoughtful",
    users: [{ name: "Jordan Kim", avatar: "https://i.pravatar.cc/150?img=41", username: "@jordan_thinks" }],
    ink: {
      id: "ink-456",
      content: "Courage is not the absence of fear, but action in spite of it.",
      author: "You",
    },
    aiInsight: "Your ink sparked deep thoughts 💭",
  },
  {
    id: "5",
    type: "milestone",
    clustered: false,
    title: "🌍 Global reach milestone!",
    message: "Your quote resonated across 3 countries",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    isImportant: true,
    milestone: {
      type: "badge",
      value: 3,
      badge: "Global Voice",
    },
    aiInsight: "This quote resonated across 3 countries 🌍",
    xpGain: 100,
  },
  {
    id: "6",
    type: "experimental",
    clustered: false,
    title: "🎯 AI-curated match",
    message: "You might love this Ink too — based on your writing style",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    isRead: true,
    isImportant: false,
    ink: {
      id: "ink-789",
      content: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Ancient Proverb",
    },
    actions: [
      {
        label: "View Ink",
        type: "secondary",
        action: () => console.log("View ink"),
      },
    ],
  },
]

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

const getNotificationIcon = (type: NotificationType) => {
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

const groupNotificationsByTime = (notifications: Notification[]) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups = {
    today: [] as Notification[],
    thisWeek: [] as Notification[],
    lastMonth: [] as Notification[],
    milestones: [] as Notification[],
    older: [] as Notification[],
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "important" | "social" | "system">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set())
  const [showMilestones, setShowMilestones] = useState(true)
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
  const NotificationCard = ({ notification }: { notification: Notification }) => {
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
                    {notification.users.slice(0, 3).map((user, idx) => (
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
                      notification.actions.map((action, idx) => (
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
                      notification.actions.map((action, idx) => (
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
    notifications: Notification[]
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
            {notifications.map((notification, idx) => (
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
