"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Tag,
  Globe,
  BadgeCheck,
  Save,
  X,
  Dice5,
  MoreHorizontal,
  Plus,
  Users,
  Lock,
  Eye,
  Hash,
  Trophy,
  Star,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FloatingToast from "@/components/FloatingToast"
import { getInkById, updateInk } from "@/lib/ink" // Import updateInk
import {
  containsProfanity,
  containsHateSpeech,
  containsNSFWContent,
  containsMentalHealthRisk,
  containsViolence,
  isAIGeneratedOrSpam,
  containsClickbait,
  containsForbiddenTopic,
  isEmojiSpam,
  isRepeatedCharSpam,
  isOnlyPunctuationOrWhitespace,
  containsLink,
  sanitizeInput,
  getWordCount,
} from "@/utils/textFilters"

const PLACEHOLDER_MESSAGES = [
  "What's on your mind today?",
  "Start a new story, poem, or thought...",
  "Share your inspiration with the world!",
  "Let your creativity flow here...",
  "Write something that made you smile today.",
  "Jot down a memory, a dream, or a wish...",
  "What would you say to your future self?",
  "Describe a moment you'll never forget.",
  "Express yourself—no filters, just you.",
  "Begin with a single word...",
]

const COLOR_PALETTES = [
  {
    name: "Default",
    bg: "bg-white dark:bg-gray-900",
    preview: "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-yellow-200 via-pink-200 to-pink-400 dark:from-yellow-300 dark:via-pink-300 dark:to-pink-500",
    preview: "bg-gradient-to-br from-yellow-200 via-pink-200 to-pink-400",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Ocean Depths",
    bg: "bg-gradient-to-br from-cyan-200 via-blue-200 to-blue-400 dark:from-cyan-300 dark:via-blue-300 dark:to-blue-500",
    preview: "bg-gradient-to-br from-cyan-200 via-blue-200 to-blue-400",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Midnight Sky",
    bg: "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900",
    preview: "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900",
    text: "text-white",
  },
  {
    name: "Vintage Paper",
    bg: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-200 dark:via-yellow-100 dark:to-gray-100",
    preview: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white",
    text: "text-gray-900",
  },
  {
    name: "Mint",
    bg: "bg-gradient-to-br from-green-100 via-teal-100 to-green-300 dark:from-green-200 dark:via-teal-200 dark:to-green-400",
    preview: "bg-gradient-to-br from-green-100 via-teal-100 to-green-300",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Rose",
    bg: "bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 dark:from-pink-200 dark:via-pink-300 dark:to-pink-400",
    preview: "bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Lavender",
    bg: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-200 dark:via-purple-300 dark:to-purple-400",
    preview: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Amber Bloom",
    bg: "bg-gradient-to-br from-amber-200 via-amber-300 to-orange-200 dark:from-amber-300 dark:via-amber-400 dark:to-orange-300",
    preview: "bg-gradient-to-br from-amber-200 via-amber-300 to-orange-200",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Cocoa Dust",
    bg: "bg-gradient-to-br from-stone-400 via-stone-300 to-stone-100 dark:from-stone-500 dark:via-stone-400 dark:to-stone-200",
    preview: "bg-gradient-to-br from-stone-400 via-stone-300 to-stone-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Sage Whisper",
    bg: "bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200 dark:from-green-300 dark:via-lime-200 dark:to-emerald-300",
    preview: "bg-gradient-to-br from-green-200 via-lime-100 to-emerald-200",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Coral Dream",
    bg: "bg-gradient-to-br from-pink-200 via-rose-200 to-orange-100 dark:from-pink-300 dark:via-rose-300 dark:to-orange-200",
    preview: "bg-gradient-to-br from-pink-200 via-rose-200 to-orange-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Blueberry Frost",
    bg: "bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 dark:from-blue-200 dark:via-blue-300 dark:to-indigo-300",
    preview: "bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Peach Cloud",
    bg: "bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 dark:from-orange-200 dark:via-pink-200 dark:to-yellow-200",
    preview: "bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Forest Haze",
    bg: "bg-gradient-to-br from-green-900 via-green-700 to-emerald-600",
    preview: "bg-gradient-to-br from-green-900 via-green-700 to-emerald-600",
    text: "text-white",
  },
  {
    name: "Slate Mist",
    bg: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-300 dark:via-slate-400 dark:to-slate-500",
    preview: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Berry Crush",
    bg: "bg-gradient-to-br from-fuchsia-200 via-pink-300 to-purple-300 dark:from-fuchsia-300 dark:via-pink-400 dark:to-purple-400",
    preview: "bg-gradient-to-br from-fuchsia-200 via-pink-300 to-purple-300",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Golden Hour",
    bg: "bg-gradient-to-br from-yellow-300 via-orange-200 to-amber-100 dark:from-yellow-400 dark:via-orange-300 dark:to-amber-200",
    preview: "bg-gradient-to-br from-yellow-300 via-orange-200 to-amber-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Cloud Nine",
    bg: "bg-gradient-to-br from-white via-blue-50 to-sky-100 dark:from-gray-100 dark:via-blue-100 dark:to-sky-200",
    preview: "bg-gradient-to-br from-white via-blue-50 to-sky-100",
    text: "text-gray-900",
  },
  {
    name: "Charcoal Ink",
    bg: "bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600",
    preview: "bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600",
    text: "text-white",
  },
  {
    name: "Plum Velvet",
    bg: "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-700",
    preview: "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-700",
    text: "text-white",
  },
  {
    name: "Sandstone",
    bg: "bg-gradient-to-br from-yellow-200 via-stone-200 to-stone-100 dark:from-yellow-300 dark:via-stone-300 dark:to-stone-200",
    preview: "bg-gradient-to-br from-yellow-200 via-stone-200 to-stone-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Aqua Breeze",
    bg: "bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100 dark:from-cyan-200 dark:via-teal-200 dark:to-blue-200",
    preview: "bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100",
    text: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "Ruby Blush",
    bg: "bg-gradient-to-br from-rose-300 via-pink-400 to-red-300 dark:from-rose-400 dark:via-pink-500 dark:to-red-400",
    preview: "bg-gradient-to-br from-rose-300 via-pink-400 to-red-300",
    text: "text-gray-900 dark:text-gray-100",
  },
]

const FONT_MOODS = [
  { name: "Gentle (Serif)", value: "font-serif" },
  { name: "Bold (Sans)", value: "font-sans font-bold" },
  { name: "Script (Cursive)", value: "font-cursive" },
  { name: "Typewriter", value: "font-mono" },
]

const MOOD_PILLS = [
  { name: "Bold", icon: "🔥" },
  { name: "Thoughtful", icon: "💭" },
  { name: "Healing", icon: "🌿" },
  { name: "Dreamy", icon: "🌌" },
]

const POPULAR_TAGS = [
  "poetry",
  "thoughts",
  "inspiration",
  "love",
  "life",
  "growth",
  "healing",
  "dreams",
  "memories",
  "wisdom",
  "hope",
  "journey",
  "reflection",
  "gratitude",
  "mindfulness",
]

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: Eye, description: "Everyone can see this ink" },
  { value: "followers", label: "Followers Only", icon: Users, description: "Only your followers can see this" },
  { value: "private", label: "Private", icon: Lock, description: "Only you can see this ink" },
]

const ACHIEVEMENTS = [
  { id: "first_ink", name: "First Ink", description: "Published your first ink", icon: "🖋️", unlocked: true },
  { id: "daily_writer", name: "Daily Writer", description: "Write for 7 days straight", icon: "📝", unlocked: false },
  {
    id: "heart_collector",
    name: "Heart Collector",
    description: "Get 100 hearts on a single ink",
    icon: "❤️",
    unlocked: false,
  },
  { id: "wordsmith", name: "Wordsmith", description: "Write 1000 words in a day", icon: "✍️", unlocked: true },
]

const DRAFT_NUDGES = [
  "Your thoughts are waiting to be shared with the world 💭",
  "That draft is looking lonely - give it some love! ✨",
  "Your creativity deserves to see the light 🌟",
  "Time to turn those words into magic ✍️",
  "Your story is ready to inspire others 🚀",
  "Don't let your beautiful words gather dust 📝",
  "Your draft is calling - it wants to be published! 📢",
  "Those thoughts deserve to be heard 💫",
]

const MAX_CHARACTERS = 1000
const MIN_CHARACTERS = 15 // Minimum characters for a valid ink

interface DraftData {
  id: string
  text: string
  tags: string[]
  visibility: string
  theme: number
  font: string
  mood: string
  timestamp: string
  wordCount: number
  lastModified: string
  title?: string
}

interface InkData {
  id: string
  content: string
  author: string
  createdAt: string
  tags: string[]
  visibility: string
  theme: number
  font: string
  mood: string
}

export default function EditInkPage() {
  const params = useParams()
  const inkId = params.id as string

  const [text, setText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_MESSAGES[0])
  const [showDraftSaved, setShowDraftSaved] = useState(false)
  const [showStylePanel, setShowStylePanel] = useState(false)
  const [bgTheme, setBgTheme] = useState(COLOR_PALETTES[0].bg)
  const [fontMood, setFontMood] = useState(FONT_MOODS[0].value)
  const [moodPill, setMoodPill] = useState(MOOD_PILLS[0])
  const [selectedPalette, setSelectedPalette] = useState(0)
  const textareaRef = useRef(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const { theme = "light" } = useTheme()
  const [livePreview, setLivePreview] = useState(true)
  const [pendingPalette, setPendingPalette] = useState(selectedPalette)
  const [pendingFont, setPendingFont] = useState(fontMood)
  const [pendingMood, setPendingMood] = useState(moodPill)
  const router = useRouter()
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("online")
  const [saveError, setSaveError] = useState(false)
  const [isLoadingInk, setIsLoadingInk] = useState(true)
  const [originalInk, setOriginalInk] = useState<InkData | null>(null)

  // Modal states
  const [showTagsModal, setShowTagsModal] = useState(false)
  const [showVisibilityModal, setShowVisibilityModal] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showDraftRecoveryModal, setShowDraftRecoveryModal] = useState(false)
  const [showDraftNudge, setShowDraftNudge] = useState(false)

  // Nudge/Toast states
  const [showFloatingToast, setShowFloatingToast] = useState(false)
  const [floatingToastMessage, setFloatingToastMessage] = useState<React.ReactNode>("")
  const floatingToastTimeout = useRef<NodeJS.Timeout | null>(null)

  // Content moderation warnings
  const [inputWarning, setInputWarning] = useState<string | null>(null)
  const [isBlockingIssue, setIsBlockingIssue] = useState(false)

  // Tags state
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // Visibility state
  const [visibility, setVisibility] = useState("public")

  // XP state
  const [currentXP, setCurrentXP] = useState(1250)
  const [nextLevelXP, setNextLevelXP] = useState(1500)
  const [currentLevel, setCurrentLevel] = useState(5)

  // Draft state
  const [savedDrafts, setSavedDrafts] = useState<DraftData[]>([])
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [draftNudgeMessage, setDraftNudgeMessage] = useState("")
  const [showDraftsList, setShowDraftsList] = useState(false)

  // Function to show a floating toast
  const showToast = (message: React.ReactNode, duration = 2500) => {
    if (floatingToastTimeout.current) {
      clearTimeout(floatingToastTimeout.current)
    }
    setFloatingToastMessage(message)
    setShowFloatingToast(true)
    floatingToastTimeout.current = setTimeout(() => {
      setShowFloatingToast(false)
    }, duration)
  }

  // Load ink data on mount
  useEffect(() => {
    const fetchInk = async () => {
      setIsLoadingInk(true)
      const ink = await getInkById(inkId)
      if (ink) {
        setOriginalInk(ink)
        setText(ink.content)
        setTags(ink.tags || [])
        setVisibility(ink.visibility || "public")
        setSelectedPalette(ink.theme || 0)
        setBgTheme(COLOR_PALETTES[ink.theme || 0]?.bg || COLOR_PALETTES[0].bg)
        setFontMood(ink.font || FONT_MOODS[0].value)
        setMoodPill(MOOD_PILLS.find((m) => m.name === ink.mood) || MOOD_PILLS[0])
        setIsDirty(false) // Initially, no changes
        showToast(<span>Editing Ink '{ink.content.split("\n")[0].substring(0, 30)}...'</span>)
      } else {
        showToast(<span>Ink not found! Redirecting to create page.</span>)
        router.replace("/create") // Redirect if ink not found
      }
      setIsLoadingInk(false)
    }

    if (inkId) {
      fetchInk()
    }
    setPlaceholder(PLACEHOLDER_MESSAGES[Math.floor(Math.random() * PLACEHOLDER_MESSAGES.length)])
  }, [inkId])

  // Load drafts and check for recovery on mount (same as create page)
  useEffect(() => {
    loadSavedDrafts()
    checkForDraftRecovery()
  }, [])

  // Load saved drafts from localStorage
  const loadSavedDrafts = () => {
    try {
      const drafts = localStorage.getItem("inkly-drafts")
      if (drafts) {
        const parsedDrafts = JSON.parse(drafts)
        setSavedDrafts(parsedDrafts)

        if (parsedDrafts.length > 0) {
          const lastNudge = localStorage.getItem("inkly-last-nudge")
          const now = new Date().getTime()
          const oneDay = 24 * 60 * 60 * 1000

          if (!lastNudge || now - Number.parseInt(lastNudge) > oneDay) {
            setTimeout(() => {
              setDraftNudgeMessage(DRAFT_NUDGES[Math.floor(Math.random() * DRAFT_NUDGES.length)])
              setShowDraftNudge(true)
              localStorage.setItem("inkly-last-nudge", now.toString())
            }, 3000)
          }
        }
      }
    } catch (error) {
      console.error("Error loading drafts:", error)
    }
  }

  // Check for unsaved draft recovery (same as create page)
  const checkForDraftRecovery = () => {
    try {
      const unsavedDraft = localStorage.getItem("inkly-unsaved-draft")
      if (unsavedDraft) {
        const draftData = JSON.parse(unsavedDraft)
        const draftAge = new Date().getTime() - new Date(draftData.timestamp).getTime()
        const oneHour = 60 * 60 * 1000

        if (draftAge < oneHour * 24 && draftData.text.length > 50) {
          setShowDraftRecoveryModal(true)
        } else {
          localStorage.removeItem("inkly-unsaved-draft")
        }
      }
    } catch (error) {
      console.error("Error checking draft recovery:", error)
    }
  }

  // Auto-save unsaved draft (same as create page)
  useEffect(() => {
    if (text.length > 10) {
      const unsavedDraft = {
        text,
        tags,
        visibility,
        theme: selectedPalette,
        font: fontMood,
        mood: moodPill.name,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("inkly-unsaved-draft", JSON.stringify(unsavedDraft))
    }
  }, [text, tags, visibility, selectedPalette, fontMood, moodPill])

  const showToolbar = isFocused || text.length > 0

  // Auto-save logic (same as create page)
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    if (text.length === 0) return
    if (text.length > MAX_CHARACTERS) return

    setIsDirty(true)
    setIsSaving(true)
    saveTimeout.current = setTimeout(() => {
      const randomSuccess = Math.random() > 0.1
      if (randomSuccess) {
        setIsSaving(false)
        setLastSaved(new Date())
        setSaveError(false)
      } else {
        setIsSaving(false)
        setSaveError(true)
        setConnectionStatus("error")
      }
    }, 2000) // 2-second debounce

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [text])

  // Close panel on outside click (same as create page)
  useEffect(() => {
    if (!showStylePanel) return
    function handleClick(e: MouseEvent) {
      const panel = document.getElementById("style-panel")
      if (panel && !panel.contains(e.target as Node)) setShowStylePanel(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showStylePanel])

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Enhanced save as draft handler (same as create page, but also for editing)
  function handleSaveDraft() {
    if (text.trim().length === 0) return

    const draftId = currentDraftId || `draft_${Date.now()}`
    const wordCount = getWordCount(text)
    const title = text.split("\n")[0].substring(0, 50).trim() || `Draft from ${new Date().toLocaleDateString()}`

    const draftData: DraftData = {
      id: draftId,
      text,
      tags,
      visibility,
      theme: selectedPalette,
      font: fontMood,
      mood: moodPill.name,
      timestamp: currentDraftId
        ? savedDrafts.find((d) => d.id === currentDraftId)?.timestamp || new Date().toISOString()
        : new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount,
      title,
    }

    const updatedDrafts = currentDraftId
      ? savedDrafts.map((d) => (d.id === currentDraftId ? draftData : d))
      : [...savedDrafts, draftData]

    setSavedDrafts(updatedDrafts)
    setCurrentDraftId(draftId)
    localStorage.setItem("inkly-drafts", JSON.stringify(updatedDrafts))

    localStorage.removeItem("inkly-unsaved-draft")

    setShowDraftSaved(true)
    setTimeout(() => setShowDraftSaved(false), 1500)
    showToast(<span>Draft '{title}' saved! ✨</span>)
  }

  // Load draft (same as create page)
  const loadDraft = (draft: DraftData) => {
    setText(draft.text)
    setTags(draft.tags)
    setVisibility(draft.visibility)
    setSelectedPalette(draft.theme)
    setBgTheme(COLOR_PALETTES[draft.theme]?.bg || COLOR_PALETTES[0].bg)
    setFontMood(draft.font)
    setMoodPill(MOOD_PILLS.find((m) => m.name === draft.mood) || MOOD_PILLS[0])
    setCurrentDraftId(draft.id)
    setIsDirty(false)
    setShowDraftsList(false)
    showToast(<span>Draft '{draft.title}' loaded! Happy writing! 📝</span>)
  }

  // Delete draft (same as create page)
  const deleteDraft = (draftId: string, draftTitle: string) => {
    const updatedDrafts = savedDrafts.filter((d) => d.id !== draftId)
    setSavedDrafts(updatedDrafts)
    localStorage.setItem("inkly-drafts", JSON.stringify(updatedDrafts))

    if (currentDraftId === draftId) {
      setCurrentDraftId(null)
      setText("")
      setTags([])
      setVisibility("public")
      setSelectedPalette(0)
      setBgTheme(COLOR_PALETTES[0].bg)
      setFontMood(FONT_MOODS[0].value)
      setMoodPill(MOOD_PILLS[0])
    }
    showToast(<span>Draft '{draftTitle}' deleted. You can always start a new one!🗑️</span>)
  }

  // Recover unsaved draft (same as create page)
  const recoverUnsavedDraft = () => {
    try {
      const unsavedDraft = localStorage.getItem("inkly-unsaved-draft")
      if (unsavedDraft) {
        const draftData = JSON.parse(unsavedDraft)
        setText(draftData.text)
        setTags(draftData.tags || [])
        setVisibility(draftData.visibility || "public")
        setSelectedPalette(draftData.theme || 0)
        setBgTheme(COLOR_PALETTES[draftData.theme || 0]?.bg || COLOR_PALETTES[0].bg)
        setFontMood(draftData.font || FONT_MOODS[0].value)
        setMoodPill(MOOD_PILLS.find((m) => m.name === draftData.mood) || MOOD_PILLS[0])
        localStorage.removeItem("inkly-unsaved-draft")
        setIsDirty(true)
        showToast(<span>Unsaved draft recovered! Welcome back! 👋</span>)
      }
    } catch (error) {
      console.error("Error recovering draft:", error)
    }
    setShowDraftRecoveryModal(false)
  }

  // Dismiss unsaved draft (same as create page)
  const dismissUnsavedDraft = () => {
    localStorage.removeItem("inkly-unsaved-draft")
    setShowDraftRecoveryModal(false)
    showToast(<span>Unsaved draft discarded.</span>)
  }

  // Reset style (same as create page)
  function handleResetStyle() {
    const resetValues = {
      palette: 0,
      font: FONT_MOODS[0].value,
      mood: MOOD_PILLS[0],
    }

    if (livePreview) {
      setBgTheme(COLOR_PALETTES[0].bg)
      setFontMood(resetValues.font)
      setMoodPill(resetValues.mood)
      setSelectedPalette(0)
      showToast(<span>Style reset to default.</span>)
    } else {
      setPendingPalette(0)
      setPendingFont(resetValues.font)
      setPendingMood(resetValues.mood)
      showToast(<span>Style changes pending. Apply to see.</span>)
    }
  }

  // Random vibe (same as create page)
  function handleRandomVibe() {
    const randomPalette = Math.floor(Math.random() * COLOR_PALETTES.length)
    const randomFont = FONT_MOODS[Math.floor(Math.random() * FONT_MOODS.length)]
    const randomMood = MOOD_PILLS[Math.floor(Math.random() * MOOD_PILLS.length)]

    if (livePreview) {
      setBgTheme(COLOR_PALETTES[randomPalette].bg)
      setFontMood(randomFont.value)
      setMoodPill(randomMood)
      setSelectedPalette(randomPalette)
      showToast(<span>New vibe: {COLOR_PALETTES[randomPalette].name}! ✨</span>)
    } else {
      setPendingPalette(randomPalette)
      setPendingFont(randomFont.value)
      setPendingMood(randomMood)
      showToast(<span>Random vibe pending. Apply to see.</span>)
    }
  }

  // Handle navigation with unsaved changes (same as create page)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault()
        event.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const handleBackNavigation = () => {
    if (isDirty) {
      setShowConfirmation(true)
    } else {
      router.push(`/ink/${inkId}`) // Go back to the ink's view page
    }
  }

  const confirmNavigation = () => {
    router.push(`/ink/${inkId}`)
  }

  const cancelNavigation = () => {
    setShowConfirmation(false)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= MAX_CHARACTERS) {
      setText(newText)
      setIsDirty(true)
      validateContent(newText)
    }
  }

  const validateContent = (content: string) => {
    let warning: string | null = null
    let blocking = false

    if (content.trim().length < MIN_CHARACTERS) {
      warning = `Ink must be at least ${MIN_CHARACTERS} characters.`
      blocking = true
    } else if (containsProfanity(content)) {
      warning = "Content contains profanity. Please revise."
      blocking = true
    } else if (containsViolence(content)) {
      warning = "Content contains violent or threatening language. This is not allowed."
      blocking = true
    } else if (containsForbiddenTopic(content)) {
      warning = "Content discusses a forbidden topic. Please remove."
      blocking = true
    } else if (isEmojiSpam(content)) {
      warning = "Too many emojis detected. Please write more descriptive content."
      blocking = true
    } else if (isRepeatedCharSpam(content)) {
      warning = "Please avoid repeated character spam."
      blocking = true
    } else if (isOnlyPunctuationOrWhitespace(content)) {
      warning = "Ink cannot be only punctuation or whitespace."
      blocking = true
    } else if (containsLink(content)) {
      warning = "Links are not allowed in inks."
      blocking = true
    } else if (containsHateSpeech(content)) {
      warning = "Content may contain hate speech. This will be flagged for review."
      blocking = true // Treat as blocking for now, in a real app might be moderation flag
    } else if (containsNSFWContent(content)) {
      warning = "Content may contain NSFW material. This will be flagged for review."
      blocking = true // Treat as blocking for now
    } else if (isAIGeneratedOrSpam(content)) {
      warning = "Content appears to be AI-generated or spam. Please ensure it's original and meaningful."
      blocking = true // Treat as blocking for now
    } else if (containsClickbait(content)) {
      warning = "Content may be clickbait. Please rephrase for clarity."
      blocking = false // Soft warning, allows publishing
    } else if (containsMentalHealthRisk(content)) {
      warning = (
        <>
          Your ink contains phrases related to mental health risk. If you or someone you know needs help, please reach
          out to a crisis hotline or mental health professional. You are not alone.
          <br />
          <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer" className="underline">
            988 Suicide & Crisis Lifeline
          </a>
        </>
      )
      blocking = false // Soft warning, allows publishing
    }

    setInputWarning(warning)
    setIsBlockingIssue(blocking)
  }

  // Tag handlers (same as create page)
  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setNewTag("")
      showToast(<span>Tag '#{tag}' added!</span>)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    showToast(<span>Tag '#{tagToRemove}' removed.</span>)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      addTag(newTag.trim().toLowerCase())
    }
  }

  // Handle Update Ink (modified from publish)
  const handleUpdateInk = async () => {
    validateContent(text) // Re-validate before final update

    if (isBlockingIssue || text.trim().length === 0 || text.trim().length < MIN_CHARACTERS) {
      showToast(<span>Cannot update: Please resolve the issues in your ink.</span>)
      return
    }

    const sanitizedContent = sanitizeInput(text)

    const updatedInkData = {
      content: sanitizedContent,
      tags,
      visibility,
      theme: selectedPalette,
      font: fontMood,
      mood: moodPill.name,
      // author and createdAt remain from originalInk
    }

    try {
      const result = await updateInk(inkId, updatedInkData) // Call the mock update function

      if (result) {
        setShowPublishModal(true) // Reuse publish modal for update success
        // Clear current draft if updating from a draft
        if (currentDraftId) {
          deleteDraft(currentDraftId, savedDrafts.find((d) => d.id === currentDraftId)?.title || "Untitled Draft")
        }
        localStorage.removeItem("inkly-unsaved-draft") // Clear unsaved draft
        setTimeout(() => {
          setShowPublishModal(false)
          router.push(`/ink/${inkId}`) // Redirect to the updated ink's view page
        }, 2000)
      } else {
        showToast(<span>Failed to update ink. Please try again.</span>)
      }
    } catch (error) {
      console.error("Failed to update ink:", error)
      showToast(<span>Failed to update ink. Please try again.</span>)
    }
  }

  // Get current palette for display (same as create page)
  const currentPalette = livePreview ? selectedPalette : pendingPalette
  const currentBg = livePreview ? bgTheme : COLOR_PALETTES[pendingPalette]?.bg || bgTheme
  const currentFont = livePreview ? fontMood : pendingFont
  const currentText = livePreview
    ? COLOR_PALETTES[selectedPalette]?.text || "text-gray-900 dark:text-gray-100"
    : COLOR_PALETTES[pendingPalette]?.text || "text-gray-900 dark:text-gray-100"

  if (isLoadingInk) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading ink...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900">
      <Header
        leftAction={
          <button
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9333ea]"
            aria-label="Back to Ink"
            onClick={handleBackNavigation}
            type="button"
          >
            <ArrowLeft className="w-4 h-4 text-[#9333ea]" />
          </button>
        }
      />
      <TooltipProvider>
        <div className="flex flex-1 w-full h-full">
          <nav className="hidden md:block w-max flex-shrink-0">
            <SideNav />
          </nav>
          <main className="flex-1 flex flex-col relative min-h-[calc(100vh-56px)] bg-white dark:bg-gray-900">
            <div
              className={`flex-1 flex flex-col relative transition-all duration-300 ${currentBg} px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-8`}
            >
              {/* Draft nudge notification */}
              <AnimatePresence>
                {showDraftNudge && (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md"
                  >
                    <Alert className="bg-[#9333ea]/10 border-[#9333ea]/20 shadow-lg">
                      <FileText className="h-4 w-4 text-[#9333ea]" />
                      <AlertDescription className="text-[#9333ea] font-medium">
                        {draftNudgeMessage}
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowDraftsList(true)}
                            className="border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-white"
                          >
                            View Drafts
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDraftNudge(false)}
                            className="text-[#9333ea] hover:bg-[#9333ea]/10"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Autosave indicator - top right on desktop, above toolbar on mobile */}
              <div className="absolute right-2 top-2 sm:right-6 sm:top-6 z-20 hidden sm:block">
                <AnimatePresence>
                  {(isSaving || lastSaved || saveError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm border
                      ${
                        isSaving
                          ? "bg-[#9333ea]/10 text-[#9333ea] border-[#9333ea]/10"
                          : saveError
                            ? "bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800"
                            : "bg-[#9333ea]/10 text-[#9333ea] border-[#9333ea]/10"
                      }`}
                    >
                      {isSaving
                        ? "Saving..."
                        : saveError
                          ? "Save failed. Retrying..."
                          : `Autosaved${lastSaved ? ` at ${formatTime(lastSaved)}` : ""}`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Textarea
                ref={textareaRef}
                placeholder={placeholder}
                className={`flex-1 w-full h-full text-lg sm:text-xl md:text-2xl px-2 sm:px-4 md:px-8 py-4 sm:py-8 ${currentBg} ${currentText} resize-none border-none shadow-none rounded-none transition-all duration-300 ${currentFont} text-left placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                style={{ minHeight: 0 }}
                value={text}
                onChange={handleTextChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label="Write your ink here"
                maxLength={MAX_CHARACTERS}
                autoFocus
              />
              {/* Character counter */}
              <div className="absolute bottom-2 right-2 sm:bottom-6 sm:right-6 z-20 text-xs text-gray-500 dark:text-gray-400">
                {text.length}/{MAX_CHARACTERS}
                {text.length > MAX_CHARACTERS * 0.9 && (
                  <span className="ml-1 text-red-500 dark:text-red-400">Approaching limit</span>
                )}
              </div>
              {/* Input Warning */}
              <AnimatePresence>
                {inputWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-40 text-xs px-3 py-1 rounded-full font-medium shadow-sm border text-center
                    ${
                      isBlockingIssue
                        ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                        : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {inputWarning}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Autosave indicator for mobile (above toolbar) */}
              <div className="sm:hidden w-full flex justify-center z-30 pointer-events-none">
                <AnimatePresence>
                  {(isSaving || lastSaved || saveError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm border mb-2 mt-2
                      ${
                        isSaving
                          ? "bg-[#9333ea]/10 text-[#9333ea] border-[#9333ea]/10"
                          : saveError
                            ? "bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800"
                            : "bg-[#9333ea]/10 text-[#9333ea] border-[#9333ea]/10"
                      }`}
                    >
                      {isSaving
                        ? "Saving..."
                        : saveError
                          ? "Save failed. Tap to retry."
                          : `Autosaved${lastSaved ? ` at ${formatTime(lastSaved)}` : ""}`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Floating toolbar, responsive */}
              <AnimatePresence>
                {showToolbar && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-none"
                  >
                    <div
                      className="fixed left-1/2 bottom-8 z-30 -translate-x-1/2 flex justify-center items-center gap-4 bg-white/90 dark:bg-gray-900/90 shadow-xl rounded-full px-4 py-2 border border-[#9333ea]/20 dark:border-[#9333ea]/30 pointer-events-auto backdrop-blur-sm
                    max-w-full
                    sm:left-1/2 sm:bottom-8 sm:-translate-x-1/2
                    w-[95vw] sm:w-auto
                    sm:rounded-full rounded-xl
                    sm:gap-4 gap-2
                    sm:px-4 px-2
                    sm:py-2 py-2
                  "
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Style & Theme"
                            onClick={() => setShowStylePanel((v) => !v)}
                            className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20"
                          >
                            <Sparkles className="w-5 h-5 text-[#9333ea]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Style & Theme</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Add Tags"
                            onClick={() => setShowTagsModal(true)}
                            className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20 relative"
                          >
                            <Tag className="w-5 h-5 text-[#9333ea]" />
                            {tags.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9333ea] text-white text-xs rounded-full flex items-center justify-center">
                                {tags.length}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Tags ({tags.length})</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Set Visibility"
                            onClick={() => setShowVisibilityModal(true)}
                            className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20"
                          >
                            <Globe className="w-5 h-5 text-[#9333ea]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visibility: {visibility}</TooltipContent>
                      </Tooltip>
                      {showMoreOptions && (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="View Drafts"
                                onClick={() => setShowDraftsList(true)}
                                className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20 relative"
                              >
                                <FileText className="w-5 h-5 text-[#9333ea]" />
                                {savedDrafts.length > 0 && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#9333ea] text-white text-xs rounded-full flex items-center justify-center">
                                    {savedDrafts.length}
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Drafts ({savedDrafts.length})</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="XP & Achievements"
                                onClick={() => setShowAchievementsModal(true)}
                                className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20"
                              >
                                <BadgeCheck className="w-5 h-5 text-[#9333ea]" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>XP & Achievements</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                      {!showMoreOptions && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="More Options"
                              onClick={() => setShowMoreOptions(true)}
                              className="hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20"
                            >
                              <MoreHorizontal className="w-5 h-5 text-[#9333ea]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>More Options</TooltipContent>
                        </Tooltip>
                      )}
                      {/* Save as Draft button */}
                      {text.trim().length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 hover:bg-[#9333ea]/10 dark:hover:bg-[#9333ea]/20"
                              aria-label="Save as Draft"
                              onClick={handleSaveDraft}
                            >
                              <Save className="w-5 h-5 text-[#9333ea]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Save as Draft</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            className="rounded-full bg-[#9333ea] hover:bg-[#7e22ce] text-white border-none shadow-lg ml-2 px-6 sm:px-6 px-4"
                            disabled={
                              text.trim().length === 0 ||
                              isSaving ||
                              isBlockingIssue ||
                              text.trim().length < MIN_CHARACTERS
                            }
                            aria-label="Update Ink"
                            onClick={handleUpdateInk}
                          >
                            ✍️ Update Ink
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Update Ink</TooltipContent>
                      </Tooltip>
                    </div>
                    {/* Draft saved toast */}
                    <AnimatePresence>
                      {showDraftSaved && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[1000] bg-[#9333ea] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
                        >
                          Draft saved! ✨
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Toast for general nudges */}
              <AnimatePresence>
                {showFloatingToast && <FloatingToast message={floatingToastMessage} duration={2500} />}
              </AnimatePresence>

              {/* Style & Theme Side Panel */}
              <AnimatePresence>
                {showStylePanel && (
                  <>
                    <style>{`body { overflow: hidden !important; }`}</style>
                    <div className="fixed inset-0 z-[1099]" style={{ background: "transparent" }} />
                    <motion.div
                      id="style-panel"
                      initial={{ x: 200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 200, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="fixed top-0 right-0 w-full sm:w-[28rem] max-w-full h-full z-[1100] bg-white dark:bg-gray-900 shadow-2xl rounded-none sm:rounded-l-3xl border-l border-gray-100 dark:border-gray-800 flex flex-col p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e0d7fa] dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                      style={{ boxShadow: "-8px 0 32px 0 rgba(80,0,120,0.08)", minHeight: "420px" }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Style Studio</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Craft your ink's visual identity
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium transition-colors ${livePreview ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                            >
                              Live Preview
                            </span>
                            <Switch
                              checked={livePreview}
                              onCheckedChange={setLivePreview}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="text-gray-400 hover:text-[#9333ea] p-1"
                                aria-label="Random Vibe"
                                onClick={() => handleRandomVibe()}
                              >
                                <Dice5 className="w-5 h-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Surprise Me</TooltipContent>
                          </Tooltip>
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            aria-label="Close Style Panel"
                            onClick={() => setShowStylePanel(false)}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {/* Color Palettes Grid */}
                      <div className="px-4 sm:px-6 pt-4">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 tracking-wide">
                          THEMES
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mb-6">
                          {COLOR_PALETTES.map((palette, idx) => (
                            <Tooltip key={palette.name}>
                              <TooltipTrigger asChild>
                                <button
                                  className={`relative aspect-square rounded-lg flex items-end justify-center transition-all duration-150 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[#9333ea] min-h-[44px] min-w-[44px]
                                ${currentPalette === idx ? "ring-2 ring-[#9333ea] shadow-lg scale-105" : "hover:scale-105 hover:shadow-md"}`}
                                  onClick={() => {
                                    if (livePreview) {
                                      setBgTheme(palette.bg)
                                      setSelectedPalette(idx)
                                      showToast(<span>Theme set to '{palette.name}'!</span>)
                                    } else {
                                      setPendingPalette(idx)
                                    }
                                  }}
                                  aria-label={`Select ${palette.name} theme`}
                                >
                                  <div className={`absolute inset-0 ${palette.preview}`} />
                                  {/* Selection indicator */}
                                  {currentPalette === idx && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-3 h-3 bg-[#9333ea] rounded-full shadow-lg"></div>
                                    </div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>{palette.name}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                      {/* Typography */}
                      <div className="px-6">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                          TYPOGRAPHY
                        </div>
                        <div className="flex flex-col gap-3 mb-6">
                          {FONT_MOODS.map((fm) => (
                            <button
                              key={fm.value}
                              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all duration-150 ${(livePreview ? fontMood : pendingFont) === fm.value ? "border-[#9333ea] bg-[#f6f3ff] dark:bg-[#9333ea]/10" : "border-gray-200 dark:border-gray-700 hover:border-[#9333ea]/40"} flex items-center gap-3`}
                              onClick={() => {
                                if (livePreview) {
                                  setFontMood(fm.value)
                                  showToast(<span>Font set to '{fm.name}'!</span>)
                                } else {
                                  setPendingFont(fm.value)
                                }
                              }}
                            >
                              <span className="flex-1">
                                <span className="block font-semibold text-sm mb-1 text-gray-900 dark:text-gray-100">
                                  {fm.name.replace(/\$\$.*\$\$/, "").trim()}
                                </span>
                                <span className={`block text-xs text-gray-500 dark:text-gray-400 italic ${fm.value}`}>
                                  The quiet whisper of forgotten memories...
                                </span>
                              </span>
                              <span className="ml-2">
                                <input
                                  type="radio"
                                  checked={(livePreview ? fontMood : pendingFont) === fm.value}
                                  readOnly
                                  className="accent-[#9333ea]"
                                  aria-label={fm.name}
                                />
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Emotional Tone */}
                      <div className="px-6 mb-6">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 tracking-wide">
                          EMOTIONAL TONE
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {MOOD_PILLS.map((m) => (
                            <button
                              key={m.name}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${(livePreview ? moodPill : pendingMood).name === m.name ? "border-[#9333ea] bg-[#f6f3ff] dark:bg-[#9333ea]/10 text-[#9333ea]" : "border-gray-200 dark:border-gray-700 hover:border-[#9333ea]/40 text-gray-700 dark:text-gray-300"}`}
                              onClick={() => {
                                if (livePreview) {
                                  setMoodPill(m)
                                  showToast(
                                    <span>
                                      Mood set to '{m.name}'! {m.icon}
                                    </span>,
                                  )
                                } else {
                                  setPendingMood(m)
                                }
                              }}
                            >
                              <span>{m.icon}</span> {m.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Footer Actions */}
                      <div className="flex flex-col gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-3xl">
                        <div className="flex gap-2 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetStyle}
                            className="text-gray-500 dark:text-gray-400"
                          >
                            ↺ Reset to Default
                          </Button>
                        </div>
                        {!livePreview && (
                          <Button
                            variant="default"
                            size="lg"
                            className="w-full bg-[#9333ea] hover:bg-[#7e22ce]"
                            onClick={() => {
                              setBgTheme(COLOR_PALETTES[pendingPalette]?.bg || bgTheme)
                              setFontMood(pendingFont)
                              setMoodPill(pendingMood)
                              setSelectedPalette(pendingPalette)
                              setShowStylePanel(false)
                              showToast(<span>Style applied! Your ink is looking fresh ✨</span>)
                            }}
                          >
                            Apply Style Changes
                          </Button>
                        )}
                        {livePreview && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full bg-transparent border-gray-200 dark:border-gray-700"
                            onClick={() => setShowStylePanel(false)}
                          >
                            Done
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </TooltipProvider>

      {/* Tags Modal */}
      <Dialog open={showTagsModal} onOpenChange={setShowTagsModal}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Add Tags</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Help others discover your ink with relevant tags (max 10)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                maxLength={20}
              />
              <Button
                onClick={() => addTag(newTag.trim().toLowerCase())}
                disabled={!newTag.trim() || tags.length >= 10}
                className="bg-[#9333ea] hover:bg-[#7e22ce]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Current tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your tags ({tags.length}/10):
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#9333ea]/10 text-[#9333ea] hover:bg-[#9333ea]/20"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Popular tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular tags:</Label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.filter((tag) => !tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      disabled={tags.length >= 10}
                      className="text-xs border-gray-200 dark:border-gray-700 hover:border-[#9333ea] hover:text-[#9333ea]"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Visibility Modal */}
      <Dialog open={showVisibilityModal} onOpenChange={setShowVisibilityModal}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Set Visibility</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Choose who can see your ink
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {VISIBILITY_OPTIONS.map((option) => {
              const IconComponent = option.icon as React.ComponentType<{ className?: string }>
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setVisibility(option.value)
                    setShowVisibilityModal(false)
                    showToast(<span>Visibility set to '{option.label}'.</span>)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    visibility === option.value
                      ? "border-[#9333ea] bg-[#9333ea]/5"
                      : "border-gray-200 dark:border-gray-700 hover:border-[#9333ea]/40"
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-[#9333ea]" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{option.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                  </div>
                  {visibility === option.value && <CheckCircle className="w-5 h-5 text-[#9333ea]" />}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievements Modal */}
      <Dialog open={showAchievementsModal} onOpenChange={setShowAchievementsModal}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">XP & Achievements</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Track your writing progress and unlock achievements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* XP Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Level {currentLevel}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentXP} / {nextLevelXP} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#9333ea] to-[#7e22ce] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Achievements</h3>
              <div className="space-y-2">
                {ACHIEVEMENTS.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      achievement.unlocked
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          achievement.unlocked
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</div>
                    </div>
                    {achievement.unlocked && <Trophy className="w-5 h-5 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish/Update Success Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ink Updated! 🎉</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Your changes have been saved.</p>
            </div>
            {/* XP gain is not relevant for updates, only for new publishes */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft Recovery Modal */}
      <Dialog open={showDraftRecoveryModal} onOpenChange={setShowDraftRecoveryModal}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#9333ea]" />
              Recover Your Work
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              We found some unsaved work from your last session. Would you like to recover it?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={dismissUnsavedDraft}
              className="flex-1 border-gray-200 dark:border-gray-700 bg-transparent"
            >
              Discard
            </Button>
            <Button onClick={recoverUnsavedDraft} className="flex-1 bg-[#9333ea] hover:bg-[#7e22ce]">
              Recover
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drafts List Modal */}
      <Dialog open={showDraftsList} onOpenChange={setShowDraftsList}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#9333ea]" />
              Your Drafts ({savedDrafts.length})
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Continue working on your saved drafts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {savedDrafts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No drafts yet</p>
                <p className="text-sm">Start writing to create your first draft</p>
              </div>
            ) : (
              savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#9333ea]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{draft.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {draft.text.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(draft.lastModified).toLocaleDateString()}
                        </span>
                        <span>{draft.wordCount} words</span>
                        {draft.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {draft.tags.length} tags
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadDraft(draft)}
                        className="border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-white"
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDraft(draft.id, draft.title || "Untitled Draft")}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Unsaved Changes
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              You have unsaved changes. What would you like to do?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" onClick={cancelNavigation} className="flex-1 bg-transparent">
              Stay
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleSaveDraft()
                confirmNavigation()
              }}
              className="flex-1 border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-white"
            >
              Save & Leave
            </Button>
            <Button variant="destructive" onClick={confirmNavigation} className="flex-1">
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
