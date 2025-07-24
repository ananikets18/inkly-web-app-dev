"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, X, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

interface BadgeType {
  id: number
  name: string
  icon: string
  description: string
  rarity?: string
  earned?: string
}

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  badges: BadgeType[]
}

const getBadgeRarityColor = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case "common":
      return "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700"
    case "rare":
      return "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
    case "epic":
      return "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
    case "legendary":
      return "from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30"
    default:
      return "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700"
  }
}

const getBadgeRarityBorder = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case "legendary":
      return "border-2 border-amber-300 dark:border-amber-500 shadow-lg shadow-amber-200/50 dark:shadow-amber-500/20"
    case "epic":
      return "border-2 border-purple-300 dark:border-purple-500 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20"
    case "rare":
      return "border border-blue-300 dark:border-blue-500 shadow-md shadow-blue-200/50 dark:shadow-blue-500/20"
    default:
      return "border border-slate-200 dark:border-slate-600 shadow-sm"
  }
}

const getRarityLabel = (rarity: string) => {
  if (!rarity || typeof rarity !== "string") return "Common"
  return rarity.charAt(0).toUpperCase() + rarity.slice(1)
}

const getRarityBadgeStyle = (rarity: string) => {
  switch (rarity?.toLowerCase()) {
    case "legendary":
      return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md"
    case "epic":
      return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
    case "rare":
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
    default:
      return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
  }
}

export default function AchievementsModal({ isOpen, onClose, badges }: AchievementsModalProps) {
  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  // Add default values for missing badge properties
  const processedBadges = badges.map((badge) => ({
    ...badge,
    rarity: badge.rarity || "common",
    earned: badge.earned || "Recently",
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 max-w-6xl w-full max-h-[90vh] p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">All Achievements and Badges</DialogTitle>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Achievements</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{badges.length} badges earned</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Close achievements modal"
              type="button"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {processedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      y: -4,
                      transition: { duration: 0.2 },
                    }}
                    className={`relative flex flex-col rounded-2xl ${getBadgeRarityBorder(badge.rarity)} bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} p-6 transition-all duration-300 hover:shadow-xl group cursor-pointer`}
                  >
                    {/* Legendary sparkle effect */}
                    {badge.rarity === "legendary" && (
                      <div className="absolute -top-1 -right-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        </motion.div>
                      </div>
                    )}

                    {/* Badge Icon */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className="text-5xl drop-shadow-lg"
                        >
                          {badge.icon}
                        </motion.div>
                        {badge.rarity === "legendary" && (
                          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-md animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Badge Info */}
                    <div className="flex-1 text-center space-y-3">
                      {/* Name and Rarity */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{badge.name}</h3>
                        <Badge
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getRarityBadgeStyle(badge.rarity)}`}
                        >
                          {getRarityLabel(badge.rarity)}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[2.5rem] flex items-center justify-center">
                        {badge.description}
                      </p>

                      {/* Earned Date */}
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Earned {badge.earned}</span>
                      </div>
                    </div>

                    {/* Hover overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Empty state */}
            {badges.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No achievements yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start creating and engaging to earn your first badges!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
