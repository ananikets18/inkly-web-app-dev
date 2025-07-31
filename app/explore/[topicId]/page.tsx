"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, TrendingUp, Heart, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatCount } from "@/utils/formatCount"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { useTopicContent, TopicsAPI, TopicUniverse } from "@/lib/api/topics"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"
import InkCard from "@/components/InkCard"

// Mock topic data - will be replaced with real API call
const mockTopics: Record<string, TopicUniverse> = {
  philosophy: {
    id: "philosophy",
    name: "Philosophy",
    emoji: "🧘",
    gradient: "from-purple-500 to-indigo-600",
    count: 2847,
    description: "Deep thoughts and existential musings",
  },
  healing: {
    id: "healing",
    name: "Healing",
    emoji: "🧠",
    gradient: "from-emerald-500 to-teal-600",
    count: 3456,
    description: "Mental health and emotional wellness",
  },
  feminism: {
    id: "feminism",
    name: "Feminism",
    emoji: "✊",
    gradient: "from-pink-500 to-rose-600",
    count: 1923,
    description: "Empowerment and equality voices",
  },
  creativity: {
    id: "creativity",
    name: "Creativity",
    emoji: "🧪",
    gradient: "from-orange-500 to-red-600",
    count: 2134,
    description: "Artistic expression and innovation",
  },
  spirituality: {
    id: "spirituality",
    name: "Spirituality",
    emoji: "🔮",
    gradient: "from-violet-500 to-purple-600",
    count: 1678,
    description: "Soul searching and inner wisdom",
  },
  love: {
    id: "love",
    name: "Love",
    emoji: "💕",
    gradient: "from-rose-500 to-pink-600",
    count: 4567,
    description: "Romance, relationships, and connection",
  },
  nature: {
    id: "nature",
    name: "Nature",
    emoji: "🌿",
    gradient: "from-green-500 to-emerald-600",
    count: 1845,
    description: "Earth wisdom and natural beauty",
  },
  mindfulness: {
    id: "mindfulness",
    name: "Mindfulness",
    emoji: "🕯️",
    gradient: "from-amber-500 to-orange-600",
    count: 2789,
    description: "Present moment awareness",
  },
  dreams: {
    id: "dreams",
    name: "Dreams",
    emoji: "🌙",
    gradient: "from-blue-500 to-indigo-600",
    count: 1234,
    description: "Aspirations and night visions",
  },
  resilience: {
    id: "resilience",
    name: "Resilience",
    emoji: "💪",
    gradient: "from-cyan-500 to-blue-600",
    count: 2456,
    description: "Strength through adversity",
  },
}

type SortOption = "recent" | "popular" | "trending"

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string
  
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Get topic metadata
  const topic = mockTopics[topicId]
  
  // Get topic content using the hook
  const { data: topicContent, loading, error, refetch } = useTopicContent(topicId, {
    page: currentPage,
    limit: 20,
    sortBy,
    includeAnalytics: true,
  })

  useEffect(() => {
    if (!topic) {
      toast({
        title: "Topic Not Found",
        description: "The requested topic doesn't exist.",
        variant: "destructive",
      })
      router.push("/explore")
      return
    }

    // Track topic view for analytics
    const trackTopicView = async () => {
      try {
        // TODO: Replace with real user ID from auth context
        const userId = "current-user-id"
        await TopicsAPI.trackTopicClick(topicId, userId, {
          source: "topic_page",
        })
      } catch (error) {
        console.error("Failed to track topic view:", error)
      }
    }

    trackTopicView()
  }, [topicId, topic, router])

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading topic...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-row w-full">
        <div className="hidden md:block">
          <SideNav />
        </div>

        <main className="flex-1 pb-24 w-full" role="main">
          {/* Header */}
          <div className={`bg-gradient-to-br ${topic.gradient} text-white`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="text-3xl" role="img" aria-label={topic.name}>
                  {topic.emoji}
                </span>
                <div>
                  <h1 className="text-3xl font-bold">{topic.name}</h1>
                  <p className="text-white/80 mt-1">{topic.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{topic.count.toLocaleString()}</span>
                    <span>inks</span>
                  </div>
                  {topicContent && (
                    <>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{topicContent.totalReactions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>{topicContent.totalViews.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <div className="flex items-center gap-2">
                  {(["recent", "popular", "trending"] as SortOption[]).map((option) => (
                    <Button
                      key={option}
                      variant={sortBy === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSortChange(option)}
                      className="capitalize"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-card rounded-2xl shadow-lg border border-border/50 p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-muted rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-3 bg-muted rounded w-20" />
                        </div>
                      </div>
                      <div className="h-6 bg-muted rounded mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={refetch} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Content Grid using InkCard */}
            {topicContent && !loading && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {topicContent.inks.map((ink) => (
                    <InkCard
                      key={ink.id}
                      id={parseInt(ink.id.replace(/\D/g, '') || '1')}
                      content={ink.content}
                      author={ink.author.name}
                      avatarColor={ink.author.avatarColor}
                      bookmarkCount={0}
                      baseEchoCount={0}
                      onClick={() => {}}
                      onHover={() => {}}
                      onBookmark={() => {}}
                      onShare={() => {}}
                      onFollow={() => {}}
                      views={ink.views}
                      reactionCount={ink.reactions}
                      reflectionCount={0}
                      readingTime={{ text: ink.readingTime, minutes: parseInt(ink.readingTime.replace(/\D/g, '') || '1') }}
                      shareUrl={`/ink/${ink.id}`}
                      animateBookmark={false}
                      setAnimateBookmark={() => {}}
                      bookmarked={false}
                      bookmarkLocked={false}
                      setBookmarkLocked={() => {}}
                      bookmarkMessage={null}
                      setBookmarkMessage={() => {}}
                      isFollowing={false}
                      setIsFollowing={() => {}}
                      isFollowLoading={false}
                      setIsFollowLoading={() => {}}
                      isFollowIntent={null}
                      setIsFollowIntent={() => {}}
                      reportOpen={false}
                      setReportOpen={() => {}}
                      reflectOpen={false}
                      setReflectOpen={() => {}}
                      localReaction={{ reaction: null }}
                      setLocalReaction={() => {}}
                      reactionCountLocal={ink.reactions}
                      setReactionCountLocal={() => {}}
                      reflectionCountLocal={0}
                      setReflectionCountLocal={() => {}}
                      bookmarkCountLocal={0}
                      setBookmarkCountLocal={() => {}}
                      showEchoAnim={false}
                      setShowEchoAnim={() => {}}
                      hasReflected={false}
                      setHasReflected={() => {}}
                      hasInkified={false}
                      setHasInkified={() => {}}
                      echoCount={0}
                      setEchoCount={() => {}}
                      followMessage={null}
                      setFollowMessage={() => {}}
                      echoUsers={[]}
                      handleReaction={() => {}}
                      handleBookmark={() => {}}
                      handleFollowClick={() => {}}
                      inkId={ink.id}
                      collectionPickerOpen={false}
                      setCollectionPickerOpen={() => {}}
                      handleSaveToCollections={() => {}}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {topicContent.inks.length < topicContent.totalInks && (
                  <div className="text-center mt-8">
                    <Button onClick={handleLoadMore} variant="outline" size="lg">
                      Load More Inks
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
      <Footer />
    </div>
  )
} 