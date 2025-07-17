"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageCircle, Bookmark, Loader2 } from "lucide-react"
import ResponsiveInkCard from "@/components/ResponsiveInkCard"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ContentTabsProps {
  createdInks: any[]
  reflectedInks: any[]
  bookmarkedInks: any[]
  pinnedInks: any[] // Added pinnedInks prop
  isOwnProfile: boolean
  onLoadMore: (tab: string) => void
  hasMore: { created: boolean; reflected: boolean; bookmarked: boolean }
  loading: boolean
  onPinInk: (inkId: number) => void // Added onPinInk prop
}

export default function ContentTabs({
  createdInks,
  reflectedInks,
  bookmarkedInks,
  pinnedInks,
  isOwnProfile,
  onLoadMore,
  hasMore,
  loading,
  onPinInk,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState("created")
  const [tabLoading, setTabLoading] = useState(false)

  useEffect(() => {
    if (tabLoading) {
      const timeout = setTimeout(() => setTabLoading(false), 300) // Shorter loading for tab switch
      return () => clearTimeout(timeout)
    }
  }, [tabLoading])

  const handleTabChange = (tab: string) => {
    setTabLoading(true)
    setActiveTab(tab)
  }

  // Filter out pinned inks from the 'created' tab if they are already in the pinned section
  const displayCreatedInks = createdInks.filter((ink) => !pinnedInks.some((pinned) => pinned.id === ink.id))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-white/20 dark:border-gray-800 bg-white/30 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-10">
          <TabsList className="w-full bg-transparent p-0 h-auto">
            <TabsTrigger
              value="created"
              className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-900/60 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-400"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Star className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Created Inks</span>
                <span className="sm:hidden text-xs">Created</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="reflected"
              className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-900/60 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-400"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Reflected</span>
                <span className="sm:hidden text-xs">Reflected</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="bookmarked"
              className="flex-1 py-3 sm:py-4 px-3 sm:px-6 data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-900/60 data-[state=active]:shadow-sm rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 dark:data-[state=active]:border-purple-400"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Bookmark className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">Bookmarked</span>
                <span className="sm:hidden text-xs">Saved</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-3 sm:p-6">
          {tabLoading ? (
            <div className="space-y-4 sm:space-y-6 animate-pulse">
              <div className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
              <div className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl" />
            </div>
          ) : (
            <>
              <TabsContent value="created" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  {displayCreatedInks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Star className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Inks Yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Start your creative journey by sharing your first ink.
                      </p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-800 dark:hover:to-pink-800 transition-all duration-200">
                        Create Ink
                      </Button>
                    </div>
                  ) : (
                    <>
                      {displayCreatedInks.map((ink) => (
                        <ResponsiveInkCard
                          key={ink.id}
                          {...ink}
                          shareUrl={`https://inkly.app/ink/${ink.id}`}
                          onClick={() => {}}
                          onHover={() => {}}
                          onBookmark={() => {}}
                          onShare={() => {}}
                          onFollow={() => {}}
                          isOwnInk={isOwnProfile}
                          onPinInk={onPinInk}
                          isPinned={ink.isPinned}
                        />
                      ))}
                      {hasMore.created && (
                        <div className="text-center mt-6">
                          <Button
                            onClick={() => onLoadMore("created")}
                            disabled={loading}
                            className="bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-200"
                          >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Load More Inks"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reflected" className="mt-0">
                <div className="text-center py-8 sm:py-12">
                  <MessageCircle className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reflected Inks Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Start reflecting on others' inks to see them here.</p>
                </div>
              </TabsContent>

              <TabsContent value="bookmarked" className="mt-0">
                <div className="text-center py-8 sm:py-12">
                  <Bookmark className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Bookmarked Inks</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Bookmark inks you want to revisit later.</p>
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </motion.div>
  )
}
