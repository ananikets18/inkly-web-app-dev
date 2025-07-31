"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Grid3X3,
  List,
  Eye,
  Heart,
  Bookmark,
  MessageCircle,
  Edit,
  Trash2,
  BarChart3,
  Pin,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Share2,
} from "lucide-react"
import { formatTimeAgo } from "@/utils/formatTimeAgo"
import { formatCount } from "@/utils/formatCount"
import { truncate } from "@/utils/truncate"
import { ModalSystem, useModalSystem } from "./modals/ModalSystem"
import { useToast } from "@/hooks/use-toast"

export default function InksOverview() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const { isOpen, modalData, openModal, closeModal } = useModalSystem()
  const { toast } = useToast()

  // Mock data for inks
  const [inks, setInks] = useState([
    {
      id: "1",
      content:
        "In a world filled with distractions, finding moments of clarity through writing has become more important than ever. This practice has transformed how I approach creativity and self-expression, leading to deeper insights and more meaningful connections with readers.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 1247,
      reactions: 89,
      bookmarks: 34,
      reflections: 12,
      isPinned: true,
      trend: "up" as const,
      readingTime: { minutes: 3, seconds: 0, text: "3 min read" },
      wordCount: 847,
    },
    {
      id: "2",
      content:
        "Small changes compound over time. Here's how I transformed my daily routine and why consistency matters more than perfection. The journey wasn't easy, but the results speak for themselves.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 892,
      reactions: 67,
      bookmarks: 28,
      reflections: 8,
      isPinned: false,
      trend: "stable" as const,
      readingTime: { minutes: 5, seconds: 0, text: "5 min read" },
      wordCount: 623,
    },
    {
      id: "3",
      content:
        "Sharing our struggles isn't weakness—it's courage. This post explores how vulnerability creates deeper connections and why authenticity matters more than perfection in our digital age.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      views: 2156,
      reactions: 143,
      bookmarks: 67,
      reflections: 23,
      isPinned: false,
      trend: "up" as const,
      readingTime: { minutes: 4, seconds: 0, text: "4 min read" },
      wordCount: 1205,
    },
    {
      id: "4",
      content:
        "After 30 days of digital detox, here's what I learned about our relationship with technology and social media. The insights were surprising and life-changing.",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      views: 567,
      reactions: 34,
      bookmarks: 15,
      reflections: 6,
      isPinned: false,
      trend: "down" as const,
      readingTime: { minutes: 6, seconds: 0, text: "6 min read" },
      wordCount: 456,
    },
    {
      id: "5",
      content:
        "The morning sun painted the sky in shades of amber and rose, reminding me that every day is a new canvas waiting to be filled with possibilities.",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      views: 324,
      reactions: 28,
      bookmarks: 12,
      reflections: 4,
      isPinned: false,
      trend: "stable" as const,
      readingTime: { minutes: 1, seconds: 30, text: "1 min read" },
      wordCount: 234,
    },
    {
      id: "6",
      content:
        "Sometimes the best conversations happen in silence. Today I sat with a friend who was going through a difficult time, and I realized that presence is often more powerful than words.",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      views: 789,
      reactions: 56,
      bookmarks: 23,
      reflections: 9,
      isPinned: false,
      trend: "up" as const,
      readingTime: { minutes: 2, seconds: 15, text: "2 min read" },
      wordCount: 345,
    },
  ])

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500 dark:text-red-400" />
      default:
        return <Minus className="w-3 h-3 text-slate-400 dark:text-slate-500" />
    }
  }

  const handleDeleteInk = (inkId: string) => {
    const ink = inks.find((i) => i.id === inkId)
    if (!ink) return

    openModal({
      type: "delete-confirmation",
      title: "Delete Ink",
      description: "This ink will be permanently deleted and cannot be recovered.",
      onConfirm: () => {
        setInks((prev) => prev.filter((i) => i.id !== inkId))
        toast({
          title: "Ink deleted",
          description: "Your ink has been successfully deleted.",
        })
      },
    })
  }

  const handleEditInk = (inkId: string) => {
    const ink = inks.find((i) => i.id === inkId)
    if (!ink) return

    openModal({
      type: "edit-content",
      title: "Edit Ink",
      content: ink.content,
      onSave: (newContent: string) => {
        setInks((prev) =>
          prev.map((i) =>
            i.id === inkId ? { ...i, content: newContent, wordCount: newContent.split(" ").length } : i,
          ),
        )
        toast({
          title: "Ink updated",
          description: "Your changes have been saved successfully.",
        })
      },
    })
  }

  const handlePreviewInk = (inkId: string) => {
    const ink = inks.find((i) => i.id === inkId)
    if (!ink) return

    openModal({
      type: "preview-content",
      content: ink.content,
      wordCount: ink.wordCount,
    })
  }

  const handlePinInk = (inkId: string) => {
    const ink = inks.find((i) => i.id === inkId)
    if (!ink) return

    openModal({
      type: "pin-confirmation",
      data: { isPinned: ink.isPinned },
      onConfirm: () => {
        setInks((prev) => prev.map((i) => (i.id === inkId ? { ...i, isPinned: !i.isPinned } : i)))
        toast({
          title: ink.isPinned ? "Ink unpinned" : "Ink pinned",
          description: ink.isPinned
            ? "Your ink has been unpinned from your profile."
            : "Your ink has been pinned to the top of your profile.",
        })
      },
    })
  }

  const handleAnalytics = (inkId: string) => {
    // This would typically navigate to analytics page or open analytics modal
    toast({
      title: "Analytics",
      description: "Opening detailed analytics for this ink...",
    })
  }

  const handleShare = (inkId: string) => {
    // This would typically open share modal or copy link
    navigator.clipboard.writeText(`https://inkly.com/ink/${inkId}`)
    toast({
      title: "Link copied",
      description: "The ink link has been copied to your clipboard.",
    })
  }

  const CompactInkCard = ({ ink }: { ink: (typeof inks)[0] }) => {
    const [isHovered, setIsHovered] = useState(false)
    const displayContent = truncate(ink.content, 280)
    const timeAgo = formatTimeAgo(ink.createdAt)

    return (
      <motion.div
        className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 transition-all duration-300 cursor-pointer overflow-hidden ${
          isHovered ? "scale-[1.005] shadow-xl dark:shadow-slate-900/40" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handlePreviewInk(ink.id)}
      >
        {ink.isPinned && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-violet-500 dark:bg-violet-600 text-white p-1.5 rounded-full shadow-lg">
              <Pin className="w-3 h-3" />
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Header with meta info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{timeAgo}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>{ink.readingTime.text}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.views)}</span>
              </div>
              {getTrendIcon(ink.trend)}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  // Could open a dropdown menu here
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-5">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-normal">
              {displayContent}
            </p>
            {ink.content.length > 280 && (
              <button className="text-violet-600 dark:text-violet-400 text-sm font-medium mt-3 hover:underline transition-colors">
                Read more
              </button>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{formatCount(ink.reactions)}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{formatCount(ink.reflections)}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
                <Bookmark className="w-4 h-4" />
                <span className="text-sm font-medium">{formatCount(ink.bookmarks)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditInk(ink.id)
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnalytics(ink.id)
                }}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(ink.id)
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteInk(ink.id)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const GridInkCard = ({ ink }: { ink: (typeof inks)[0] }) => {
    const [isHovered, setIsHovered] = useState(false)
    const displayContent = truncate(ink.content, 200)
    const timeAgo = formatTimeAgo(ink.createdAt)

    return (
      <motion.div
        className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-lg dark:shadow-slate-900/20 transition-all duration-300 cursor-pointer overflow-hidden ${
          isHovered ? "scale-[1.01] shadow-xl dark:shadow-slate-900/40" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handlePreviewInk(ink.id)}
      >
        {ink.isPinned && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-violet-500 dark:bg-violet-600 text-white p-1.5 rounded-full shadow-lg">
              <Pin className="w-3 h-3" />
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Header with meta info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">{timeAgo}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>{ink.readingTime.text}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="font-medium">{formatCount(ink.views)}</span>
              </div>
              {getTrendIcon(ink.trend)}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  // Could open a dropdown menu here
                }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-5">
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm font-normal">
              {displayContent}
            </p>
            {ink.content.length > 200 && (
              <button className="text-violet-600 dark:text-violet-400 text-sm font-medium mt-3 hover:underline transition-colors">
                Read more
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">{formatCount(ink.reactions)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{formatCount(ink.reflections)}</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-medium">{formatCount(ink.bookmarks)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                handleEditInk(ink.id)
              }}
            >
              <Edit className="w-3 h-3 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                handleAnalytics(ink.id)
              }}
            >
              <BarChart3 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation()
                handlePinInk(ink.id)
              }}
            >
              <Pin className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteInk(ink.id)
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Your Inks
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                {inks.length} published • {inks.reduce((total, ink) => total + ink.wordCount, 0).toLocaleString()} total words • Track performance and engagement
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-9 px-4 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
          </div>

          {/* Inks Display */}
          <div className="relative">
            {viewMode === "list" ? (
              <div className="space-y-4 sm:space-y-6">
                {inks.map((ink, index) => (
                  <motion.div
                    key={ink.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CompactInkCard ink={ink} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {inks.map((ink, index) => (
                  <motion.div
                    key={ink.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GridInkCard ink={ink} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Empty state */}
          {inks.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Edit className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No inks yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Start writing your first ink to see it here.</p>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Create Your First Ink</Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal System */}
      <ModalSystem isOpen={isOpen} modalData={modalData} onClose={closeModal} />
    </div>
  )
}
