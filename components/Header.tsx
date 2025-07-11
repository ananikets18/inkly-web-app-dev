"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Plus, Search, UserPlus, Home, Compass, User, HelpCircle, Info, ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/logo"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: User, label: "Profile" },
]

const supportItems = [
  { icon: HelpCircle, label: "Help" },
  { icon: Info, label: "About" },
]

const filterCategories = {
  mood: ["Uplifting", "Melancholic", "Dreamy", "Peaceful", "Romantic", "Healing"],
  theme: ["Love", "Growth", "Beauty", "Wisdom", "Self-Discovery", "Healing"],
  style: ["Minimal", "Poetic", "Metaphorical", "Wisdom", "Raw", "Elegant"],
}

const searchPrompts = [
  "How do I find peace in chaos?",
  "Words for a broken heart",
  "Motivation for Monday morning",
  "Something about growing up",
  "Love that feels like home",
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({
    mood: [],
    theme: [],
    style: [],
  })
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Smart show/hide on scroll (like BottomNav)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 32) {
        setVisible(true)
      } else if (currentY > lastScrollY.current) {
        setVisible(false) // scrolling down
      } else {
        setVisible(true) // scrolling up
      }
      lastScrollY.current = currentY
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close search overlay on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchFocused) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isSearchFocused])

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    playSound("click")
  }

  const handleSearchClose = () => {
    setIsSearchFocused(false)
    setSearchQuery("")
    setSelectedFilters({ mood: [], theme: [], style: [] })
  }

  const handleMobileSearch = () => {
    playSound("click")
    router.push("/search")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchFocused(false)
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

  // Only show back button on ink full page
  const isInkFullPage = /^\/ink\/[\w-]+$/.test(pathname || "")
  const isSearchPage = pathname === "/search"

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 h-[73px] flex items-center justify-between transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-24"}`}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="flex items-center w-full gap-3">
          {isInkFullPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2 text-purple-600 hover:text-purple-700 focus-visible:ring-purple-500"
              title="Back"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          )}

          <Logo />

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 ml-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search for an inspiration..."
                className="w-full pl-4 pr-10 py-2 bg-gray-100 border-0 rounded-full focus:bg-white focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus:outline-none transition-all duration-300"
                aria-label="Search for an inspiration"
                title="Search for inks and inspiration"
                role="searchbox"
                aria-describedby="search-description"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>

            <div id="search-description" className="sr-only">
              Search through all inks and content on Inkly
            </div>
          </div>

          {/* Mobile Search Icon */}
          <div className="lg:hidden ml-auto mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileSearch}
              onMouseEnter={handleButtonHover}
              className="text-gray-600 hover:text-purple-600 focus-visible:ring-purple-500"
              title="Search"
              aria-label="Open search page"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          <div
            className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0"
            role="group"
            aria-label="Account actions"
          >
            <Button
              className="px-4 py-2 flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white border border-purple-600"
              aria-label="Create Ink"
              title="Create new ink"
              onMouseEnter={handleButtonHover}
              onClick={() => handleButtonClick("click")}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs md:text-sm lg:text-base">Create</span>
            </Button>
            <Button
              variant="outline"
              className="px-2 py-2 text-sm ml-1 flex items-center gap-2 rounded-full bg-transparent"
              aria-label="Join Inkly"
              title="Join Inkly community"
              onMouseEnter={handleButtonHover}
              onClick={() => handleButtonClick("follow")}
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs md:text-sm lg:text-base">Join</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Search Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={handleSearchClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-4xl mx-auto px-6 py-6">
                {/* Search Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Search Inkly</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSearchClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Enhanced Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you feeling today?"
                    className="pl-12 pr-4 py-4 text-lg bg-white border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    autoFocus
                  />
                </form>

                {/* Quick Filters */}
                <div className="space-y-4 mb-6">
                  {Object.entries(filterCategories).map(([category, filters]) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 capitalize min-w-[60px]">{category}:</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {filters.slice(0, 4).map((filter) => (
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

                {/* Search Prompts */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchPrompts.slice(0, 3).map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(prompt)
                          router.push(`/search?q=${encodeURIComponent(prompt)}`)
                          setIsSearchFocused(false)
                        }}
                        className="bg-gray-50 hover:bg-purple-50 hover:border-purple-300 rounded-full text-sm"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/search")}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Advanced Search
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSearchClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSearchSubmit}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={!searchQuery.trim()}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
