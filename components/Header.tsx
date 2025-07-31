"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Plus, Search, UserPlus, Home, Compass, User, HelpCircle, Info, ArrowLeft, X, Hash, LogOut, ChevronDown, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Logo from "@/components/logo"
import { useSoundEffects } from "@/hooks/use-sound-effects"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: User, label: "Profile" },
]

const supportItems = [
  { icon: HelpCircle, label: "Help" },
  { icon: Info, label: "About" },
]

// Popular search suggestions
const popularSearches = ["love quotes", "motivation", "self care", "poetry", "wisdom"]

// Mock data for search suggestions
const mockInks = [
  { id: 1, content: "The best way to predict the future is to create it", author: "sarah_mitchell" },
  { id: 2, content: "In the middle of difficulty lies opportunity", author: "alex_thompson" },
  { id: 3, content: "Life is what happens to you while you're busy making other plans", author: "maya_chen" },
  { id: 4, content: "The only way to do great work is to love what you do", author: "jordan_kim" },
  { id: 5, content: "Innovation distinguishes between a leader and a follower", author: "mike_rodriguez" },
]

const mockUsers = [
  { id: 1, username: "sarah_mitchell", displayName: "Sarah Mitchell", avatar: "SM" },
  { id: 2, username: "alex_thompson", displayName: "Alex Thompson", avatar: "AT" },
  { id: 3, username: "maya_chen", displayName: "Maya Chen", avatar: "MC" },
  { id: 4, username: "jordan_kim", displayName: "Jordan Kim", avatar: "JK" },
  { id: 5, username: "mike_rodriguez", displayName: "Mike Rodriguez", avatar: "MR" },
]

const mockHashtags = [
  { id: 1, name: "motivation", count: 1234 },
  { id: 2, name: "love", count: 987 },
  { id: 3, name: "wisdom", count: 756 },
  { id: 4, name: "poetry", count: 543 },
  { id: 5, name: "selfcare", count: 432 },
]

export default function Header({ leftAction }: { leftAction?: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { playSound, isMuted, isInitialized, toggleMute } = useSoundEffects()
  const { user, isAuthenticated, logout, needsOnboarding } = useAuth()
  const { toast } = useToast()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    inks: typeof mockInks
    users: typeof mockUsers
    hashtags: typeof mockHashtags
  }>({ inks: [], users: [], hashtags: [] })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

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

  // Close search overlay on escape key or outside click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchFocused) {
        setIsSearchFocused(false)
        setSelectedIndex(-1)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchFocused])

  // Real-time search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()

      // Filter inks
      const filteredInks = mockInks
        .filter((ink) => ink.content.toLowerCase().includes(query) || ink.author.toLowerCase().includes(query))
        .slice(0, 3)

      // Filter users
      const filteredUsers = mockUsers
        .filter((user) => user.username.toLowerCase().includes(query) || user.displayName.toLowerCase().includes(query))
        .slice(0, 3)

      // Filter hashtags
      const filteredHashtags = mockHashtags.filter((hashtag) => hashtag.name.toLowerCase().includes(query)).slice(0, 3)

      setSearchResults({
        inks: filteredInks,
        users: filteredUsers,
        hashtags: filteredHashtags,
      })
    } else {
      setSearchResults({ inks: [], users: [], hashtags: [] })
    }
  }, [searchQuery])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused) return

    const totalResults = searchResults.inks.length + searchResults.users.length + searchResults.hashtags.length
    const hasPopularSearches = !searchQuery.trim() && popularSearches.length > 0
    const maxIndex = hasPopularSearches ? popularSearches.length - 1 : totalResults - 1

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      if (hasPopularSearches) {
        handlePopularSearchClick(popularSearches[selectedIndex])
      } else {
        // Handle selection of search results
        handleSearchResultSelect(selectedIndex)
      }
    }
  }

  const handleSearchResultSelect = (index: number) => {
    const currentIndex = 0

    if (index < searchResults.inks.length) {
      const ink = searchResults.inks[index]
      router.push(`/ink/${ink.id}`)
    } else if (index < searchResults.inks.length + searchResults.users.length) {
      const userIndex = index - searchResults.inks.length
      const user = searchResults.users[userIndex]
      router.push(`/profile/${user.username}`)
    } else {
      const hashtagIndex = index - searchResults.inks.length - searchResults.users.length
      const hashtag = searchResults.hashtags[hashtagIndex]
      router.push(`/search?hashtag=${hashtag.name}`)
    }

    setIsSearchFocused(false)
    setSelectedIndex(-1)
  }

  const handleButtonClick = (soundType: "click" | "like" | "follow" | "bookmark") => {
    playSound(soundType)
  }

  const handleButtonHover = () => {
    playSound("hover")
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    // Removed playSound("click") to disable sound on search bar focus
  }

  const handleSearchClose = () => {
    setIsSearchFocused(false)
    setSearchQuery("")
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchFocused(false)
      setSelectedIndex(-1)
    }
  }

  const handlePopularSearchClick = (query: string) => {
    setSearchQuery(query)
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setIsSearchFocused(false)
    setSelectedIndex(-1)
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // Function to generate initials from full name
  const getInitials = (fullName: string) => {
    if (!fullName) return "U"
    
    // Split by spaces and take first letter of each part
    const parts = fullName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }
    
    // If single word, take first two letters
    if (fullName.length >= 2) {
      return fullName.substring(0, 2).toUpperCase()
    }
    
    return fullName.charAt(0).toUpperCase()
  }

  // Only show back button on ink full page
  const isInkFullPage = /^\/ink\/[\w-]+$/.test(pathname || "")
  const isSearchPage = pathname === "/search"

  const hasSearchResults =
    searchResults.inks.length > 0 || searchResults.users.length > 0 || searchResults.hashtags.length > 0
  const showPopularSearches = !searchQuery.trim()

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 h-[73px] flex items-center justify-between transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-24"}`}
        role="banner"
        aria-label="Main navigation"
      >
        <div className="flex items-center w-full gap-3">
          {leftAction}
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

          {/* Search Container */}
          <div className="hidden md:flex flex-1 ml-4 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="Search inks, users, or hashtags..."
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full focus:bg-white dark:focus:bg-gray-800 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus:outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  aria-label="Search for inks, users, or hashtags"
                  aria-expanded={isSearchFocused}
                  aria-haspopup="listbox"
                  role="combobox"
                  aria-autocomplete="list"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 h-6 w-6"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden"
                  role="listbox"
                  aria-label="Search suggestions"
                >
                  {/* Popular Searches (when input is empty) */}
                  {showPopularSearches && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Popular searches</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search, index) => (
                          <Badge
                            key={search}
                            variant="secondary"
                            className={`cursor-pointer transition-all duration-200 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/50 dark:hover:text-purple-300 ${
                              selectedIndex === index
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                : ""
                            }`}
                            onClick={() => handlePopularSearchClick(search)}
                            role="option"
                            aria-selected={selectedIndex === index}
                          >
                            {search}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Results */}
                  {hasSearchResults && (
                    <div className="max-h-96 overflow-y-auto">
                      {/* Inks Section */}
                      {searchResults.inks.length > 0 && (
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Inks
                          </h3>
                          <div className="space-y-2">
                            {searchResults.inks.map((ink, index) => (
                              <div
                                key={ink.id}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                  selectedIndex === index ? "bg-gray-50 dark:bg-gray-800" : ""
                                }`}
                                onClick={() => router.push(`/ink/${ink.id}`)}
                                role="option"
                                aria-selected={selectedIndex === index}
                              >
                                <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                                  {highlightText(ink.content, searchQuery)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  by @{highlightText(ink.author, searchQuery)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Users Section */}
                      {searchResults.users.length > 0 && (
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Users
                          </h3>
                          <div className="space-y-2">
                            {searchResults.users.map((user, index) => {
                              const userIndex = searchResults.inks.length + index
                              return (
                                <div
                                  key={user.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                    selectedIndex === userIndex ? "bg-gray-50 dark:bg-gray-800" : ""
                                  }`}
                                  onClick={() => router.push(`/profile/${user.username}`)}
                                  role="option"
                                  aria-selected={selectedIndex === userIndex}
                                >
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                                      {user.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                      {highlightText(user.displayName, searchQuery)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      @{highlightText(user.username, searchQuery)}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Hashtags Section */}
                      {searchResults.hashtags.length > 0 && (
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Hashtags
                          </h3>
                          <div className="space-y-2">
                            {searchResults.hashtags.map((hashtag, index) => {
                              const hashtagIndex = searchResults.inks.length + searchResults.users.length + index
                              return (
                                <div
                                  key={hashtag.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                    selectedIndex === hashtagIndex ? "bg-gray-50 dark:bg-gray-800" : ""
                                  }`}
                                  onClick={() => router.push(`/search?hashtag=${hashtag.name}`)}
                                  role="option"
                                  aria-selected={selectedIndex === hashtagIndex}
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Hash className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      #{highlightText(hashtag.name, searchQuery)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {hashtag.count.toLocaleString()} inks
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery.trim() && !hasSearchResults && (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No results found for "{searchQuery}"</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        Try different keywords or check your spelling
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0"
            role="group"
            aria-label="Account actions"
          >
            {isAuthenticated ? (
              <>
                <Button
                  className="px-4 py-2 flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                  aria-label="Create Ink"
                  title="Create new ink"
                  onMouseEnter={handleButtonHover}
                  onClick={() => {
                    handleButtonClick("click")
                    router.push("/create")
                  }}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span className="text-xs md:text-sm lg:text-base font-medium">Create</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="px-4 py-2 text-sm flex items-center gap-2 rounded-full bg-transparent border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                      aria-label="User menu"
                      title="User menu"
                      onMouseEnter={handleButtonHover}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs font-medium">
                          {getInitials(user?.name || user?.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs md:text-sm lg:text-base font-medium hidden sm:inline">
                        {user?.name || user?.email || "User"}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => {
                        handleButtonClick("follow")
                        router.push("/profile")
                      }}
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleButtonClick("follow")
                        router.push("/settings")
                      }}
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        handleButtonClick("click")
                        logout()
                        toast({
                          title: "Signed out",
                          description: "You have been successfully logged out.",
                        })
                      }}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="px-4 py-2 flex items-center gap-2 rounded-full bg-transparent border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                  aria-label="Sign In"
                  title="Sign In to Inkly"
                  onMouseEnter={handleButtonHover}
                  onClick={() => {
                    handleButtonClick("click")
                    router.push("/auth/signin")
                  }}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span className="text-xs md:text-sm lg:text-base">Sign In</span>
                </Button>
                <Button
                  className="px-4 py-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                  aria-label="Get Started"
                  title="Get Started with Inkly"
                  onMouseEnter={handleButtonHover}
                  onClick={() => {
                    handleButtonClick("click")
                    router.push("/auth/signup")
                  }}
                >
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  <span className="text-xs md:text-sm lg:text-base">Get Started</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

          {/* Authentication modals removed */}
    </>
  )
}
