"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Palette,
  Settings,
  Eye,
  Bell,
  Shield,
  Moon,
  Sun,
  User,
  AtSign,
  Sparkles,
  Chrome,
  SkipBackIcon as Skip,
  AlertCircle,
  Calendar,
  UserPlus,
  Users,
  Crown,
  Verified,
  Heart,
  ExternalLink,
} from "lucide-react"
import { Logo } from "./components/logo"
import { AnimatedButton } from "./components/animated-button"
import { TopicCard } from "./components/topic-card"
import { EnhancedEmailSignupForm } from "./components/enhanced-email-signup-form"
import { EnhancedLoginForm } from "./components/enhanced-login-form"
import { DatePicker } from "./components/date-picker"
import { ConfettiCelebration } from "./components/confetti-celebration"
import { ResponsiveContainer } from "./components/responsive-container"
import { FormField } from "./components/form-field"
import { LoadingSpinner } from "./components/loading-spinner"
import { OnboardingProvider, useOnboarding } from "./contexts/onboarding-context"
import { useFormValidation } from "./hooks/use-form-validation"
import { validateUsername, validateDisplayName } from "./lib/validation"
import { cn } from "@/lib/utils"
import { useCallback, useEffect } from "react"

const topics = [
  { id: "poetry", name: "Short Poems", description: "Express in verses" },
  { id: "tales", name: "Dank Tales", description: "Quirky stories" },
  { id: "wisdom", name: "Wisdom", description: "Life insights" },
  { id: "thoughts", name: "Thoughts", description: "Random musings" },
  { id: "quotes", name: "Quotes", description: "Inspiring words" },
  { id: "dialogues", name: "Dialogues", description: "Conversations" },
  { id: "humor", name: "Humor", description: "Funny content" },
  { id: "philosophy", name: "Philosophy", description: "Deep thinking" },
  { id: "creativity", name: "Creativity", description: "Artistic expression" },
  { id: "motivation", name: "Motivation", description: "Uplifting content" },
  { id: "lifestyle", name: "Lifestyle", description: "Daily experiences" },
  { id: "relationships", name: "Relationships", description: "Human connections" },
  { id: "dreams", name: "Dreams", description: "Aspirations & visions" },
  { id: "nature", name: "Nature", description: "Natural world" },
  { id: "music", name: "Music", description: "Musical thoughts" },
]

const suggestedUsers = [
  {
    id: "inkly_official",
    name: "Inkly Official",
    username: "inkly",
    bio: "Welcome to Inkly! Your platform for creative expression.",
    followers: "1.2M",
    isOfficial: true,
    mustFollow: true,
    avatar: "IO",
  },
  {
    id: "aniket_owner",
    name: "Aniket",
    username: "aniket",
    bio: "Founder & CEO of Inkly. Building the future of expression.",
    followers: "45.2K",
    isOwner: true,
    mustFollow: true,
    avatar: "AN",
  },
  {
    id: "creative_minds",
    name: "Creative Minds",
    username: "creativeminds",
    bio: "Daily inspiration for creative souls ✨",
    followers: "89.1K",
    isOfficial: false,
    mustFollow: false,
    avatar: "CM",
  },
  {
    id: "poetry_corner",
    name: "Poetry Corner",
    username: "poetrycorner",
    bio: "Where words dance and emotions flow 📝",
    followers: "156.3K",
    isOfficial: false,
    mustFollow: false,
    avatar: "PC",
  },
  {
    id: "wisdom_daily",
    name: "Daily Wisdom",
    username: "wisdomdaily",
    bio: "Life lessons and thoughtful insights every day",
    followers: "203.7K",
    isOfficial: false,
    mustFollow: false,
    avatar: "DW",
  },
  {
    id: "art_vibes",
    name: "Art Vibes",
    username: "artvibes",
    bio: "Celebrating creativity in all its forms 🎨",
    followers: "78.9K",
    isOfficial: false,
    mustFollow: false,
    avatar: "AV",
  },
  {
    id: "mindful_thoughts",
    name: "Mindful Thoughts",
    username: "mindfulthoughts",
    bio: "Mindfulness and mental wellness content",
    followers: "134.5K",
    isOfficial: false,
    mustFollow: false,
    avatar: "MT",
  },
  {
    id: "story_tellers",
    name: "Story Tellers",
    username: "storytellers",
    bio: "Sharing stories that touch the heart ❤️",
    followers: "92.4K",
    isOfficial: false,
    mustFollow: false,
    avatar: "ST",
  },
]

const validationRules = [
  {
    field: "displayName" as const,
    validator: (value: string) => validateDisplayName(value),
  },
  {
    field: "username" as const,
    validator: (value: string) => validateUsername(value),
  },
]

function InklyOnboardingContent() {
  const { state, dispatch } = useOnboarding()
  const { currentStep, userData, showEmailForm, showLoginForm, showCelebration, isLoading } = state

  const {
    data: formData,
    errors: formErrors,
    touched,
    updateField,
    touchField,
    validateAll,
    resetForm,
  } = useFormValidation({ displayName: "", username: "" }, validationRules)

  // Sync form data with context when userData changes (only once when initialized)
  useEffect(() => {
    if (
      state.isInitialized &&
      (userData.displayName !== formData.displayName || userData.username !== formData.username)
    ) {
      resetForm({ displayName: userData.displayName, username: userData.username })
    }
  }, [state.isInitialized, userData.displayName, userData.username, formData.displayName, formData.username, resetForm])

  const updateUserData = useCallback(
    (updates: Partial<typeof userData>) => {
      dispatch({ type: "UPDATE_USER_DATA", payload: updates })
    },
    [dispatch],
  )

  const nextStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: Math.min(currentStep + 1, 8) })
  }, [dispatch, currentStep])

  const prevStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: Math.max(currentStep - 1, 1) })
  }, [dispatch, currentStep])

  const handleGoogleSignIn = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true })
    setTimeout(() => {
      alert("Google sign-in integration would be implemented here")
      dispatch({ type: "SET_LOADING", payload: false })
    }, 1500)
  }, [dispatch])

  const handleLogin = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert(`Login successful for ${email}${rememberMe ? " (remembered)" : ""}`)
  }, [])

  const handleEmailSubmit = useCallback(
    async (email: string) => {
      updateUserData({ email })
      dispatch({ type: "SET_SHOW_EMAIL_FORM", payload: false })
      nextStep()
    },
    [updateUserData, dispatch, nextStep],
  )

  const handleForgotPassword = useCallback(() => {
    alert("Password reset functionality would be implemented here")
  }, [])

  const toggleTopic = useCallback(
    (topicId: string) => {
      const newTopics = userData.selectedTopics.includes(topicId)
        ? userData.selectedTopics.filter((id) => id !== topicId)
        : [...userData.selectedTopics, topicId]
      updateUserData({ selectedTopics: newTopics })
    },
    [userData.selectedTopics, updateUserData],
  )

  const toggleFollowUser = useCallback(
    (userId: string) => {
      const user = suggestedUsers.find((u) => u.id === userId)
      if (user?.mustFollow) return

      const newFollowedUsers = userData.followedUsers.includes(userId)
        ? userData.followedUsers.filter((id) => id !== userId)
        : [...userData.followedUsers, userId]
      updateUserData({ followedUsers: newFollowedUsers })
    },
    [userData.followedUsers, updateUserData],
  )

  const generateInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const validateStep = useCallback(
    (step: number): boolean => {
      if (step === 2) {
        return validateAll()
      }

      if (step === 3) {
        if (!userData.birthDate) {
          dispatch({ type: "SET_ERRORS", payload: { birthDate: "Birth date is required" } })
          return false
        }
      }

      if (step === 6) {
        if (userData.followedUsers.length < 5) {
          dispatch({ type: "SET_ERRORS", payload: { followedUsers: "Please follow at least 5 accounts to continue" } })
          return false
        }
      }

      dispatch({ type: "CLEAR_ERRORS" })
      return true
    },
    [validateAll, userData.birthDate, userData.followedUsers.length, dispatch],
  )

  const AvatarPreview = ({ style, initials }: { style: "minimal" | "abstract"; initials: string }) => (
    <div
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-110",
        style === "minimal"
          ? "bg-gradient-to-br from-purple-600 to-purple-500"
          : "bg-gradient-to-br from-orange-400 via-red-500 to-purple-600",
      )}
    >
      {initials || "IN"}
    </div>
  )

  const UserCard = ({ user }: { user: (typeof suggestedUsers)[0] }) => {
    const isFollowed = userData.followedUsers.includes(user.id)

    return (
      <div
        className={cn(
          "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md cursor-pointer",
          isFollowed
            ? "border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50"
            : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50",
        )}
        onClick={() => toggleFollowUser(user.id)}
      >
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm",
              user.isOfficial
                ? "bg-gradient-to-br from-purple-600 to-purple-500"
                : user.isOwner
                  ? "bg-gradient-to-br from-orange-500 to-red-500"
                  : "bg-gradient-to-br from-gray-500 to-gray-600",
            )}
          >
            {user.avatar}
          </div>
          {(user.isOfficial || user.isOwner) && (
            <div className="absolute -top-1 -right-1">
              {user.isOfficial ? (
                <Verified className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 fill-current" />
              ) : (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm sm:text-base truncate">{user.name}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">@{user.username}</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
          <p className="text-xs text-gray-500 mt-1">{user.followers} followers</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isFollowed && (
            <div className="flex items-center gap-1 text-purple-600">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            </div>
          )}
          <AnimatedButton
            size="sm"
            variant={isFollowed ? "default" : "outline"}
            disabled={user.mustFollow && isFollowed}
            className={cn(
              "text-xs sm:text-sm min-w-[70px] sm:min-w-[80px]",
              isFollowed
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "border-purple-300 text-purple-600 hover:bg-purple-50",
              user.mustFollow && isFollowed && "opacity-75 cursor-not-allowed",
            )}
            onClick={(e) => {
              e.stopPropagation()
              toggleFollowUser(user.id)
            }}
          >
            {isFollowed ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Following</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3 mr-1" />
                Follow
              </>
            )}
          </AnimatedButton>
        </div>
      </div>
    )
  }

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4 sm:mb-6 overflow-hidden">
      <div
        className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out relative"
        style={{ width: `${(currentStep / 8) * 100}%` }}
      >
        <div className="absolute inset-0 bg-white/30 animate-pulse" />
      </div>
    </div>
  )

  const isDarkMode = userData.themeMode === "dark"

  // Don't render until initialized
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show celebration screen
  if (showCelebration) {
    return <ConfettiCelebration onComplete={() => alert("Welcome to Inkly! 🎉")} />
  }

  // Screen 1: Welcome
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-40 w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

          {/* Additional floating elements */}
          <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400 rounded-full animate-float animation-delay-300" />
          <div className="absolute bottom-32 right-32 w-3 h-3 bg-pink-400 rounded-full animate-float animation-delay-700" />
          <div className="absolute top-1/3 left-20 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-1000" />
        </div>

        <ResponsiveContainer maxWidth="lg" className="text-center relative z-10">
          <div className="space-y-8 sm:space-y-12 animate-fade-in">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-center animate-float">
                <Logo size="lg" />
              </div>
            </div>

            <div className="space-y-8 sm:space-y-10 animate-slide-up animation-delay-500">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-display leading-tight text-shadow">
                  <span className="text-gradient-secondary">Your</span>{" "}
                  <span className="highlight-text-alt text-gray-800 font-black">thoughts</span>,{" "}
                  <span className="text-gradient font-black">your</span>{" "}
                  <span className="highlight-text text-gray-800 font-black">vibe</span>,{" "}
                  <span className="text-gradient-secondary">your</span>
                  <br className="hidden sm:block" />
                  <span className="text-gradient font-black tracking-tight">voice</span>.
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium text-shadow-sm">
                  Start expressing yourself with a platform designed for{" "}
                  <span className="text-purple-700 font-semibold">your unique perspective</span>.
                </p>
              </div>

              {showLoginForm ? (
                <div className="glass-effect rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                  <EnhancedLoginForm
                    onLogin={handleLogin}
                    onGoogleLogin={handleGoogleSignIn}
                    onBack={() => dispatch({ type: "SET_SHOW_LOGIN_FORM", payload: false })}
                    onForgotPassword={handleForgotPassword}
                  />
                </div>
              ) : !showEmailForm ? (
                <div className="space-y-4 sm:space-y-5 max-w-sm mx-auto">
                  <AnimatedButton
                    className="w-full glass-effect text-gray-800 border-0 hover:bg-white/90 hover:shadow-2xl text-sm sm:text-base font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" className="mr-3" /> : <Chrome className="w-5 h-5 mr-3" />}
                    Continue with Google
                  </AnimatedButton>

                  <AnimatedButton
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 text-white text-sm sm:text-base font-semibold py-3 sm:py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-glow"
                    onClick={() => dispatch({ type: "SET_SHOW_EMAIL_FORM", payload: true })}
                    disabled={isLoading}
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                    Sign up with Email
                  </AnimatedButton>

                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Already here?{" "}
                    <button
                      onClick={() => dispatch({ type: "SET_SHOW_LOGIN_FORM", payload: true })}
                      disabled={isLoading}
                      className="text-purple-600 hover:text-purple-700 underline underline-offset-2 transition-colors duration-200 font-semibold disabled:opacity-50"
                    >
                      Login
                    </button>
                  </p>
                </div>
              ) : (
                <div className="glass-effect rounded-2xl p-6 sm:p-8 max-w-md mx-auto space-y-6">
                  <EnhancedEmailSignupForm onSubmit={handleEmailSubmit} />
                  <button
                    onClick={() => dispatch({ type: "SET_SHOW_EMAIL_FORM", payload: false })}
                    disabled={isLoading}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    ← Back to options
                  </button>
                </div>
              )}

              {/* Enhanced Terms and Conditions */}
              <div className="text-xs sm:text-sm text-gray-500 space-y-2 max-w-md mx-auto">
                <p className="leading-relaxed">
                  By continuing, you agree to our{" "}
                  <button className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium inline-flex items-center gap-1 transition-colors">
                    Terms of Service
                    <ExternalLink className="w-3 h-3" />
                  </button>{" "}
                  and{" "}
                  <button className="text-purple-600 hover:text-purple-700 underline underline-offset-2 font-medium inline-flex items-center gap-1 transition-colors">
                    Privacy Policy
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 2: User Details
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-3 sm:px-4 lg:px-6">
        <ResponsiveContainer maxWidth="md" className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-gray-800 leading-tight">
                  What should we <span className="text-gradient">call you</span>?
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  This is how you'll appear on your{" "}
                  <span className="highlight-text font-semibold text-gray-700">thoughts</span>,{" "}
                  <span className="highlight-text-alt font-semibold text-gray-700">likes</span> and{" "}
                  <span className="highlight-text font-semibold text-gray-700">shares</span>
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full">
              <FormField
                id="displayName"
                label="Display Name"
                icon={<User className="w-5 h-5" />}
                placeholder="Your display name"
                value={formData.displayName}
                onChange={(value) => {
                  updateField("displayName", value)
                  updateUserData({
                    displayName: value,
                    initials: generateInitials(value),
                  })
                }}
                onBlur={() => touchField("displayName")}
                error={touched.displayName ? formErrors.displayName : undefined}
                maxLength={25}
                showCounter
                required
                className="text-sm sm:text-base w-full"
              />

              <FormField
                id="username"
                label="Username"
                icon={<AtSign className="w-5 h-5" />}
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(value) => {
                  const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                  updateField("username", cleanValue)
                  updateUserData({ username: cleanValue })
                }}
                onBlur={() => touchField("username")}
                error={touched.username ? formErrors.username : undefined}
                maxLength={15}
                showCounter
                required
                className="text-sm sm:text-base w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <AnimatedButton
                variant="outline"
                onClick={prevStep}
                className="flex-1 glass-effect border-0 text-gray-700 hover:bg-white/90 order-2 sm:order-1 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  if (validateStep(2)) {
                    nextStep()
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 order-1 sm:order-2 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-xl"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 3: Age/Birth Date
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <ResponsiveContainer maxWidth="md">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-2">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-purple-500 mb-3" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">When were you born?</h2>
              <p className="text-sm text-gray-600">This helps us provide age-appropriate content</p>
            </div>

            <div className="space-y-4">
              <DatePicker
                value={userData.birthDate}
                onChange={(date) => {
                  updateUserData({ birthDate: date })
                  dispatch({ type: "CLEAR_ERRORS" })
                }}
                error={state.errors.birthDate}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton variant="outline" onClick={prevStep} className="flex-1 bg-transparent order-2 sm:order-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  if (validateStep(3)) {
                    nextStep()
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 order-1 sm:order-2"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 4: Choose Your Vibe
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <ResponsiveContainer maxWidth="4xl">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-2">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-purple-500 mb-3" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Choose your vibe</h2>
              <p className="text-sm text-gray-600">Pick topics that match your personality</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {topics.map((topic, index) => (
                <div key={topic.id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
                  <TopicCard
                    topic={topic}
                    isSelected={userData.selectedTopics.includes(topic.id)}
                    onClick={() => toggleTopic(topic.id)}
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span className="font-medium">Selected: {userData.selectedTopics.length} topics</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton variant="outline" onClick={prevStep} className="flex-1 bg-transparent order-3 sm:order-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                onClick={nextStep}
                className="flex-1 bg-transparent text-gray-600 hover:text-gray-800 order-2"
              >
                <Skip className="w-4 h-4 mr-2" />
                Skip
              </AnimatedButton>
              <AnimatedButton
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 order-1 sm:order-3"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 5: Personalize Yourself
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <ResponsiveContainer maxWidth="md">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-2">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-purple-500 mb-3" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Personalize yourself</h2>
              <p className="text-sm text-gray-600">How do you want to look?</p>
            </div>

            <div className="space-y-5">
              <div className="text-center">
                <h3 className="font-medium mb-4 text-sm">Choose avatar style</h3>
                <div className="flex justify-center gap-4 sm:gap-6">
                  <div
                    className={cn(
                      "cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105",
                      userData.avatarStyle === "minimal"
                        ? "border-purple-500 bg-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                    )}
                    onClick={() => updateUserData({ avatarStyle: "minimal" })}
                  >
                    <AvatarPreview style="minimal" initials={userData.initials} />
                    <p className="text-sm mt-2 font-medium">Minimal</p>
                    <p className="text-xs text-gray-500">Clean & simple</p>
                  </div>
                  <div
                    className={cn(
                      "cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105",
                      userData.avatarStyle === "abstract"
                        ? "border-purple-500 bg-purple-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                    )}
                    onClick={() => updateUserData({ avatarStyle: "abstract" })}
                  >
                    <AvatarPreview style="abstract" initials={userData.initials} />
                    <p className="text-sm mt-2 font-medium">Abstract</p>
                    <p className="text-xs text-gray-500">Colorful & vibrant</p>
                  </div>
                </div>
              </div>

              <Card className="bg-white border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors duration-300">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    Preview
                  </h4>
                  <div className="flex items-center gap-3">
                    <AvatarPreview style={userData.avatarStyle} initials={userData.initials} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{userData.displayName}</p>
                      <p className="text-xs sm:text-sm text-gray-500">@{userData.username}</p>
                      <div className="flex gap-1 mt-1">
                        {userData.selectedTopics.slice(0, 2).map((topicId) => {
                          const topic = topics.find((t) => t.id === topicId)
                          return (
                            <Badge key={topicId} variant="secondary" className="text-xs px-1.5 py-0.5">
                              {topic?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton variant="outline" onClick={prevStep} className="flex-1 bg-transparent order-3 sm:order-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                onClick={nextStep}
                className="flex-1 bg-transparent text-gray-600 hover:text-gray-800 order-2"
              >
                <Skip className="w-4 h-4 mr-2" />
                Skip
              </AnimatedButton>
              <AnimatedButton
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 order-1 sm:order-3"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 6: Follow Users
  if (currentStep === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <ResponsiveContainer maxWidth="2xl">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Discover amazing creators</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                Follow creators who inspire you to build your personalized feed. You need to follow at least 5 accounts.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
              {suggestedUsers.map((user, index) => (
                <div key={user.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <UserCard user={user} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <div
                className={cn(
                  "inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm border text-sm sm:text-base font-medium",
                  userData.followedUsers.length >= 5
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white border-gray-200 text-gray-600",
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold",
                    userData.followedUsers.length >= 5 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600",
                  )}
                >
                  {userData.followedUsers.length}
                </div>
                <span className="text-xs sm:text-base">
                  {userData.followedUsers.length >= 5
                    ? `Following ${userData.followedUsers.length} accounts - Ready to continue!`
                    : `${5 - userData.followedUsers.length} more to go`}
                </span>
                {userData.followedUsers.length >= 5 && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              {state.errors.followedUsers && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm mt-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {state.errors.followedUsers}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton variant="outline" onClick={prevStep} className="flex-1 bg-transparent order-2 sm:order-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={() => {
                  if (validateStep(6)) {
                    nextStep()
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 order-1 sm:order-2"
                disabled={userData.followedUsers.length < 5}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 7: Set Your Mood
  if (currentStep === 7) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center transition-all duration-500",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800"
            : "bg-gradient-to-br from-purple-50 to-pink-50",
        )}
      >
        <ResponsiveContainer maxWidth="md">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-2">
              <Settings
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3",
                  isDarkMode ? "text-purple-400" : "text-purple-500",
                )}
              />
              <h2 className={cn("text-lg sm:text-xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>
                Set your mood
              </h2>
              <p className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                Customize how Inkly works for you
              </p>
            </div>

            <Card
              className={cn(
                "border-0 shadow-lg transition-all duration-500",
                isDarkMode ? "bg-gray-800 shadow-purple-900/20" : "bg-white",
              )}
            >
              <CardContent className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg group-hover:scale-105 transition-all duration-200",
                        isDarkMode ? "bg-purple-900/50" : "bg-purple-100",
                      )}
                    >
                      {userData.themeMode === "light" ? (
                        <Sun className={cn("w-4 h-4", isDarkMode ? "text-purple-400" : "text-purple-600")} />
                      ) : (
                        <Moon className={cn("w-4 h-4", isDarkMode ? "text-purple-400" : "text-purple-600")} />
                      )}
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", isDarkMode ? "text-white" : "text-gray-800")}>
                        Theme Mode
                      </p>
                      <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Choose your preferred theme
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AnimatedButton
                      variant={userData.themeMode === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateUserData({ themeMode: "light" })}
                      className={cn(
                        userData.themeMode === "light"
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                          : isDarkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "",
                      )}
                    >
                      <Sun className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Light</span>
                    </AnimatedButton>
                    <AnimatedButton
                      variant={userData.themeMode === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateUserData({ themeMode: "dark" })}
                      className={cn(
                        userData.themeMode === "dark"
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                          : isDarkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "",
                      )}
                    >
                      <Moon className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Dark</span>
                    </AnimatedButton>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg group-hover:scale-105 transition-all duration-200",
                        isDarkMode ? "bg-purple-900/50" : "bg-purple-100",
                      )}
                    >
                      <Shield className={cn("w-4 h-4", isDarkMode ? "text-purple-400" : "text-purple-600")} />
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", isDarkMode ? "text-white" : "text-gray-800")}>
                        Content Filter
                      </p>
                      <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Filter sensitive content
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={userData.contentFilter}
                    onCheckedChange={(checked) => updateUserData({ contentFilter: checked })}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg group-hover:scale-105 transition-all duration-200",
                        isDarkMode ? "bg-purple-900/50" : "bg-purple-100",
                      )}
                    >
                      <Bell className={cn("w-4 h-4", isDarkMode ? "text-purple-400" : "text-purple-600")} />
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", isDarkMode ? "text-white" : "text-gray-800")}>
                        Notifications
                      </p>
                      <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Get notified about activity
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={userData.notifications}
                    onCheckedChange={(checked) => updateUserData({ notifications: checked })}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton
                variant="outline"
                onClick={prevStep}
                className={cn(
                  "flex-1 bg-transparent order-2 sm:order-1",
                  isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "",
                )}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 order-1 sm:order-2"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  // Screen 8: You're Ready
  if (currentStep === 8) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center transition-all duration-500",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800"
            : "bg-gradient-to-br from-purple-50 to-pink-50",
        )}
      >
        <ResponsiveContainer maxWidth="md">
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <ProgressBar />

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full mx-auto animate-ping opacity-20" />
              </div>
              <h2 className={cn("text-lg sm:text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>
                You're ready!
              </h2>
              <p className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-600")}>Here's what you've set up</p>
            </div>

            <Card
              className={cn(
                "border-0 shadow-xl transition-all duration-500",
                isDarkMode ? "bg-gray-800 shadow-purple-900/20" : "bg-white",
              )}
            >
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div
                  className={cn(
                    "flex items-center gap-3 pb-3 border-b",
                    isDarkMode ? "border-gray-700" : "border-gray-100",
                  )}
                >
                  <AvatarPreview style={userData.avatarStyle} initials={userData.initials} />
                  <div className="flex-1">
                    <p
                      className={cn("font-semibold text-sm sm:text-base", isDarkMode ? "text-white" : "text-gray-800")}
                    >
                      {userData.displayName}
                    </p>
                    <p className={cn("text-xs sm:text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      @{userData.username}
                    </p>
                  </div>
                  <Logo size="xs" showText={false} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>Following</span>
                    <span className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-800")}>
                      {userData.followedUsers.length} accounts
                    </span>
                  </div>

                  {userData.selectedTopics.length > 0 && (
                    <div>
                      <p
                        className={cn(
                          "font-medium mb-2 flex items-center gap-2 text-sm",
                          isDarkMode ? "text-white" : "text-gray-800",
                        )}
                      >
                        <Sparkles className="w-4 h-4" />
                        Your vibes ({userData.selectedTopics.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {userData.selectedTopics.slice(0, 6).map((topicId) => {
                          const topic = topics.find((t) => t.id === topicId)
                          return (
                            <Badge
                              key={topicId}
                              variant="secondary"
                              className={cn(
                                "text-xs px-2 py-0.5 animate-fade-in",
                                isDarkMode ? "bg-gray-700 text-gray-300" : "",
                              )}
                            >
                              {topic?.name}
                            </Badge>
                          )
                        })}
                        {userData.selectedTopics.length > 6 && (
                          <Badge
                            variant="secondary"
                            className={cn("text-xs px-2 py-0.5", isDarkMode ? "bg-gray-700 text-gray-300" : "")}
                          >
                            +{userData.selectedTopics.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {userData.themeMode === "light" ? (
                        <Sun className="w-3 h-3 text-yellow-500" />
                      ) : (
                        <Moon className="w-3 h-3 text-blue-500" />
                      )}
                      <div>
                        <p className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-800")}>Theme</p>
                        <p className={cn("capitalize", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {userData.themeMode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-green-500" />
                      <div>
                        <p className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-800")}>Content Filter</p>
                        <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {userData.contentFilter ? "On" : "Off"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <AnimatedButton
                variant="outline"
                onClick={prevStep}
                className={cn(
                  "flex-1 bg-transparent order-2 sm:order-1",
                  isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "",
                )}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </AnimatedButton>
              <AnimatedButton
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 py-3 order-1 sm:order-2"
                onClick={() => dispatch({ type: "SET_SHOW_CELEBRATION", payload: true })}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Expressing
              </AnimatedButton>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}

export default function InklyOnboarding() {
  return (
    <OnboardingProvider>
      <InklyOnboardingContent />
    </OnboardingProvider>
  )
}
