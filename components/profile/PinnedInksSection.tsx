"use client"
import { motion } from "framer-motion"
import { Sparkles, MoreHorizontal, XCircle } from "lucide-react"
import ResponsiveInkCard from "@/components/ResponsiveInkCard"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface PinnedInksSectionProps {
  pinnedInks: any[]
  isOwnProfile: boolean
  onUnpinInk: (inkId: number) => void
}

export default function PinnedInksSection({ pinnedInks, isOwnProfile, onUnpinInk }: PinnedInksSectionProps) {
  if (!pinnedInks || pinnedInks.length === 0) {
    return null // Don't render section if no pinned inks
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-gray-800 shadow-xl mb-8"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">💫 Spotlight Inks</h2>
        </div>
        {isOwnProfile && (
          <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 text-xs sm:text-sm">
            Edit Pins
          </Button>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
        <div className="flex w-max space-x-4 p-1">
          {pinnedInks.map((ink) => (
            <div key={ink.id} className="relative w-[280px] sm:w-[320px] flex-shrink-0">
              <ResponsiveInkCard
                {...ink}
                shareUrl={`https://inkly.app/ink/${ink.id}`}
                onClick={() => {}}
                onHover={() => {}}
                onBookmark={() => {}}
                onShare={() => {}}
                onFollow={() => {}}
                small // Render a smaller version for pinned section
              />
              {isOwnProfile && (
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white w-8 h-8 bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-[18px] h-[18px]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-[160px] p-1 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 backdrop-blur-sm z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        onClick={() => onUnpinInk(ink.id)}
                        className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg px-3 py-2 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Remove from Pinned</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  )
}
