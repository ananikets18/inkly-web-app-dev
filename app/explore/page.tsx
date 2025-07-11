"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  X,
  ChevronRight,
  Sparkles,
  BookOpen,
  Heart,
  Coffee,
  Music,
  Camera,
  Smile,
  Zap,
  Bookmark,
  Compass,
} from "lucide-react"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"
import ResponsiveInkCard from "../../components/ResponsiveInkCard"
import { useSoundEffects } from "../../hooks/use-sound-effects"
import { calculateReadingTime } from "../../utils/reading-time"
import { reactions } from "../../components/reaction-button"
import Masonry from "react-masonry-css"
import { debounce } from "lodash"
import SkeletonCard from "@/components/SkeletonCard"
import { generateRandomInkId } from "@/utils/random-ink-id"
import { getTagsAndMood } from "@/components/InkCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Masonry breakpoints for responsive layout
const masonryBreakpoints = {
  default: 5, // ≥1536px
  1536: 4, // ≥1280px and <1536px
  1280: 3, // ≥1024px and <1280px
  1024: 2, // ≥768px and <1024px
  768: 1, // <768px (mobile only)
}

// Categories with icons for filtering
const categories = [
  { id: "all", name: "All", icon: Compass, color: "from-blue-500 to-purple-500" },
  { id: "poetry", name: "Poetry", icon: BookOpen, color: "from-purple-500 to-pink-500" },
  { id: "quotes", name: "Quotes", icon: Sparkles, color: "from-amber-500 to-orange-500" },
  { id: "love", name: "Love", icon: Heart, color: "from-red-500 to-pink-500" },
  { id: "philosophy", name: "Philosophy", icon: Coffee, color: "from-emerald-500 to-teal-500" },
  { id: "music", name: "Music", icon: Music, color: "from-blue-500 to-cyan-500" },
  { id: "visual", name: "Visual", icon: Camera, color: "from-violet-500 to-indigo-500" },
  { id: "humor", name: "Humor", icon: Smile, color: "from-yellow-500 to-amber-500" },
  { id: "motivation", name: "Motivation", icon: Zap, color: "from-orange-500 to-red-500" },
  { id: "collections", name: "Collections", icon: Bookmark, color: "from-teal-500 to-cyan-500" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [postReactions, setPostReactions] = useState<{ [key: string]: { reaction: string; count: number } }>({})
  const [inks, setInks] = useState<any[]>([])
  const [filteredInks, setFilteredInks] = useState<any[]>([])

  const { playSound } = useSoundEffects()

  // Generate sample content for the explore page
  const sampleContents = [
    // Poetry
    `Beneath the silver whisper of the moon,
A thousand dreams awaken, drift, and swoon.
The city sleeps, but in the quiet deep,
A poet's heart is far too wild to sleep.`,
    "The moonlight danced on the edges of her soul, illuminating corners even she had forgotten.",
    "Hope was not a bird, but a fire quietly kept alive beneath her ribs.",
    // Quotes
    "Whisper to the universe what you seek and it shall echo back tenfold.",
    "Every time your heart is broken, a doorway cracks open to a world full of new beginnings.",
    // Dialogues
    "\"Are you coming?\" she asked. He smiled, 'Always.'",
    "'Promise me you'll stay.' 'Until the stars forget to shine.'",
    // Affirmations
    "A silent affirmation each morning shaped her every decision.",
    "Manifest with intention. Trust the magic in your breath.",
    // Humor
    "Once upon a meme, a frog ruled the internet.",
    "In a world of cats, be a keyboard warrior.",
    // Confessions
    "Confession: I still believe in magic.",
    "Sometimes I pretend to be busy just to avoid people.",
    // Facts
    "Did you know? Honey never spoils. Archaeologists have found edible honey in ancient tombs.",
    "Octopuses have three hearts and blue blood.",
    // Other
    "She wasn't soft because life was easy. She was soft like the sea—calm on the surface but carrying storms in the deep.",
    "Some stories aren't written. They're felt.",
  ]

  const authorNames = [
    "sarah_mitchell", // Creator badge
    "Maya Chen", // Regular user
    "alex_thompson", // Admin badge
    "Jordan Kim", // Regular user
    "mike_rodriguez", // Moderator badge
    "Sam Taylor", // Regular user
    "emma_wilson", // Contributor badge
    "Riley Park", // Regular user
    "david_chen", // Writer badge
    "Alex Rivera", // Regular user
    "lisa_park", // Author badge
    "jessica_brown", // Verified tick only
    "michael_lee", // Verified tick only
  ]

  const avatarColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-yellow-500 to-orange-500",
    "from-emerald-500 to-green-500",
    "from-violet-500 to-purple-500",
    "from-sky-500 to-blue-500",
    "from-amber-500 to-yellow-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-pink-500",
  ]

  // Generate ink data on mount
  useEffect(() => {
    const generateInks = () => {
      const now = new Date()
      const inkIds = Array.from({ length: 50 }).map(() => generateRandomInkId())

      const generatedInks = Array.from({ length: 50 }).map((_, idx) => {
        const id = inkIds[idx]
        const content = sampleContents[idx % sampleContents.length]
        const author = authorNames[idx % authorNames.length]
        const readingTime = calculateReadingTime(content).text
        const views = Math.floor(Math.random() * 1000) + 100
        const username = `@${author.toLowerCase().replace(/\s+/g, "_")}`
        const { tags, mood } = getTagsAndMood(content)
        const avatarColor = avatarColors[idx % avatarColors.length]

        // Assign random categories for filtering
        const categoryIndex = Math.floor(Math.random() * categories.length)
        const category = categories[categoryIndex].id

        return {
          id,
          content,
          author,
          createdAt: now.toISOString(),
          reaction: postReactions[id]?.reaction || null,
          reactionCount: postReactions[id]?.count || 0,
          bookmarkCount: Math.floor(Math.random() * 50),
          reflectionCount: Math.floor(Math.random() * 20),
          readingTime,
          views,
          username,
          tags,
          mood,
          avatarColor,
          category,
        }
      })

      setInks(generatedInks)
      setFilteredInks(generatedInks)
      setIsLoading(false)
      setMounted(true)
    }

    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      generateInks()
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Filter inks based on search query and selected category
  useEffect(() => {
    if (!mounted) return

    const filtered = inks.filter((ink) => {
      const matchesSearch =
        searchQuery === "" ||
        ink.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ink.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ink.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || ink.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    setFilteredInks(filtered)
  }, [searchQuery, selectedCategory, inks, mounted])

  // Handle button interactions with sound effects
  const handleButtonClick = useCallback(
    (type: "click" | "like" | "follow" | "bookmark") => playSound(type),
    [playSound],
  )
  const handleButtonHover = useCallback(() => playSound("hover"), [playSound])

  // Handle reaction clicks
  const handleReaction = useCallback((postId: string, reactionId: string | null) => {
    if (!reactionId) return
    const selected = reactions.find((r) => r.id === reactionId)
    if (selected) {
      setPostReactions((prev) => ({
        ...prev,
        [postId]: {
          reaction: reactionId,
          count: (prev[postId]?.count || 0) + 1,
        },
      }))
    }
  }, [])

  // Load more content when scrolling
  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredInks.length) return

    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 8, filteredInks.length))
      setIsLoadingMore(false)
    }, 800)
  }, [isLoadingMore, visibleCount, filteredInks.length])

  // Debounced scroll handler for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.body.offsetHeight
      if (documentHeight - scrollPosition < 300) {
        loadMore()
      }
    }

    const debouncedScroll = debounce(handleScroll, 100)
    window.addEventListener("scroll", debouncedScroll)
    return () => window.removeEventListener("scroll", debouncedScroll)
  }, [loadMore, isLoadingMore])

  // Debounced search handler
  const handleSearch = debounce((value: string) => {
    setSearchQuery(value)
  }, 300)

  // Reset search query
  const clearSearch = () => {
    setSearchQuery("")
    const searchInput = document.getElementById("search-input") as HTMLInputElement
    if (searchInput) searchInput.value = ""
  }

  // Memoize skeleton cards for loading state
  const skeletonCards = Array.from({ length: 12 }).map((_, idx) => <SkeletonCard key={idx} />)

  // Visible inks based on current count
  const visibleInks = filteredInks.slice(0, visibleCount)

  // --- 1. Editor's Picks (Netflix-style Slider) ---
  const editorsPicks = inks.slice(0, 8);
  // --- 2. Browse by Category ---
  // Already have categories array
  // --- 3. What's New on Inkly ---
  const whatsNew = inks.slice(-8).reverse();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-row">
        <SideNav />
        {/* Main content area: controls width, horizontal padding, and top/bottom padding */}
        <main
          className="flex-1 max-w-7xl mx-auto px-2 pt-8 pb-24"
          // max-w-5xl: limits content width
          // mx-auto: centers content horizontally
          // px-2 md:px-6: horizontal padding (small and medium+ screens)
          // pt-8 pb-24: top and bottom padding
        >
          {/* 1. Explore Best of Inkly - Netflix-style Slider */}
          <section className="mb-16">
            {/* mb-12: bottom margin for section spacing */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              {/* mb-4: bottom margin below heading */}
              <Sparkles className="text-purple-500" /> Explore Best of Inkly
              <span className="ml-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide select-none align-middle">
                Editor's Pick
              </span>
            </h2>
            <div className="relative">
              <Carousel opts={{ loop: true }}>
                <CarouselContent className="pl-0">
                  {editorsPicks.map((ink, idx) => (
                    <CarouselItem key={ink.id} className="basis-3/4 md:basis-1/3 lg:basis-1/4 px-2">
                      {/* px-2: horizontal padding between carousel items */}
                      <div className="relative group">
                        {/* Ranking number overlay in top-left inside the card, with light brand color */}
                        <ResponsiveInkCard {...ink} onClick={() => {}} onHover={() => {}} />
                        {/* Removed Editor's Pick badge from card */}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>

          {/* 2. Browse by Category */}
          <section className="mb-16">
            {/* mb-12: bottom margin for section spacing */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              {/* mb-4: bottom margin below heading */}
              <Compass className="text-blue-500" /> Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* gap-4: space between category cards */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`relative flex flex-col items-center justify-center h-28 rounded-2xl shadow-md transition-transform hover:scale-105 focus:outline-none bg-gradient-to-br ${cat.color}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-label={cat.name}
                >
                  <cat.icon className="w-8 h-8 mb-2 text-white drop-shadow-lg" />
                  {/* mb-2: margin below icon */}
                  <span className="text-white font-semibold text-lg drop-shadow-lg">
                    {cat.name}
                  </span>
                  {selectedCategory === cat.id && (
                    <span className="absolute top-2 right-2 bg-white/80 text-xs text-black px-2 py-0.5 rounded-full font-bold shadow">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </section>
    <br /><br />
          {/* 3. What's New on Inkly */}
          <section className="mb-16">
            {/* mb-6: bottom margin for section spacing */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              {/* mb-4: bottom margin below heading */}
              <Zap className="text-orange-500" /> What's New on Inkly
              <span className="ml-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg tracking-wide select-none align-middle">
                New
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* gap-4: space between new ink cards */}
              {whatsNew.map((ink) => (
                <div key={ink.id} className="relative">
                  <ResponsiveInkCard {...ink} onClick={() => {}} onHover={() => {}} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
