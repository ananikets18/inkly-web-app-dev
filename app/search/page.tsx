"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Mic, Filter, Sparkles, Heart, Bookmark, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { formatCount } from "@/utils/formatCount"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"

// Mock data for search results
const mockInks = [
  {
    id: 1,
    content: "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten existed.",
    author: "Luna Martinez",
    avatarColor: "from-purple-500 to-pink-500",
    mood: "Dreamy",
    theme: "Self-Discovery",
    style: "Poetic",
    reactions: { love: 234, like: 156, bookmark: 89 },
    views: 1200,
    readingTime: "1 min",
    tags: ["#moonlight", "#soul", "#poetry"],
    height: 280,
  },
  {
    id: 2,
    content: "Sometimes the bravest thing you can do is let yourself be soft in a world that rewards hardness.",
    author: "Maya Chen",
    avatarColor: "from-blue-500 to-cyan-500",
    mood: "Uplifting",
    theme: "Growth",
    style: "Minimal",
    reactions: { love: 445, like: 289, bookmark: 167 },
    views: 2100,
    readingTime: "30 sec",
    tags: ["#courage", "#softness", "#growth"],
    height: 240,
  },
  {
    id: 3,
    content:
      "I collect sunsets like other people collect stamps. Each one unique, each one a reminder that endings can be beautiful too.",
    author: "River Thompson",
    avatarColor: "from-orange-500 to-red-500",
    mood: "Melancholic",
    theme: "Beauty",
    style: "Poetic",
    reactions: { love: 678, like: 423, bookmark: 234 },
    views: 3400,
    readingTime: "1 min",
    tags: ["#sunsets", "#beauty", "#endings"],
    height: 320,
  },
  {
    id: 4,
    content:
      "Your healing is not linear. It's a spiral staircase where you revisit the same views from higher perspectives.",
    author: "Sage Williams",
    avatarColor: "from-green-500 to-teal-500",
    mood: "Healing",
    theme: "Growth",
    style: "Wisdom",
    reactions: { love: 892, like: 567, bookmark: 345 },
    views: 4200,
    readingTime: "45 sec",
    tags: ["#healing", "#growth", "#perspective"],
    height: 260,
  },
  {
    id: 5,
    content: "Love is not about finding someone to complete you, but finding someone who accepts your completeness.",
    author: "Phoenix Lee",
    avatarColor: "from-pink-500 to-rose-500",
    mood: "Romantic",
    theme: "Love",
    style: "Minimal",
    reactions: { love: 1234, like: 789, bookmark: 456 },
    views: 5600,
    readingTime: "30 sec",
    tags: ["#love", "#completeness", "#acceptance"],
    height: 220,
  },
  {
    id: 6,
    content: "The stars don't compete with each other; they simply shine. Maybe that's the secret to happiness.",
    author: "Cosmic Ray",
    avatarColor: "from-indigo-500 to-purple-500",
    mood: "Peaceful",
    theme: "Wisdom",
    style: "Metaphorical",
    reactions: { love: 567, like: 345, bookmark: 123 },
    views: 2800,
    readingTime: "30 sec",
    tags: ["#stars", "#happiness", "#wisdom"],
    height: 200,
  },
]

const filterCategories = {
  mood: ["Uplifting", "Melancholic", "Dreamy", "Peaceful", "Romantic", "Healing"],
  theme: ["Love", "Growth", "Beauty", "Wisdom", "Self-Discovery", "Healing"],
  style: ["Minimal", "Poetic", "Metaphorical", "Wisdom", "Raw", "Elegant"],
}

const sortOptions = [
  { value: "echoed", label: "Most Echoed" },
  { value: "newest", label: "Newest" },
  { value: "impact", label: "Hit Me Hard" },
]

const searchPrompts = [
  "How do I find peace in chaos?",
  "Words for a broken heart",
  "Motivation for Monday morning",
  "Something about growing up",
  "Love that feels like home",
]

const placeholderTexts = [
  "What are you feeling today?",
  "Search your soul...",
  "What speaks to your heart?",
  "Find your vibe...",
  "Discover your mood...",
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    mood: [],
    theme: [],
    style: [],
  })
  const [sortBy, setSortBy] = useState("echoed")
  const [results, setResults] = useState(mockInks)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Animate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Perform search when query changes
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  // Get ambient background based on selected mood
  const getAmbientBackground = () => {
    const selectedMood = selectedFilters.mood[0]
    switch (selectedMood) {
      case "Uplifting":
        return "bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50"
      case "Melancholic":
        return "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      case "Dreamy":
        return "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50"
      case "Peaceful":
        return "bg-gradient-to-br from-green-50 via-teal-50 to-blue-50"
      case "Romantic":
        return "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50"
      case "Healing":
        return "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
      default:
        return "bg-gradient-to-br from-gray-50 via-white to-purple-50"
    }
  }

  const handleFilterToggle = (category: string, filter: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(filter)
        ? prev[category].filter((f) => f !== filter)
        : [...prev[category], filter],
    }))
  }

  const handleVoiceSearch = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setSearchQuery("Something about finding inner peace")
    }, 2000)
  }

  const handleSearch = useCallback((query: string) => {
    setIsLoading(true)
    // Simulate search delay
    setTimeout(() => {
      setResults(
        mockInks.filter(
          (ink) =>
            ink.content.toLowerCase().includes(query.toLowerCase()) ||
            ink.author.toLowerCase().includes(query.toLowerCase()) ||
            ink.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
        ),
      )
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim())
      // Update URL without navigation
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`
      window.history.pushState({}, "", newUrl)
    }
  }

  const InkCard = ({ ink }: { ink: (typeof mockInks)[0] }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
      style={{ height: ink.height }}
    >
      {/* Glassmorphic overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Author info */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <Avatar className="w-8 h-8">
          <AvatarFallback className={`bg-gradient-to-br ${ink.avatarColor} text-white text-sm font-medium`}>
            {ink.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-900">{ink.author}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{ink.readingTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 font-medium leading-relaxed mb-4 relative z-10">{ink.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4 relative z-10">
        {ink.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Mood/Theme badges */}
      <div className="flex gap-2 mb-4 relative z-10">
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">{ink.mood}</Badge>
        <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
          {ink.theme}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{formatCount(ink.reactions.love)}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-purple-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span className="text-xs">{formatCount(ink.reactions.bookmark)}</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Eye className="w-3 h-3" />
          <span className="text-xs">{formatCount(ink.views)}</span>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Side Navigation */}
        <SideNav />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-1000 ${getAmbientBackground()}`}>
          {/* Search Header */}
          <div className="sticky top-[73px] z-20 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Search Bar */}
              <div className="relative mb-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={placeholderTexts[currentPlaceholder]}
                    className="pl-12 pr-16 py-3 text-lg bg-white/70 backdrop-blur-md border-white/30 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-300"
                  />
                  <Button
                    onClick={handleVoiceSearch}
                    size="sm"
                    variant="ghost"
                    type="button"
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-purple-500"}`}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </form>

                {/* Live Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 z-50"
                    >
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600 mb-2">Suggestions</p>
                        {["moonlight soul poetry", "brave softness world", "healing spiral perspective"].map(
                          (suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchQuery(suggestion)
                                setShowSuggestions(false)
                                handleSearch(suggestion)
                              }}
                              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <Search className="inline w-3 h-3 mr-2 text-gray-400" />
                              {suggestion}
                            </button>
                          ),
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filter Chips */}
              <div className="space-y-3">
                {Object.entries(filterCategories).map(([category, filters]) => (
                  <div key={category} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 capitalize min-w-[60px]">{category}:</span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {filters.map((filter) => (
                        <Badge
                          key={filter}
                          variant={selectedFilters[category].includes(filter) ? "default" : "outline"}
                          className={`cursor-pointer whitespace-nowrap transition-all duration-200 ${
                            selectedFilters[category].includes(filter)
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                              : "hover:bg-purple-50 hover:border-purple-300"
                          }`}
                          onClick={() => handleFilterToggle(category, filter)}
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/70 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500/20"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500">{results.length} inks found</p>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {results.map((ink) => (
                  <div key={ink.id} className="break-inside-avoid">
                    <InkCard ink={ink} />
                  </div>
                ))}
              </div>
            ) : (
              /* No Results State */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Nothing found yet</h3>
                  <p className="text-gray-600 mb-8">
                    Didn't find what you're feeling? Create your own ink and share it with the world.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-3">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Your Ink
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Search Prompts */}
            {!searchQuery && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16">
                <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                    Not sure what to search? Try asking...
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {searchPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => {
                          setSearchQuery(prompt)
                          handleSearch(prompt)
                        }}
                        className="bg-white/70 backdrop-blur-md border-white/30 hover:bg-purple-50 hover:border-purple-300 rounded-2xl transition-all duration-200"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
