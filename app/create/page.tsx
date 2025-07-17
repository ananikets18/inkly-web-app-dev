"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Globe,
  Users,
  Lock,
  X,
  Plus,
  Lightbulb,
  Save,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react"
import {
  validateTextContent,
  validateTags,
  cleanTags,
  detectContentWarnings,
  calculateXPPreview,
  suggestTags,
  type ValidationResult,
  type ContentWarning,
} from "@/utils/inkValidation"
import InkValidationFeedback from "@/components/InkValidationFeedback"
import ReadyToInkModal from "@/components/ReadyToInkModal"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { detectInkType } from "@/utils/detectInkType"
import { generateRandomInkId } from "@/utils/random-ink-id"
import { calculateReadingTime } from "@/utils/reading-time"

const MOODS = [
  { value: "inspiring", label: "Inspiring", color: "bg-green-100 text-green-800" },
  { value: "dreamy", label: "Dreamy", color: "bg-purple-100 text-purple-800" },
  { value: "witty", label: "Witty", color: "bg-yellow-100 text-yellow-800" },
  { value: "curious", label: "Curious", color: "bg-blue-100 text-blue-800" },
  { value: "honest", label: "Honest", color: "bg-orange-100 text-orange-800" },
  { value: "reflective", label: "Reflective", color: "bg-gray-100 text-gray-800" },
]

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public", icon: Globe, description: "Anyone can see this ink" },
  { value: "followers", label: "Followers", icon: Users, description: "Only your followers can see this ink" },
  { value: "private", label: "Private", icon: Lock, description: "Only you can see this ink" },
]

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

const ACHIEVEMENTS = [
  { id: "first_ink", name: "First Ink", description: "Published your first ink", icon: "🖋️", unlocked: false },
  { id: "wordsmith", name: "Wordsmith", description: "Wrote 1000+ words across all inks", icon: "✍️", unlocked: false },
  { id: "tag_master", name: "Tag Master", description: "Used 50+ unique tags", icon: "🏷️", unlocked: false },
  {
    id: "vibe_creator",
    name: "Vibe Creator",
    description: "Published inks with 5+ different themes",
    icon: "🎨",
    unlocked: false,
  },
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

const MAX_CHARACTERS = 5000
const MIN_CHARACTERS = 15
const MAX_TAGS = 2

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

// Add a type for Achievement
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

// Change inputWarning type
type InputWarningType = React.ReactNode | null

export default function CreatePage() {
  const router = useRouter()
  const { playSound } = useSoundEffects()

  // Form state
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [mood, setMood] = useState("")
  const [visibility, setVisibility] = useState("public")

  // Validation state
  const [contentValidation, setContentValidation] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    score: 0,
  })
  const [tagsValidation, setTagsValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    score: 100,
  })
  const [contentWarnings, setContentWarnings] = useState<ContentWarning[]>([])
  const [xpPreview, setXpPreview] = useState(0)

  // UI state
  const [showReadyModal, setShowReadyModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [isDraftSaved, setIsDraftSaved] = useState(false)

  // Auto-save draft
  const saveDraft = useCallback(() => {
    if (content.trim() || tags.length > 0) {
      localStorage.setItem(
        "inkly-draft",
        JSON.stringify({
          content,
          tags,
          mood,
          visibility,
          timestamp: Date.now(),
        }),
      )
      setIsDraftSaved(true)
      setTimeout(() => setIsDraftSaved(false), 2000)
    }
  }, [content, tags, mood, visibility])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("inkly-draft")
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        // Only load if draft is less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setContent(parsed.content || "")
          setTags(parsed.tags || [])
          setMood(parsed.mood || "")
          setVisibility(parsed.visibility || "public")
        }
      } catch (error) {
        console.error("Failed to load draft:", error)
      }
    }

    // Load user preferences
    const savedVisibility = localStorage.getItem("inkly-default-visibility")
    if (savedVisibility) {
      setVisibility(savedVisibility)
    }
  }, [])

  // Auto-save draft on blur/change (debounced)
  useEffect(() => {
    const timer = setTimeout(saveDraft, 2000)
    return () => clearTimeout(timer)
  }, [saveDraft])

  // Validate content in real-time
  useEffect(() => {
    const validation = validateTextContent(content)
    setContentValidation(validation)

    const warnings = detectContentWarnings(content)
    setContentWarnings(warnings)

    const xp = calculateXPPreview(content, tags)
    setXpPreview(xp)

    // Auto-suggest tags based on content
    if (content.length > 50) {
      const suggestions = suggestTags(content).filter((tag) => !tags.includes(tag))
      setSuggestedTags(suggestions.slice(0, 3))
    } else {
      setSuggestedTags([])
    }
  }, [content, tags])

  // Validate tags
  useEffect(() => {
    const validation = validateTags(tags)
    setTagsValidation(validation)
  }, [tags])

  // Handle tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput.trim())
    }
  }

  const addTag = (tagText: string) => {
    if (!tagText) return

    const cleanedTags = cleanTags([...tags, tagText])
    if (cleanedTags.length <= 2 && !tags.includes(tagText.toLowerCase())) {
      setTags(cleanedTags)
      setTagInput("")
      playSound("click")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    playSound("click")
  }

  const handleSubmit = async () => {
    if (!contentValidation.isValid) {
      playSound("error")
      return
    }

    setShowReadyModal(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const detectedType = detectInkType(content)
      const readingTime = calculateReadingTime(content)

      const newInk = {
        id: generateRandomInkId(),
        content: content.trim(),
        author: "You", // Would be actual user name
        username: "you",
        createdAt: new Date().toISOString(),
        readingTime: readingTime.text,
        views: "0",
        tags: tags,
        mood: mood || undefined,
        type: detectedType || undefined,
      }

      // Save to localStorage (would be API call in real app)
      const existingInks = JSON.parse(localStorage.getItem("inkly-inks") || "[]")
      existingInks.unshift(newInk)
      localStorage.setItem("inkly-inks", JSON.stringify(existingInks))

      // Clear draft
      localStorage.removeItem("inkly-draft")

      // Save user preferences
      localStorage.setItem("inkly-default-visibility", visibility)

      playSound("success")
      router.push(`/ink/${newInk.id}`)
    } catch (error) {
      console.error("Failed to create ink:", error)
      playSound("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = contentValidation.isValid && tagsValidation.isValid

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Create New Ink</h1>
                <p className="text-muted-foreground mt-1">Share your thoughts with the world</p>
              </div>

              {isDraftSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-sm text-green-600"
                >
                  <Save className="w-4 h-4" />
                  Draft saved
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Content Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Your Ink
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="What's on your mind? Share a thought, poem, quote, or story..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[200px] text-lg leading-relaxed resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        maxLength={5000}
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{content.length}/5000 characters</span>
                        {content.length >= 15 && (
                          <span className="text-green-600">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Minimum length reached
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Validation Feedback */}
                    <InkValidationFeedback
                      validation={contentValidation}
                      warnings={contentWarnings}
                      xpPreview={xpPreview}
                    />
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      Tags (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                              aria-label={`Remove ${tag} tag`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      {tags.length < 2 && (
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          onBlur={() => addTag(tagInput.trim())}
                          maxLength={20}
                        />
                      )}

                      <p className="text-xs text-muted-foreground">
                        {tags.length}/2 tags used. Press Enter or comma to add.
                      </p>
                    </div>

                    {/* Suggested Tags */}
                    {suggestedTags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="w-4 h-4" />
                          Suggested tags:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestedTags.map((tag) => (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(tag)}
                              className="h-auto py-1 px-2 text-xs"
                            >
                              #{tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Mood Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mood</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {MOODS.map((moodOption) => (
                        <Button
                          key={moodOption.value}
                          variant={mood === moodOption.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMood(mood === moodOption.value ? "" : moodOption.value)}
                          className="justify-start h-auto py-2"
                        >
                          {moodOption.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Visibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger>
                        <SelectValue />
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
                  </CardContent>
                </Card>

                {/* XP Preview */}
                {isFormValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">You'll earn</span>
                          </div>
                          <Badge className="bg-purple-600 text-white">+{xpPreview} XP</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                >
                  {isSubmitting ? (
                    <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      Creating...
                    </motion.div>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview & Publish
                    </>
                  )}
                </Button>

                {!isFormValid && (
                  <div className="text-sm text-muted-foreground text-center">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Please fix the issues above to continue
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Ready to Ink Modal */}
      <ReadyToInkModal
        open={showReadyModal}
        onClose={() => setShowReadyModal(false)}
        onConfirm={handleConfirmSubmit}
        inkData={{
          content,
          tags,
          mood,
          type: detectInkType(content),
          visibility,
        }}
        xpPreview={xpPreview}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
