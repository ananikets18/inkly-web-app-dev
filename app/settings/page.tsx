"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Settings, Sparkles, AlertCircle, RefreshCw } from "lucide-react"
import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import SideNav from "@/components/SideNav"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Shield,
  Bell,
  Trophy,
  Sliders,
  Lock,
  AlertTriangle,
  Download,
  CheckCircle,
  ExternalLink,
  Pencil,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Sun,
  Moon,
  Eye,
  EyeOff,
  RefreshCcw,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { NetworkWarning } from "@/components/NetworkWarning"
import { useNetworkStatus } from "@/hooks/use-network-status"
// Authentication removed - using mock authentication

// AuthStatus Component
function AuthStatus() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs font-medium text-green-700 dark:text-green-300">Authenticated</span>
      </div>
      <span className="text-xs text-muted-foreground">Mock authentication active</span>
    </div>
  )
}

// Lazy load heavy components for better mobile performance
const NotificationSettings = dynamic(() => import("@/components/NotificationSettings"), {
  loading: () => <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[500px] animate-pulse" />
})

const NotificationService = dynamic(() => import("@/components/NotificationService"), {
  ssr: false
})

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-20 bg-muted animate-pulse" />
})

// Error Boundary Component
const ErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center" role="alert" aria-live="polite">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
    <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
    <p className="text-muted-foreground mb-4 max-w-md">
      We encountered an error while loading your settings. Please try again.
    </p>
    <div className="flex gap-2">
      <Button onClick={retry} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  </div>
)

// Full Page Loader Component for Settings
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
            <Settings className="w-10 h-10 text-white" />
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Loading Settings
          </motion.h2>

          {/* Loading Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
          >
            Preparing your personalized settings and preferences...
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

// Error State Component for Settings
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-background dark:to-red-950">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
        >
          <Settings className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Settings Unavailable
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

// Retry Hook
const useRetry = (callback: () => Promise<void>, maxRetries = 3) => {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) return
    
    setIsRetrying(true)
    try {
      await callback()
      setRetryCount(0)
    } catch (error) {
      setRetryCount(prev => prev + 1)
    } finally {
      setIsRetrying(false)
    }
  }, [callback, retryCount, maxRetries])

  return { retry, retryCount, isRetrying, canRetry: retryCount < maxRetries }
}

const navSections = [
  {
    icon: Shield,
    label: "Account & Privacy",
    desc: "Security & privacy",
    active: true,
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Push alerts",
  },
  {
    icon: Trophy,
    label: "Badges & Achievements",
    desc: "Your accomplishments",
  },
  {
    icon: Sliders,
    label: "Content Preferences",
    desc: "Feed & recommendations",
  },
  {
    icon: Lock,
    label: "Security",
    desc: "Password & 2FA",
  },
  {
    icon: AlertTriangle,
    label: "Danger Zone",
    desc: "Delete account",
    danger: true,
  },
]

const sessionIcon = (device: string) => {
  if (device.toLowerCase().includes("iphone")) return <Smartphone className="w-5 h-5" />
  if (device.toLowerCase().includes("ipad")) return <Tablet className="w-5 h-5" />
  return <Monitor className="w-5 h-5" />
}

// Hero Section Component - Optimized for mobile performance
function SettingsHeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Lazy load animations for mobile
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden w-full" aria-labelledby="hero-heading">
      {/* Background gradient - simplified for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950/20 dark:via-background dark:to-orange-950/20" />

      {/* Floating particles - reduced for mobile performance */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Only show 1 particle on mobile, 3 on desktop */}
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60 hidden sm:block"
            animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-32 right-16 w-1 h-1 bg-orange-400 rounded-full opacity-40 hidden sm:block"
            animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-50"
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
          />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
        >
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 mb-6 leading-tight"
          >
            Settings & Preferences
          </h1>
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            Customize your Inkly experience to match your creative style
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
          >
            <Settings className="w-5 h-5 text-purple-500" aria-hidden="true" />
            <span className="text-sm text-muted-foreground font-medium">Personalize your creative journey</span>
            <Sparkles className="w-5 h-5 text-orange-500" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import AuthGuard from "@/components/AuthGuard"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  )
}

function SettingsPageContent() {
  // All hooks go here!
  const { toast } = useToast()
  
  // Performance optimization: Memoize expensive operations
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setIsClient(true)
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Error handling and retry logic
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Error in ${context}:`, error)
    setError(error)
    toast({
      title: "Something went wrong",
      description: `Failed to ${context}. Please try again.`,
      variant: "destructive",
    })
  }, [toast])

  const retryOperation = useCallback(() => {
    setError(null)
    setIsLoading(true)
    // Simulate retry
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

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
  const updateUser = async (userData: any) => {
    // Mock update function
    console.log("Mock update user:", userData)
    return { success: true }
  }
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [email, setEmail] = useState(user?.email || "")
  const [emailDraft, setEmailDraft] = useState(email)
  
  // Update email when user data changes
  useEffect(() => {
    if (user?.email && user.email !== email) {
      setEmail(user.email)
      setEmailDraft(user.email)
    }
  }, [user?.email, email])
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmailDraft(e.target.value)
  const handleEmailEdit = () => {
    setEmailDraft(email)
    setIsEditingEmail(true)
  }
  const handleEmailSave = async () => {
    try {
      setIsLoading(true)
      
      // Update user profile with new email
      const result = await updateUser({ email: emailDraft })
      
      if (result.success) {
        setEmail(emailDraft)
        setIsEditingEmail(false)
        toast({
          title: "Email updated",
          description: "Your email address has been successfully updated.",
        })
      } else {
        toast({
          title: "Update failed",
          description: result.error || "Failed to update email address.",
          variant: "destructive",
        })
      }
    } catch (error) {
      handleError(error as Error, "update email")
    } finally {
      setIsLoading(false)
    }
  }
  const handleEmailCancel = () => {
    setEmailDraft(email)
    setIsEditingEmail(false)
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditingEmail) {
        handleEmailCancel()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isEditingEmail, handleEmailCancel])

  // Add focus management for accessibility
  useEffect(() => {
    if (isEditingEmail && emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [isEditingEmail])

  // Add notification toggles at the top level
  const [notifPushFollower, setNotifPushFollower] = useState(false)
  const [notifPushReaction, setNotifPushReaction] = useState(false)
  const [notifEmailDigest, setNotifEmailDigest] = useState(false)
  const [notifEmailNewsletter, setNotifEmailNewsletter] = useState(false)
  const [notifEmailSecurity, setNotifEmailSecurity] = useState(false)

  // Add badges/achievements toggles at the top level
  const [showBadgesOnProfile, setShowBadgesOnProfile] = useState(false)
  const [achievementNotifications, setAchievementNotifications] = useState(false)

  // Add content preferences state at the top level
  const [userTopics, setUserTopics] = useState([
    "Philosophy",
    "✨ Inspiration",
    "💔 Heartbreak",
    "🌞 Motivation",
    "📚 Life Lessons",
    "🧠 Deep Thoughts",
    "🎨 Creativity",
  ])
  const [showNewTopics, setShowNewTopics] = useState(false)
  const [topicRecommendations, setTopicRecommendations] = useState(false)

  const handleRemoveTopic = (topic: string) => setUserTopics(userTopics.filter((t) => t !== topic))

  // Add security state at the top level
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "New York, US", current: true, lastActive: "Just now" },
    { id: 2, device: "Safari on iPhone", location: "New York, US", current: false, lastActive: "2 hours ago" },
    { id: 3, device: "Chrome on iPad", location: "Los Angeles, US", current: false, lastActive: "1 day ago" },
  ])
  const [loginNotifications, setLoginNotifications] = useState(false)
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(false)

  // Theme preference state
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Responsive tab state for mobile
  const [activeTab, setActiveTab] = useState(0)

  // 1. Add state for dialogs at the top of SettingsPage
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [pendingRemoveTopic, setPendingRemoveTopic] = useState<string | null>(null)
  const [pendingSignOutSession, setPendingSignOutSession] = useState<number | null>(null)
  const [showSignOutAllDialog, setShowSignOutAllDialog] = useState(false)

  // 2. Add showPassword state at the top of SettingsPage:
  const [showPassword, setShowPassword] = useState(false)

  // Add push notification toggle state
  const [pushNotifications, setPushNotifications] = useState(false)

  // Handler for push notification toggle
  const handlePushNotificationToggle = async (checked: boolean) => {
    try {
      setIsLoading(true)
      setPushNotifications(checked)
      if (checked) {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            toast({
              title: "Notifications enabled!",
              description: "You'll now receive important updates from Inkly in your browser.",
            })
          } else if (Notification.permission === "denied") {
            toast({
              title: "Notifications blocked",
              description:
                "You won't receive browser notifications. You can enable them anytime in your browser settings.",
            })
            setPushNotifications(false)
          } else {
            try {
              const permission = await Notification.requestPermission()
              if (permission === "granted") {
                toast({
                  title: "Notifications enabled!",
                  description: "You'll now receive important updates from Inkly in your browser.",
                })
              } else {
                toast({
                  title: "Notifications blocked",
                  description:
                    "You won't receive browser notifications. You can enable them anytime in your browser settings.",
                })
                setPushNotifications(false)
              }
            } catch (e) {
              handleError(e as Error, "request notification permission")
              setPushNotifications(false)
            }
          }
        } else {
          toast({
            title: "Not supported",
            description: "Your browser does not support push notifications.",
          })
          setPushNotifications(false)
        }
      } else {
        setNotifPushFollower(false)
        setNotifPushReaction(false)
        toast({
          title: "Push notifications disabled",
          description: "You will no longer receive browser notifications from Inkly.",
        })
      }
    } catch (error) {
      handleError(error as Error, "update notification settings")
    } finally {
      setIsLoading(false)
    }
  }

  // State for email notification dialog
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailDialogMessage, setEmailDialogMessage] = useState("")
  // State for missing email warning dialog
  const [emailWarningDialogOpen, setEmailWarningDialogOpen] = useState(false)

  // Handler for email notification toggles
  const handleEmailToggle = (type: string, checked: boolean, setFn: (v: boolean) => void) => {
    if (!email) {
      setEmailWarningDialogOpen(true)
      return
    }
    setFn(checked)
    setEmailDialogMessage(checked ? `You've enabled ${type} emails.` : `You've disabled ${type} emails.`)
    setEmailDialogOpen(true)
  }

  const emailInputRef = useRef<HTMLInputElement>(null)
  const { isOnline } = useNetworkStatus()

  // State for generic setting dialog
  const [settingDialogOpen, setSettingDialogOpen] = useState(false)
  const [settingDialogMessage, setSettingDialogMessage] = useState("")

  // Generic handler for all non-email toggles
  const handleSettingToggle = async (label: string, checked: boolean, setFn: (v: boolean) => void) => {
    try {
      setIsLoading(true)
      setFn(checked)
      // Only show toast for Badges & Achievements toggles
      if (label === "Show Badges on Profile" || label === "Achievement Notifications") {
        toast({
          title: checked ? "Enabled" : "Disabled",
          description: `${label} ${checked ? "enabled" : "disabled"}.`,
        })
      } else {
        setSettingDialogMessage(checked ? `You've enabled ${label}.` : `You've disabled ${label}.`)
        setSettingDialogOpen(true)
      }
    } catch (error) {
      handleError(error as Error, `update ${label.toLowerCase()}`)
      // Revert the change on error
      setFn(!checked)
    } finally {
      setIsLoading(false)
    }
  }

  const renderPanel = useCallback(() => {
    switch (activeTab) {
      case 0: // Account & Privacy
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[500px]">
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Account & Privacy</h1>
            <p className="text-muted-foreground text-sm mb-6">Manage your account and privacy settings</p>
            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Account Information</h2>
              <div className="flex flex-col gap-4">
                {/* Authentication Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">Authentication Status</label>
                  <AuthStatus />
                </div>
                
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                      value={user?.fullName || ""}
                      readOnly
                      disabled
                      placeholder={!user?.fullName ? "Loading..." : "Your full name"}
                    />
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-lg">
                      Read-only
                    </span>
                  </div>
                </div>
                
                {/* Username */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">Username</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-mono font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                      value={user?.username ? `@${user.username}` : ""}
                      readOnly
                      disabled
                      placeholder={!user?.username ? "Loading..." : "@username"}
                    />
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-lg">
                      Read-only
                    </span>
                  </div>
                </div>
                
                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="email-input" className="text-xs font-semibold text-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="email-input"
                      type="email"
                      className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-mono font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                      value={emailDraft}
                      onChange={handleEmailChange}
                      readOnly={!isEditingEmail}
                      disabled={!isEditingEmail || isLoading}
                      ref={emailInputRef}
                      aria-describedby="email-status"
                      placeholder={!user?.email ? "Loading..." : "Enter your email"}
                    />
                    {isEditingEmail ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white px-3 py-1.5 text-xs font-medium hover:bg-purple-700 dark:hover:bg-purple-900"
                          onClick={handleEmailSave}
                          disabled={isLoading || !emailDraft || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft) || !isOnline}
                          aria-label="Save email changes"
                        >
                          {isLoading ? "Saving..." : !isOnline ? "Offline" : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-3 py-1.5 text-xs font-medium bg-transparent"
                          onClick={handleEmailCancel}
                          disabled={isLoading}
                          aria-label="Cancel email changes"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-border text-purple-700 bg-muted hover:bg-muted/80 hover:border-purple-300 px-3 py-1.5 text-xs font-medium flex items-center gap-1"
                        onClick={handleEmailEdit}
                        disabled={isLoading}
                        aria-label="Edit email address"
                      >
                        <Pencil className="w-4 h-4" aria-hidden="true" />
                        Change
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1" id="email-status">
                    {user?.email ? (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 inline" aria-hidden="true" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="w-4 h-4 inline animate-spin" aria-hidden="true" />
                        Loading...
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Account Details */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Account Created</span>
                    <span className="text-xs font-medium text-foreground">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Loading..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Last Login</span>
                    <span className="text-xs font-medium text-foreground">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Loading..."}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Account Status</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user?.status === 'active' 
                        ? 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-200' 
                        : 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-200'
                    }`}>
                      {user?.status === 'active' ? 'Active' : user?.status || 'Loading...'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
            {/* Theme Preference Toggle - moved here */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Theme Preference</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition shadow-sm focus:outline-none flex-1 sm:flex-none ${mounted && theme === "system" ? "bg-purple-50 dark:bg-purple-950 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("system")}
                  >
                    <CheckCircle className={`w-4 h-4 ${mounted && theme === "system" ? "text-purple-600" : "invisible"}`} />
                    <span className="hidden sm:inline">Auto (Sync with System)</span>
                    <span className="sm:hidden">Auto</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition shadow-sm focus:outline-none flex-1 sm:flex-none ${mounted && theme === "light" ? "bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200 ring-2 ring-yellow-200 dark:ring-yellow-800" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Light Mode</span>
                    <span className="sm:hidden">Light</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition shadow-sm focus:outline-none flex-1 sm:flex-none ${mounted && theme === "dark" ? "bg-gray-900 border-gray-700 text-white ring-2 ring-gray-400 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100 dark:ring-gray-700" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Dark Mode</span>
                    <span className="sm:hidden">Dark</span>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Choose how Inkly appears to you</p>
              </div>
            </div>
            {/* Privacy Settings */}
            {/* <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Privacy Settings</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Profile Visibility</label>
                    <p className="text-xs text-muted-foreground">Control who can see your profile</p>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-full sm:w-[140px] border-purple-200 text-purple-700 focus:ring-2 focus:ring-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Search Engine Indexing</label>
                    <p className="text-xs text-muted-foreground">Allow search engines to index your profile</p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Analytics & Insights</label>
                    <p className="text-xs text-muted-foreground">Help us improve by sharing usage data</p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
              </div>
            </div> */}
            {/* Data Management */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Data Management</h2>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-3 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 text-sm font-semibold text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition"
                    >
                      <Download className="w-5 h-5" />
                      Download Your Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Download Your Data</DialogTitle>
                      <DialogDescription>
                        You can download a copy of all your Inkly data, including your profile, posts, and settings.
                        This may take a few moments to prepare.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Download
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center gap-3 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 text-sm font-semibold text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition"
                >
                  <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    View Privacy Policy
                  </Link>
                </Button>
              </div>
            </div>
            {/* Footer - just last updated info */}
            <div className="flex items-center justify-end mt-auto pt-6 border-t border-border">
              <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
            </div>
          </div>
        )
      case 1: // Notifications
        return <NotificationSettings />
      case 2: // Badges & Achievements
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[300px]">
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Badges & Achievements</h1>
            <p className="text-muted-foreground text-sm mb-6">Display and notification settings for your badges</p>
            {/* Display Settings */}
            <div className="mb-8">
              <div className="flex flex-col gap-8 divide-y divide-border mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Show Badges on Profile</span>
                    <p className="text-xs text-muted-foreground">Display your earned badges on your public profile</p>
                  </div>
                  <Switch
                    checked={showBadgesOnProfile}
                    onCheckedChange={(v) => handleSettingToggle("Show Badges on Profile", v, setShowBadgesOnProfile)}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Achievement Notifications</span>
                    <p className="text-xs text-muted-foreground">Get notified when you earn new badges</p>
                  </div>
                  <Switch
                    checked={achievementNotifications}
                    onCheckedChange={(v) =>
                      handleSettingToggle("Achievement Notifications", v, setAchievementNotifications)
                    }
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
              </div>
            </div>
            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto pt-6 border-t border-border gap-4 mt-10">
              <div className="flex items-center gap-3">
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="px-4 py-1.5 rounded-lg border-border text-foreground bg-card font-medium text-xs hover:bg-muted transition"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowResetDialog(true)
                      }}
                    >
                      Reset to defaults
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset to Defaults?</DialogTitle>
                      <DialogDescription>
                        This will revert all settings in this section to their original values. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setShowResetDialog(false) /* handle actual reset */
                        }}
                      >
                        Confirm Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <span className="text-muted-foreground text-lg select-none hidden sm:inline">|</span>
                <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
              </div>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="px-6 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-800 dark:text-white dark:border-purple-500 font-semibold text-sm shadow-sm hover:bg-purple-100 hover:border-purple-300 transition focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowSaveDialog(true)
                    }}
                  >
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Changes?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to save your changes? This will update your settings immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white hover:bg-purple-700 dark:hover:bg-purple-900 font-semibold px-4 py-2 rounded-lg transition"
                      variant="default"
                      onClick={() => {
                        setShowSaveDialog(false) /* handle actual save */
                      }}
                    >
                      Confirm Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      case 3: // Content Preferences
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[400px]">
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Content Preferences</h1>
            <p className="text-muted-foreground text-sm mb-6">Personalize your feed and recommendations</p>
            {/* Your Topics */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground">Your Topics</h2>
                <span className="text-xs text-muted-foreground">{userTopics.length} of 7 selected</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userTopics.map((topic) => (
                  <span
                    key={topic}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-200 text-xs font-medium border border-purple-200 dark:border-purple-800`}
                  >
                    {topic}
                    <button
                      type="button"
                      className="ml-1 text-purple-400 hover:text-purple-700 dark:hover:text-purple-200"
                      onClick={() => setPendingRemoveTopic(topic)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Discovery Settings */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Discovery Settings</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Show Content from New Topics</span>
                    <p className="text-xs text-muted-foreground">
                      Occasionally show content from topics you haven't selected
                    </p>
                  </div>
                  <Switch
                    checked={showNewTopics}
                    onCheckedChange={(v) => handleSettingToggle("Show Content from New Topics", v, setShowNewTopics)}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Topic-based Recommendations</span>
                    <p className="text-xs text-muted-foreground">
                      Use your selected topics to recommend similar content
                    </p>
                  </div>
                  <Switch
                    checked={topicRecommendations}
                    onCheckedChange={(v) =>
                      handleSettingToggle("Topic-based Recommendations", v, setTopicRecommendations)
                    }
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
              </div>
            </div>
            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto pt-6 border-t border-border gap-4 mt-10">
              <div className="flex items-center gap-3">
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="px-4 py-1.5 rounded-lg border-border text-foreground bg-card font-medium text-xs hover:bg-muted transition"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowResetDialog(true)
                      }}
                    >
                      Reset to defaults
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset to Defaults?</DialogTitle>
                      <DialogDescription>
                        This will revert all settings in this section to their original values. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setShowResetDialog(false) /* handle actual reset */
                        }}
                      >
                        Confirm Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <span className="text-muted-foreground text-lg select-none hidden sm:inline">|</span>
                <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
              </div>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="px-6 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-800 dark:text-white dark:border-purple-500 font-semibold text-sm shadow-sm hover:bg-purple-100 hover:border-purple-300 transition focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowSaveDialog(true)
                    }}
                  >
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Changes?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to save your changes? This will update your settings immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white hover:bg-purple-700 dark:hover:bg-purple-900 font-semibold px-4 py-2 rounded-lg transition"
                      variant="default"
                      onClick={() => {
                        setShowSaveDialog(false) /* handle actual save */
                      }}
                    >
                      Confirm Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      case 4: // Security
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[400px]">
            {/* Password Section */}
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Security</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Manage your password, sessions, and security preferences
            </p>
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Password</h2>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 pr-10"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 pr-10"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 pr-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <Button
                  type="button"
                  className="w-fit bg-black dark:bg-purple-800 text-white dark:text-white font-semibold rounded-md hover:bg-purple-600 dark:hover:bg-purple-900 mt-2"
                >
                  Update Password
                </Button>
              </div>
            </div>
            {/* Active Sessions Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground">Active Sessions</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple-700 px-2 py-1">
                  <RefreshCcw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3 ${session.current ? "ring-2 ring-purple-200" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted text-muted-foreground">
                        {sessionIcon(session.device)}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{session.device}</div>
                        <div className="text-xs text-muted-foreground">
                          {session.location}
                          {session.current && " • Current session"}
                        </div>
                        <div className="text-xs text-muted-foreground">Last active: {session.lastActive}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current ? (
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-200 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded px-2 py-0.5">
                          Current
                        </span>
                      ) : (
                        <Dialog
                          open={!!pendingSignOutSession && pendingSignOutSession === session.id}
                          onOpenChange={(v) => !v && setPendingSignOutSession(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-red-600"
                              onClick={() => setPendingSignOutSession(session.id)}
                            >
                              Sign Out
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sign Out Session?</DialogTitle>
                              <DialogDescription>Are you sure you want to sign out this device?</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setPendingSignOutSession(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  /* handle sign out */ setPendingSignOutSession(null)
                                }}
                              >
                                Sign Out
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Dialog open={showSignOutAllDialog} onOpenChange={setShowSignOutAllDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-3 text-xs font-semibold flex items-center gap-2 border-border text-muted-foreground hover:text-purple-700 hover:border-purple-300 bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out all other sessions
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign Out All Other Sessions?</DialogTitle>
                    <DialogDescription>
                      This will sign you out of all devices except this one. Continue?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSignOutAllDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        /* handle sign out all */ setShowSignOutAllDialog(false)
                      }}
                    >
                      Sign Out All
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {/* Security Preferences */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Security Preferences</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Login Notifications</span>
                    <p className="text-xs text-muted-foreground">Get notified when someone signs into your account</p>
                  </div>
                  <Switch
                    checked={loginNotifications}
                    onCheckedChange={(v) => handleSettingToggle("Login Notifications", v, setLoginNotifications)}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Suspicious Activity Alerts</span>
                    <p className="text-xs text-muted-foreground">Get alerts for unusual account activity</p>
                  </div>
                  <Switch
                    checked={suspiciousAlerts}
                    onCheckedChange={(v) => handleSettingToggle("Suspicious Activity Alerts", v, setSuspiciousAlerts)}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-200 border-purple-200"
                  />
                </div>
              </div>
            </div>
            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto pt-6 border-t border-border gap-4 mt-10">
              <div className="flex items-center gap-3">
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="px-4 py-1.5 rounded-lg border-border text-foreground bg-card font-medium text-xs hover:bg-muted transition"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowResetDialog(true)
                      }}
                    >
                      Reset to defaults
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset to Defaults?</DialogTitle>
                      <DialogDescription>
                        This will revert all settings in this section to their original values. Are you sure?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setShowResetDialog(false) /* handle actual reset */
                        }}
                      >
                        Confirm Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <span className="text-muted-foreground text-lg select-none hidden sm:inline">|</span>
                <span className="text-xs text-muted-foreground">Last updated: 2 days ago</span>
              </div>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="px-6 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-800 dark:text-white dark:border-purple-500 font-semibold text-sm shadow-sm hover:bg-purple-100 hover:border-purple-300 transition focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowSaveDialog(true)
                    }}
                  >
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Changes?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to save your changes? This will update your settings immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white hover:bg-purple-700 dark:hover:bg-purple-900 font-semibold px-4 py-2 rounded-lg transition"
                      variant="default"
                      onClick={() => {
                        setShowSaveDialog(false) /* handle actual save */
                      }}
                    >
                      Confirm Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      case 5: // Danger Zone
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-5 md:p-8 flex flex-col gap-6">
            <div className="mb-3">
              <h1 className="text-2xl font-extrabold text-red-600 mb-1 tracking-tight">Danger Zone</h1>
              <p className="text-muted-foreground text-sm">Sensitive actions for your account</p>
            </div>
            {/* Deactivate Account Card */}
            <div className="border border-border rounded-2xl bg-card p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-lg text-foreground">Deactivate Account</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Temporarily disable your account. Your profile and content will be hidden but can be restored later.
              </p>
              <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
                <li>Your profile will be hidden from other users</li>
                <li>Your Inks will not appear in feeds</li>
                <li>You can reactivate anytime by logging in</li>
                <li>Your data will be preserved</li>
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="self-end mt-2 px-5 py-1.5 text-sm font-semibold border-border text-foreground bg-transparent"
                  >
                    Deactivate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deactivate Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deactivate your account? You can reactivate at any time by logging in.
                      Your data will be preserved.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" className="border-border bg-transparent" type="button">
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-purple-800 dark:text-white dark:border-purple-500"
                      type="button"
                    >
                      Confirm Deactivate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {/* Delete Account Card */}
            <div className="border border-border rounded-2xl bg-card p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-lg text-red-700">Delete Account Permanently</span>
              </div>
              <span className="text-xs font-bold text-red-600 mb-1">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </span>
              <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
                <li>All your Inks will be permanently deleted</li>
                <li>Your profile and comments will be removed</li>
                <li>You will lose all followers and connections</li>
                <li>This action cannot be reversed</li>
              </ul>
              <div className="bg-muted border border-border rounded-lg px-3 py-2 mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                Your username will become available for others to use after 30 days.
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="self-end mt-2 px-5 py-1.5 text-sm font-semibold border-red-500 text-red-700 hover:bg-red-600 hover:border-red-400 bg-transparent"
                  >
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-700">Delete Account Permanently</DialogTitle>
                    <DialogDescription>
                      This action is irreversible. All your data will be deleted. Are you absolutely sure you want to
                      proceed?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" className="border-border bg-transparent" type="button">
                      Cancel
                    </Button>
                    <Button variant="destructive" className="bg-red-600 text-white hover:bg-red-700" type="button">
                      Yes, Delete My Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )
      default:
        return null
    }
  }, [activeTab, email, emailDraft, isEditingEmail, userTopics, showBadgesOnProfile, achievementNotifications, showNewTopics, topicRecommendations, currentPassword, newPassword, confirmPassword, sessions, loginNotifications, suspiciousAlerts, theme, showPassword, pushNotifications, notifPushFollower, notifPushReaction, notifEmailDigest, notifEmailNewsletter, notifEmailSecurity, showSaveDialog, showResetDialog, pendingRemoveTopic, pendingSignOutSession, showSignOutAllDialog, emailDialogOpen, emailDialogMessage, emailWarningDialogOpen, settingDialogOpen, settingDialogMessage, toast, mounted])



  // Show full page loader while data is loading
  if (isLoading) {
    return <FullPageLoader />
  }

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error.message} onRetry={retryOperation} />
  }

  return (
    <div className="min-h-screen bg-background text-[17px] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Hero Section */}
          <SettingsHeroSection />

          {/* Settings Content */}
          <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
            {/* Network Warning */}
            <NetworkWarning variant="banner" />

                        {/* Horizontally scrollable nav for mobile - icons only, no text */}
            <div className="md:hidden mb-6">
              <nav className="flex gap-2 justify-between py-2 px-1 bg-card rounded-2xl border border-border shadow-sm" role="tablist" aria-label="Settings navigation">
                {navSections.map((item, i) => (
                  <button
                    key={item.label}
                    className={`flex items-center justify-center flex-1 min-w-[44px] h-10 rounded-xl transition border font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2
                      ${
                        i === activeTab
                          ? item.danger
                            ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 shadow-md"
                            : "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-200 shadow-md"
                          : item.danger
                            ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                            : "hover:bg-muted dark:hover:bg-muted/40 text-muted-foreground dark:text-muted-foreground"
                      }
                    `}
                    onClick={() => setActiveTab(i)}
                    aria-current={i === activeTab ? "page" : undefined}
                    role="tab"
                    aria-selected={i === activeTab}
                    aria-controls={`panel-${i}`}
                    id={`mobile-tab-${i}`}
                    disabled={isLoading}
                    aria-label={item.label}
                  >
                    <span
                      className={`rounded-lg p-1 ${
                        i === activeTab
                          ? item.danger
                            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                            : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
                          : "bg-muted dark:bg-muted/40 text-muted-foreground group-hover:bg-purple-50 dark:group-hover:bg-purple-950 group-hover:text-purple-500 dark:group-hover:text-purple-200"
                      }`}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            {/* Main settings content row */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Settings navigation card for desktop */}
              <aside className="hidden md:block w-full md:w-80 flex-shrink-0 mb-4 md:mb-0">
                <div className="bg-card rounded-3xl border border-border shadow-sm p-4 md:p-8 flex flex-col gap-3">
                  <h2 className="text-base md:text-lg font-bold mb-4 text-foreground tracking-tight">Settings</h2>
                  <nav className="flex flex-col gap-1.5" role="tablist" aria-label="Settings navigation">
                    {navSections.map((item, i) => (
                      <button
                        key={item.label}
                        className={`group flex items-center gap-4 px-3 md:px-4 py-2 md:py-2.5 rounded-2xl text-left transition border font-medium text-xs md:text-sm shadow-sm
                          ${
                            i === activeTab
                              ? item.danger
                                ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 shadow-md"
                                : "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-200 shadow-md"
                              : item.danger
                                ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                : "hover:bg-muted dark:hover:bg-muted/40 text-muted-foreground dark:text-muted-foreground"
                          }
                          ${item.danger && i !== activeTab ? "" : ""}`}
                        onClick={() => setActiveTab(i)}
                        aria-current={i === activeTab ? "page" : undefined}
                        role="tab"
                        aria-selected={i === activeTab}
                        aria-controls={`panel-${i}`}
                        id={`tab-${i}`}
                        disabled={isLoading}
                      >
                        <span
                          className={`rounded-lg p-2 ${
                            i === activeTab
                              ? item.danger
                                ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                                : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
                              : "bg-muted dark:bg-muted/40 text-muted-foreground group-hover:bg-purple-50 dark:group-hover:bg-purple-950 group-hover:text-purple-500 dark:group-hover:text-purple-200"
                          }`}
                        >
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                        </span>
                        <div className="flex flex-col items-start">
                          <span className="font-semibold leading-tight text-xs md:text-sm text-foreground">
                            {item.label}
                          </span>
                          <span className="text-[10px] md:text-xs text-muted-foreground">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
              {/* Main settings panel */}
              <main className="flex-1 w-full min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="h-full w-full overflow-x-hidden"
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                  >
                    {renderPanel()}
                  </motion.div>
                </AnimatePresence>
                <NotificationService />
              </main>
            </div>
          </div>
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav />
      </div>
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Notification</DialogTitle>
            <DialogDescription>{emailDialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setEmailDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={emailWarningDialogOpen} onOpenChange={setEmailWarningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Required</DialogTitle>
            <DialogDescription>Please add your email address to enable email notifications.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setEmailWarningDialogOpen(false)
                setTimeout(() => {
                  if (emailInputRef.current) {
                    emailInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                    emailInputRef.current.focus()
                  }
                }, 200)
              }}
            >
              Go to Email Field
            </Button>
            <Button variant="secondary" onClick={() => setEmailWarningDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={settingDialogOpen} onOpenChange={setSettingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setting Changed</DialogTitle>
            <DialogDescription>{settingDialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSettingDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  )
}
