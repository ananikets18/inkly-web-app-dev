"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Palette,
  Globe,
  Users,
  Lock,
  Save,
  AlertTriangle,
  FileText,
  Type,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  Trophy,
  Shield,
  AlertCircle,
} from "lucide-react"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { detectInkType } from "@/utils/detectInkType"
import { generateRandomInkId } from "@/utils/random-ink-id"
import {
  containsProfanity,
  containsHateSpeech,
  containsNSFWContent,
  containsMentalHealthRisk,
  containsViolence,
  containsClickbait,
  containsForbiddenTopic,
  containsImpersonation,
  sanitizeInput,
  isEmojiSpam,
  isRepeatedCharSpam,
  containsLink,
  isOnlyPunctuationOrWhitespace,
} from "@/utils/textFilters"
import { validateInkContent, type InkValidationResult } from "@/utils/inkValidation"
import { NetworkWarning } from "@/components/NetworkWarning"
// Authentication removed - using mock authentication

// Enhanced background themes with gradients
const BACKGROUND_THEMES = [
  {
    name: "Pure White",
    bg: "bg-white",
    text: "text-gray-900",
    preview: "bg-white border-2 border-gray-200",
  },
  {
    name: "Soft Paper",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
  {
    name: "Ocean Breeze",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    name: "Forest Mist",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    name: "Lavender Dream",
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-orange-100 to-pink-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-orange-100 to-pink-100",
  },
  {
    name: "Rose Garden",
    bg: "bg-gradient-to-br from-rose-50 to-pink-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-rose-50 to-pink-100",
  },
  {
    name: "Golden Hour",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-amber-50 to-yellow-100",
  },
  {
    name: "Mint Fresh",
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-green-50 to-green-100",
  },
  {
    name: "Sky Blue",
    bg: "bg-gradient-to-br from-sky-50 to-blue-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-sky-50 to-blue-100",
  },
  {
    name: "Coral Reef",
    bg: "bg-gradient-to-br from-orange-100 to-pink-100",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-orange-100 to-pink-100",
  },
  {
    name: "Sage Wisdom",
    bg: "bg-gradient-to-br from-green-100 to-emerald-200",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-green-100 to-emerald-200",
  },
  // New gradient themes
  {
    name: "Aurora Borealis",
    bg: "bg-gradient-to-br from-green-200 via-blue-200 to-purple-300",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-green-200 via-blue-200 to-purple-300",
  },
  {
    name: "Cosmic Nebula",
    bg: "bg-gradient-to-br from-purple-300 via-pink-300 to-indigo-400",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-purple-300 via-pink-300 to-indigo-400",
  },
  {
    name: "Fire Sunset",
    bg: "bg-gradient-to-br from-red-200 via-orange-300 to-yellow-400",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-red-200 via-orange-300 to-yellow-400",
  },
  {
    name: "Ocean Depths",
    bg: "bg-gradient-to-br from-blue-300 via-teal-400 to-cyan-500",
    text: "text-white",
    preview: "bg-gradient-to-br from-blue-300 via-teal-400 to-cyan-500",
  },
  {
    name: "Tropical Paradise",
    bg: "bg-gradient-to-br from-lime-200 via-green-300 to-emerald-400",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-lime-200 via-green-300 to-emerald-400",
  },
  {
    name: "Midnight Blue",
    bg: "bg-gradient-to-br from-slate-800 to-blue-900",
    text: "text-white",
    preview: "bg-gradient-to-br from-slate-800 to-blue-900",
  },
  {
    name: "Deep Forest",
    bg: "bg-gradient-to-br from-green-800 to-emerald-900",
    text: "text-white",
    preview: "bg-gradient-to-br from-green-800 to-emerald-900",
  },
  {
    name: "Royal Purple",
    bg: "bg-gradient-to-br from-purple-800 to-indigo-900",
    text: "text-white",
    preview: "bg-gradient-to-br from-purple-800 to-indigo-900",
  },
  {
    name: "Charcoal",
    bg: "bg-gradient-to-br from-gray-800 to-slate-900",
    text: "text-white",
    preview: "bg-gradient-to-br from-gray-800 to-slate-900",
  },
  {
    name: "Wine Red",
    bg: "bg-gradient-to-br from-red-800 to-rose-900",
    text: "text-white",
    preview: "bg-gradient-to-br from-red-800 to-rose-900",
  },
  {
    name: "Electric Blue",
    bg: "bg-gradient-to-br from-cyan-200 to-blue-300",
    text: "text-gray-900",
    preview: "bg-gradient-to-br from-cyan-200 to-blue-300",
  },
  {
    name: "Neon Gradient",
    bg: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
    text: "text-white",
    preview: "bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
  },
  {
    name: "Warm Sunset",
    bg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
    text: "text-white",
    preview: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
  },
]

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: Globe, description: "Anyone can see this ink" },
  { value: "followers", label: "Followers", icon: Users, description: "Only your followers can see this ink" },
  { value: "private", label: "Private", icon: Lock, description: "Only you can see this ink" },
]

const FONT_SIZES = [
  { name: "Small", value: "text-sm", size: 14 },
  { name: "Medium", value: "text-base", size: 16 },
  { name: "Large", value: "text-lg", size: 18 },
  { name: "Extra Large", value: "text-xl", size: 20 },
]

// Dynamic placeholder messages - carefully curated to avoid duplicate themes
const PLACEHOLDER_MESSAGES = [
  "What's inspiring you today? ✨",
  "Share a thought that's been on your mind...",
  "Write about a moment that changed you 🌟",
  "What would you tell your younger self?",
  "Describe your perfect day in detail...",
  "Share a lesson you learned recently 📚",
  "What are you grateful for right now?",
  "Write about a dream you're chasing ✨",
  "Share a memory that makes you smile 😊",
  "What's something you wish more people knew?",
  "Describe a place that feels like home 🏠",
  "Write about overcoming a challenge...",
  "Share your thoughts on kindness 💝",
  "What does success mean to you?",
  "Write about a book that changed your perspective 📖",
  "Share advice you'd give to everyone",
  "Describe your ideal creative space 🎨",
  "What's a small joy in your daily life?",
  "Write about someone who inspires you ⭐",
  "Share your thoughts on personal growth 🌱",
]

const MAX_CHARACTERS = 5000
const MIN_CHARACTERS = 15
const MAX_HASHTAGS = 2

interface DraftData {
  id: string
  content: string
  theme: number
  fontSize: number
  visibility: string
  timestamp: string
  wordCount: number
}

interface ContentValidationResult {
  errors: string[]
  warnings: string[]
  criticalIssues: string[]
  mentalHealthWarning: boolean
  hashtags: string[]
}

// Enhanced hashtag validation
const validateHashtags = (content: string) => {
  const hashtags = content.match(/#\w+/g) || []
  const errors: string[] = []
  const warnings: string[] = []

  // Check maximum hashtags
  if (hashtags.length > MAX_HASHTAGS) {
    errors.push(`Maximum ${MAX_HASHTAGS} hashtags allowed. Found ${hashtags.length}.`)
  }

  // Check for duplicate hashtags (case-insensitive)
  const normalizedHashtags = hashtags.map((tag) => tag.toLowerCase())
  const uniqueHashtags = new Set(normalizedHashtags)

  if (normalizedHashtags.length !== uniqueHashtags.size) {
    const duplicates = normalizedHashtags.filter((tag, index) => normalizedHashtags.indexOf(tag) !== index)
    warnings.push(`Duplicate hashtags detected: ${[...new Set(duplicates)].join(", ")}`)
  }

  // Check hashtag length
  const longHashtags = hashtags.filter((tag) => tag.length > 20)
  if (longHashtags.length > 0) {
    warnings.push(`Some hashtags are too long. Keep them under 20 characters.`)
  }

  // Check for hashtags with numbers only
  const numberOnlyHashtags = hashtags.filter((tag) => /^#\d+$/.test(tag))
  if (numberOnlyHashtags.length > 0) {
    warnings.push(`Avoid hashtags with only numbers: ${numberOnlyHashtags.join(", ")}`)
  }

  return { errors, warnings, hashtags: [...uniqueHashtags] }
}

// Comprehensive content validation
const validateContent = (content: string): InkValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  const criticalIssues: string[] = []
  let mentalHealthWarning = false

  // Basic validation
  if (!content.trim()) {
    errors.push("Content cannot be empty")
    return { errors, warnings, nudges: [], detectedType: "unknown" }
  }

  // Length validation
  if (content.length < MIN_CHARACTERS) {
    warnings.push(`Content is too short. Minimum ${MIN_CHARACTERS} characters required.`)
  }

  if (content.length > MAX_CHARACTERS) {
    errors.push(`Content exceeds maximum length of ${MAX_CHARACTERS} characters.`)
  }

  // Sanitize content for validation
  const sanitizedContent = sanitizeInput(content)

  // Critical content filters
  if (containsProfanity(sanitizedContent)) {
    criticalIssues.push("Content contains inappropriate language. Please revise your message.")
  }

  if (containsHateSpeech(sanitizedContent)) {
    criticalIssues.push("Content may contain hate speech or discriminatory language.")
  }

  if (containsNSFWContent(sanitizedContent)) {
    criticalIssues.push("Content appears to contain adult or explicit material.")
  }

  if (containsViolence(sanitizedContent)) {
    criticalIssues.push("Content contains violent or threatening language.")
  }

  if (containsForbiddenTopic(sanitizedContent)) {
    criticalIssues.push("Content discusses topics that are not allowed on this platform.")
  }

  // Mental health risk detection
  if (containsMentalHealthRisk(sanitizedContent)) {
    mentalHealthWarning = true
    warnings.push("Your content mentions mental health topics. Please consider reaching out for support if needed.")
  }

  // Quality and spam filters
  if (isOnlyPunctuationOrWhitespace(sanitizedContent)) {
    errors.push("Content cannot be only punctuation or whitespace.")
  }

  if (isEmojiSpam(content)) {
    warnings.push("Consider reducing emoji usage for better readability.")
  }

  if (isRepeatedCharSpam(content)) {
    warnings.push("Avoid excessive repeated characters.")
  }

  if (containsLink(content)) {
    errors.push("Links are not allowed in ink content.")
  }

  if (containsClickbait(sanitizedContent)) {
    warnings.push("Content may contain clickbait patterns. Consider a more authentic approach.")
  }

  if (containsImpersonation(sanitizedContent)) {
    warnings.push("Content may reference public figures. Ensure you're not impersonating anyone.")
  }

  // Additional quality checks
  const wordsInCaps = content.match(/\b[A-Z]{3,}\b/g) || []
  if (wordsInCaps.length > 3) {
    warnings.push("Avoid excessive use of ALL CAPS.")
  }

  const specialCharCount = (content.match(/[!@#$%^&*()_+=[\]{}|;':",./<>?~`]/g) || []).length
  if (specialCharCount > content.length * 0.3) {
    warnings.push("Too many special characters. Consider using more natural language.")
  }

  // Hashtag validation
  const hashtagValidation = validateHashtags(content)
  errors.push(...hashtagValidation.errors)
  warnings.push(...hashtagValidation.warnings)

  return {
    errors,
    warnings,
    nudges: [], // No nudges in this simplified version
    detectedType: "unknown",
  }
}

// XP calculation based on content analysis
const calculateXP = (content: string, validation: InkValidationResult) => {
  let xp = 0
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = words.length
  const charCount = content.length

  // Base XP for word count
  if (wordCount >= 10) xp += 10
  if (wordCount >= 50) xp += 20
  if (wordCount >= 100) xp += 30
  if (wordCount >= 200) xp += 40

  // Character bonus
  if (charCount >= 100) xp += 5
  if (charCount >= 500) xp += 15
  if (charCount >= 1000) xp += 25

  // Content quality bonuses
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (sentences.length >= 3) xp += 10 // Multiple sentences

  // Emotional words bonus
  const emotionalWords = [
    "love",
    "hope",
    "dream",
    "inspire",
    "grateful",
    "amazing",
    "beautiful",
    "wonderful",
    "incredible",
    "fantastic",
    "brilliant",
    "awesome",
    "perfect",
    "happy",
    "joy",
    "peace",
    "success",
    "achievement",
    "victory",
    "triumph",
  ]
  const emotionalCount = emotionalWords.filter((word) => content.toLowerCase().includes(word)).length
  xp += emotionalCount * 3

  // Question bonus (encourages engagement)
  const questionCount = (content.match(/\?/g) || []).length
  xp += questionCount * 5

  // Creativity bonus for varied punctuation
  const punctuationVariety = new Set(content.match(/[.!?;:,]/g) || []).size
  if (punctuationVariety >= 3) xp += 10

  // Penalties for quality issues
  xp -= validation.warnings.length * 2
  xp -= validation.errors.length * 20

  // No XP for content with critical issues
  if (validation.errors.length > 0) {
    xp = 0
  }

  return Math.max(0, Math.min(xp, 200)) // Cap at 200 XP, minimum 0
}

// Helper function to calculate reading time
const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return {
    text: `${minutes} min read`,
    minutes,
    words,
  }
}

import AuthGuard from "@/components/AuthGuard"

export default function CreatePage() {
  return (
    <AuthGuard>
      <CreatePageContent />
    </AuthGuard>
  )
}

function CreatePageContent() {
  const router = useRouter()
  const { playSound } = useSoundEffects()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Content state
  const [content, setContent] = useState("")
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [fontSize, setFontSize] = useState(1)
  const [visibility, setVisibility] = useState("public")

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [drafts, setDrafts] = useState<DraftData[]>([])
  const [currentPlaceholder, setCurrentPlaceholder] = useState("")

  // Validation state
  // Use the new InkValidationResult type for validation state
  const [validation, setValidation] = useState<InkValidationResult>({
    errors: [],
    warnings: [],
    nudges: [],
    detectedType: "unknown",
  })

  // Add state for user interaction
  const [hasInteracted, setHasInteracted] = useState(false)

  // Word count and XP
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const charCount = content.length
  const xpPoints = calculateXP(content, validation)

  // Dynamic placeholder rotation
  useEffect(() => {
    const getRandomPlaceholder = () => {
      const randomIndex = Math.floor(Math.random() * PLACEHOLDER_MESSAGES.length)
      return PLACEHOLDER_MESSAGES[randomIndex]
    }

    setCurrentPlaceholder(getRandomPlaceholder())

    // Change placeholder every 10 seconds when textarea is empty
    const interval = setInterval(() => {
      if (!content.trim()) {
        setCurrentPlaceholder(getRandomPlaceholder())
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [content])

  // Auto-save functionality
  const saveDraft = useCallback(() => {
    if (content.trim() && validation.errors.length === 0) {
      const draft: DraftData = {
        id: Date.now().toString(),
        content,
        theme: selectedTheme,
        fontSize,
        visibility,
        timestamp: new Date().toISOString(),
        wordCount,
      }

      const existingDrafts = JSON.parse(localStorage.getItem("inkly-drafts") || "[]")
      const updatedDrafts = [draft, ...existingDrafts.slice(0, 9)] // Keep only 10 drafts
      localStorage.setItem("inkly-drafts", JSON.stringify(updatedDrafts))
      setDrafts(updatedDrafts)
      setLastSaved(new Date())
    }
  }, [content, selectedTheme, fontSize, visibility, wordCount, validation.errors])

  // Load drafts on mount
  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("inkly-drafts") || "[]")
    setDrafts(savedDrafts)
  }, [])

  // Auto-save every 3 seconds
  useEffect(() => {
    const timer = setTimeout(saveDraft, 3000)
    return () => clearTimeout(timer)
  }, [saveDraft])

  // Content validation
  useEffect(() => {
    setValidation(validateInkContent(content))
  }, [content])

  const handlePublish = () => {
    if (validation.errors.length > 0 || validation.warnings.length > 0 || content.trim().length < MIN_CHARACTERS) {
      playSound("modalClose") // was 'error', now using closest available
      return
    }
    setShowPreview(true)
  }

  const confirmPublish = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const readingTime = calculateReadingTime(content)
      const inkType = detectInkType(content)

      const newInk = {
        id: generateRandomInkId(),
        content: content.trim(),
        author: "You",
        username: "you",
        createdAt: new Date().toISOString(),
        readingTime: readingTime.text,
        views: "0",
        type: inkType,
        theme: selectedTheme,
        visibility,
        tags: [], // No hashtags in new validation system
      }

      const existingInks = JSON.parse(localStorage.getItem("inkly-inks") || "[]")
      existingInks.unshift(newInk)
      localStorage.setItem("inkly-inks", JSON.stringify(existingInks))

      // Clear current draft
      localStorage.removeItem("inkly-current-draft")

      playSound("click") // was 'success', now using closest available
      router.push(`/ink/${newInk.id}`)
    } catch (error) {
      console.error("Failed to publish ink:", error)
      playSound("modalClose") // was 'error', now using closest available
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadDraft = (draft: DraftData) => {
    setContent(draft.content)
    setSelectedTheme(draft.theme)
    setFontSize(draft.fontSize)
    setVisibility(draft.visibility)
    setShowDrafts(false)
    textareaRef.current?.focus()
  }

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter((d) => d.id !== draftId)
    setDrafts(updatedDrafts)
    localStorage.setItem("inkly-drafts", JSON.stringify(updatedDrafts))
  }

  const currentTheme = BACKGROUND_THEMES[selectedTheme]
  const currentFontSize = FONT_SIZES[fontSize]
  const readingTime = calculateReadingTime(content)

  const canPublish = validation.errors.length === 0 && content.trim().length >= MIN_CHARACTERS

  return (
    <div className={`min-h-screen w-full ${currentTheme.bg} ${currentTheme.text} transition-all duration-300`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {lastSaved && <span>Saved {lastSaved.toLocaleTimeString()}</span>}
          <Save className="w-4 h-4" />
        </div>
      </div>

      {/* Main Writing Area */}
      <div className="pt-16 pb-24 px-4 h-screen flex flex-col">
        {/* Network Warning */}
        <NetworkWarning variant="banner" />
        
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <Textarea
            ref={textareaRef}
            placeholder={currentPlaceholder}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (!hasInteracted) setHasInteracted(true)
            }}
            onBlur={() => setHasInteracted(true)}
            className={`
              w-full h-full resize-none border-0 bg-transparent
              ${currentFontSize.value} leading-relaxed
              focus-visible:ring-0 focus-visible:ring-offset-0
              placeholder:text-muted-foreground/50
              ${validation.errors.length > 0 ? "text-red-600" : ""}
            `}
            style={{ fontSize: `${currentFontSize.size}px` }}
            maxLength={MAX_CHARACTERS}
            aria-label="Write your ink content"
            aria-describedby="word-counter validation-messages"
          />
        </div>

        {/* Word Counter with XP Preview */}
        <div
          id="word-counter"
          className="absolute bottom-28 right-6 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1"
        >
          <div className="flex items-center gap-3">
            <span>
              {wordCount} words • {charCount}/{MAX_CHARACTERS}
            </span>
            {xpPoints > 0 && validation.errors.length === 0 && (
              <div className="flex items-center gap-1 text-purple-600">
                <Zap className="w-3 h-3" />
                <span className="font-medium">+{xpPoints} XP</span>
              </div>
            )}
            {validation.errors.length > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <Shield className="w-3 h-3" />
                <span className="font-medium">Blocked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <AnimatePresence>
        {hasInteracted && (validation.errors.length > 0 || validation.warnings.length > 0) && (
          <motion.div
            id="validation-messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 left-4 right-4 z-20"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-4 space-y-2">
                {/* Errors */}
                {validation.errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-red-600" role="alert">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                ))}
                {/* Warnings */}
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center gap-2 text-yellow-600" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {/* Background Theme Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Change background theme">
                    <Palette className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="center">
                  <div className="space-y-3">
                    <h4 className="font-medium">Background Themes</h4>
                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                      {BACKGROUND_THEMES.map((theme, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTheme(index)}
                          className={`
                            w-12 h-12 rounded-lg ${theme.preview} border-2 transition-all
                            ${selectedTheme === index ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"}
                          `}
                          aria-label={`Select ${theme.name} theme`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Font Size */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Change font size">
                    <Type className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="center">
                  <div className="space-y-2">
                    <h4 className="font-medium">Font Size</h4>
                    {FONT_SIZES.map((size, index) => (
                      <Button
                        key={index}
                        variant={fontSize === index ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFontSize(index)}
                        className="w-full justify-start"
                      >
                        {size.name} ({size.size}px)
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Visibility */}
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-auto border-0 bg-transparent" aria-label="Set visibility">
                  <div className="flex items-center gap-2">
                    {visibility === "public" && <Globe className="w-4 h-4" />}
                    {visibility === "followers" && <Users className="w-4 h-4" />}
                    {visibility === "private" && <Lock className="w-4 h-4" />}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {/* Drafts */}
              <Button variant="ghost" size="sm" onClick={() => setShowDrafts(true)} aria-label="View drafts">
                <FileText className="w-4 h-4" />
                {drafts.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {drafts.length}
                  </Badge>
                )}
              </Button>

              {/* Publish Button */}
              <Button
                onClick={handlePublish}
                disabled={!canPublish}
                className={`${
                  canPublish
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
                aria-label="Publish ink"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ink It
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Your Ink</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`p-6 rounded-lg ${currentTheme.bg} ${currentTheme.text}`}>
              <div className={`${currentFontSize.value} leading-relaxed whitespace-pre-wrap`}>{content}</div>
            </div>

            {/* Content Safety Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">Content Safety: Approved</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Your content has passed all safety and quality checks.
              </p>
            </div>

            {/* XP Reward Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">XP Reward</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Great content! You'll earn XP for this ink.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{xpPoints}</span>
                </div>
              </div>

              {/* XP Breakdown */}
              <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700 dark:text-purple-300">Words:</span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700 dark:text-purple-300">Reading time:</span>
                    <span className="font-medium">{readingTime.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700 dark:text-purple-300">Visibility:</span>
                    <span className="font-medium capitalize">{visibility}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {wordCount} words • {readingTime.text}
              </span>
              <span>Visibility: {visibility}</span>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Edit More
              </Button>
              <Button
                onClick={confirmPublish}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSubmitting ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ) : (
                  "Publish Ink"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drafts Modal */}
      <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Drafts</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {drafts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No drafts yet</p>
              ) : (
                drafts.map((draft) => (
                  <Card key={draft.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1" onClick={() => loadDraft(draft)}>
                          <p className="text-sm line-clamp-2 mb-2">{draft.content.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{draft.wordCount} words</span>
                            <span>{new Date(draft.timestamp).toLocaleDateString()}</span>
                            <span className="capitalize">{draft.visibility}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDraft(draft.id)
                          }}
                          aria-label="Delete draft"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
