"use client"

import type React from "react"

import Header from "@/components/Header"
import BottomNav from "@/components/BottomNav"
import SideNav from "@/components/SideNav"
import { useState, useRef } from "react"
import {
  User,
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
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import NotificationSettings from "@/components/NotificationSettings"
import NotificationService from "@/components/NotificationService"

const navSections = [
  {
    icon: User,
    label: "Profile Settings",
    desc: "Public profile & avatar",
    active: true,
  },
  {
    icon: Shield,
    label: "Account & Privacy",
    desc: "Security & privacy",
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

const avatars = [
  "/placeholder-user.jpg",
  "/placeholder-user.jpg",
  "/placeholder-user.jpg",
  "/placeholder-user.jpg",
  "/placeholder-user.jpg",
  "/placeholder-user.jpg",
]

const sessionIcon = (device: string) => {
  if (device.toLowerCase().includes("iphone")) return <Smartphone className="w-5 h-5" />
  if (device.toLowerCase().includes("ipad")) return <Tablet className="w-5 h-5" />
  return <Monitor className="w-5 h-5" />
}

export default function SettingsPage() {
  // All hooks go here!
  const { toast } = useToast()
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [email, setEmail] = useState("john.doe@example.com")
  const [emailDraft, setEmailDraft] = useState(email)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmailDraft(e.target.value)
  const handleEmailEdit = () => {
    setEmailDraft(email)
    setIsEditingEmail(true)
  }
  const handleEmailSave = () => {
    setEmail(emailDraft)
    setIsEditingEmail(false)
  }
  const handleEmailCancel = () => {
    setEmailDraft(email)
    setIsEditingEmail(false)
  }

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
    "🌱 Personal Growth",
  ])
  const [suggestedTopics, setSuggestedTopics] = useState([
    "Mindfulness",
    "Daily Thoughts",
    "Self Reflection",
    "Wisdom",
    "Poetry",
    "Mental Health",
  ])
  const [customTopic, setCustomTopic] = useState("")
  const [showNewTopics, setShowNewTopics] = useState(false)
  const [topicRecommendations, setTopicRecommendations] = useState(false)

  const handleRemoveTopic = (topic: string) => setUserTopics(userTopics.filter((t) => t !== topic))
  const handleAddSuggestedTopic = (topic: string) => {
    if (userTopics.length < 15 && !userTopics.includes(topic)) {
      setUserTopics([...userTopics, topic])
      setSuggestedTopics(suggestedTopics.filter((t) => t !== topic))
    }
  }
  const handleAddCustomTopic = () => {
    if (customTopic && userTopics.length < 15 && !userTopics.includes(customTopic)) {
      setUserTopics([...userTopics, customTopic])
      setCustomTopic("")
    }
  }

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
    setPushNotifications(checked)
    if (checked) {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          toast({
            title: "Notifications enabled!",
            description: "You’ll now receive important updates from Inkly in your browser.",
          })
        } else if (Notification.permission === "denied") {
          toast({
            title: "Notifications blocked",
            description:
              "You won’t receive browser notifications. You can enable them anytime in your browser settings.",
          })
          setPushNotifications(false)
        } else {
          try {
            const permission = await Notification.requestPermission()
            if (permission === "granted") {
              toast({
                title: "Notifications enabled!",
                description: "You’ll now receive important updates from Inkly in your browser.",
              })
            } else {
              toast({
                title: "Notifications blocked",
                description:
                  "You won’t receive browser notifications. You can enable them anytime in your browser settings.",
              })
              setPushNotifications(false)
            }
          } catch (e) {
            toast({
              title: "Something went wrong",
              description: "We couldn’t update your notification settings. Please try again.",
            })
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
    setEmailDialogMessage(checked ? `You’ve enabled ${type} emails.` : `You’ve disabled ${type} emails.`)
    setEmailDialogOpen(true)
  }

  const emailInputRef = useRef<HTMLInputElement>(null)

  // State for generic setting dialog
  const [settingDialogOpen, setSettingDialogOpen] = useState(false)
  const [settingDialogMessage, setSettingDialogMessage] = useState("")

  // Generic handler for all non-email toggles
  const handleSettingToggle = (label: string, checked: boolean, setFn: (v: boolean) => void) => {
    setFn(checked)
    // Only show toast for Badges & Achievements toggles
    if (label === "Show Badges on Profile" || label === "Achievement Notifications") {
      toast({
        title: checked ? "Enabled" : "Disabled",
        description: `${label} ${checked ? "enabled" : "disabled"}.`,
      })
    } else {
      setSettingDialogMessage(checked ? `You’ve enabled ${label}.` : `You’ve disabled ${label}.`)
      setSettingDialogOpen(true)
    }
  }

  // For demo, only Profile Settings is implemented
  const renderPanel = () => {
    switch (activeTab) {
      case 0: // Profile Settings
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground text-sm">Public profile & avatar</p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                PUBLIC
              </span>
            </div>
            <form className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-mono font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                    value="@alexthompson"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your unique identifier. This appears in your profile URL.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Display Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                    value="Alex Thompson"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">This is how your name appears to others.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Bio</label>
                <textarea
                  className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                  rows={3}
                  maxLength={160}
                  defaultValue="Digital artist and creative writer. Love exploring new ideas through ink and pixels."
                />
                <div className="flex justify-end text-xs text-muted-foreground mt-1">86/160</div>
                <p className="text-xs text-muted-foreground mt-1">A brief description that appears on your profile.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Profile Avatar</label>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-20 h-20 rounded-full border-4 border-purple-200 shadow-sm overflow-hidden flex items-center justify-center bg-card">
                    <Image src="/placeholder-user.jpg" alt="Current avatar" width={80} height={80} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Current</span>
                  <span className="ml-4 text-xs text-muted-foreground">Choose from our curated avatar collection</span>
                </div>
                <div className="flex gap-4 mt-2">
                  {avatars.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-16 h-16 rounded-full border-2 border-border overflow-hidden flex items-center justify-center bg-card hover:border-purple-400 hover:ring-2 hover:ring-purple-100 transition-all shadow-sm"
                    >
                      <Image src={src || "/placeholder.svg"} alt="Avatar option" width={64} height={64} />
                    </button>
                  ))}
                </div>
              </div>
            </form>
            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-10 pt-6 border-t border-border gap-4">
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
                      variant="default"
                      className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white hover:bg-purple-700 dark:hover:bg-purple-900 font-semibold px-4 py-2 rounded-lg transition"
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
      case 1: // Account & Privacy
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[500px]">
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Account & Privacy</h1>
            <p className="text-muted-foreground text-sm mb-6">Manage your account and privacy settings</p>
            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Account Information</h2>
              <div className="flex flex-col gap-4">
                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      className="w-full rounded-xl border border-border px-4 py-2 bg-muted text-foreground font-mono font-semibold text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                      value={emailDraft}
                      onChange={handleEmailChange}
                      readOnly={!isEditingEmail}
                      disabled={!isEditingEmail}
                      ref={emailInputRef}
                    />
                    {isEditingEmail ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-purple-600 dark:bg-purple-800 text-white dark:text-white px-3 py-1.5 text-xs font-medium hover:bg-purple-700 dark:hover:bg-purple-900"
                          onClick={handleEmailSave}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-3 py-1.5 text-xs font-medium bg-transparent"
                          onClick={handleEmailCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-border text-purple-700 bg-muted hover:bg-muted/80 hover:border-purple-300 px-3 py-1.5 text-xs font-medium flex items-center gap-1"
                        onClick={handleEmailEdit}
                      >
                        <Pencil className="w-4 h-4" />
                        Change
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 inline" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Theme Preference Toggle - moved here */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Theme Preference</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition shadow-sm focus:outline-none ${theme === "system" ? "bg-purple-50 dark:bg-purple-950 border-purple-400 dark:border-purple-800 text-purple-700 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("system")}
                  >
                    <CheckCircle className={`w-4 h-4 ${theme === "system" ? "text-purple-600" : "invisible"}`} />
                    Auto (Sync with System)
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition shadow-sm focus:outline-none ${theme === "light" ? "bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-200 ring-2 ring-yellow-200 dark:ring-yellow-800" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition shadow-sm focus:outline-none ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white ring-2 ring-gray-400 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100 dark:ring-gray-700" : "bg-card border-border text-foreground hover:bg-muted dark:hover:bg-muted/40"}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">Choose how Inkly appears to you</p>
              </div>
            </div>
            {/* Privacy Settings */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-4">Privacy Settings</h2>
              <div className="flex flex-col gap-6">
                {/* Profile Visibility */}
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
                {/* Search Engine Indexing */}
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
                {/* Analytics & Insights */}
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
            </div>
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
            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-auto pt-6 border-t border-border gap-4">
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
      case 2: // Notifications
        return <NotificationSettings />
      case 3: // Badges & Achievements
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
      case 4: // Content Preferences
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col min-h-[400px]">
            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">Content Preferences</h1>
            <p className="text-muted-foreground text-sm mb-6">Personalize your feed and recommendations</p>
            {/* Your Topics */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground">Your Topics</h2>
                <span className="text-xs text-muted-foreground">{userTopics.length} of 15 selected</span>
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
            {/* Recommended for You */}
            <div className="mb-6">
              <h2 className="text-base font-semibold text-foreground mb-2">Recommended for You</h2>
              <p className="text-xs text-muted-foreground mb-2">Based on your activity and trending topics</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-foreground text-xs font-medium border border-border hover:bg-purple-50 hover:text-purple-700 transition"
                    onClick={() => handleAddSuggestedTopic(topic)}
                  >
                    + {topic}
                  </button>
                ))}
              </div>
            </div>
            {/* Add Custom Topics */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-foreground mb-2">Add Custom Topics</h2>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="Search for topics..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddCustomTopic}
                  className="h-10 px-4 bg-black text-white font-semibold rounded-md hover:bg-purple-600"
                >
                  Add Topic
                </Button>
              </div>
              <div className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                You can select up to 15 topics to personalize your feed. Popular suggestions will appear as you type.
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
      case 5: // Security
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
      case 6: // Danger Zone
        return (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-8 flex flex-col gap-6">
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
                    <Button variant="default" className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-purple-800 dark:text-white dark:border-purple-500" type="button">
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
  }

  return (
    <div className="min-h-screen bg-background text-[17px] flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
          {/* Title and subtitle for settings section, just below header/navbar */}
          <div className="pt-2 pb-6 pl-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account, preferences, and privacy</p>
            {/* Horizontally scrollable nav for mobile - icons only, no text */}
            <div className="md:hidden mt-3">
              <nav className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 bg-card rounded-2xl border border-border shadow-sm">
                {navSections.map((item, i) => (
                  <button
                    key={item.label}
                    className={`flex items-center justify-center min-w-[44px] h-10 rounded-xl transition border font-medium focus:outline-none
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
                    style={{ minWidth: 44 }}
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
                      <item.icon className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {/* Main settings content row */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Settings navigation card for desktop */}
            <aside className="hidden md:block w-full md:w-80 flex-shrink-0 mb-4 md:mb-0">
              <div className="bg-card rounded-3xl border border-border shadow-sm p-4 md:p-8 flex flex-col gap-3">
                <h2 className="text-base md:text-lg font-bold mb-4 text-foreground tracking-tight">Settings</h2>
                <nav className="flex flex-col gap-1.5">
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
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
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
                >
                  {renderPanel()}
                </motion.div>
              </AnimatePresence>
              <NotificationService />
            </main>
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
    </div>
  )
}
