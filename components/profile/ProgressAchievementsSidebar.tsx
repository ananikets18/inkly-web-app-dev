"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Trophy, Sparkles, Star, Target, Award } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import BadgeModal from "@/components/BadgeModal"

interface Achievement {
  id: number
  name: string
  icon: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  earned: string
  category: string
  unlocked: boolean
}

interface ProgressAchievementsSidebarProps {
  userData: {
    level: number
    xp: number
    xpToNext: number
  }
  achievements: Achievement[]
  onViewAllAchievements: () => void
}

export default function ProgressAchievementsSidebar({
  userData,
  achievements,
  onViewAllAchievements,
}: ProgressAchievementsSidebarProps) {
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null)
  const xpProgress = (userData.xp / userData.xpToNext) * 100

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const recentAchievements = unlockedAchievements.slice(0, 6)

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-100 to-gray-300 border-gray-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700"
      case "rare":
        return "from-blue-100 to-blue-300 border-blue-200 dark:from-blue-900 dark:to-blue-800 dark:border-blue-700"
      case "epic":
        return "from-purple-100 to-purple-300 border-purple-200 dark:from-purple-900 dark:to-purple-800 dark:border-purple-700"
      case "legendary":
        return "from-yellow-100 to-orange-200 border-yellow-200 dark:from-yellow-900 dark:to-orange-800 dark:border-orange-700"
      default:
        return "from-gray-100 to-gray-300 border-gray-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-700"
    }
  }

  const getBadgeGlow = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "shadow-yellow-200/50 dark:shadow-yellow-800/50"
      case "epic":
        return "shadow-purple-200/50 dark:shadow-purple-800/50"
      case "rare":
        return "shadow-blue-200/50 dark:shadow-blue-800/50"
      default:
        return "shadow-gray-200/50 dark:shadow-gray-800/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Level Progress */}
    

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Achievements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your progress milestones</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedBadge(achievement)}
              className={`relative p-3 bg-gradient-to-br ${getBadgeRarityColor(achievement.rarity)} rounded-xl cursor-pointer shadow-lg ${getBadgeGlow(achievement.rarity)} hover:shadow-xl transition-all duration-300 border`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">{achievement.name}</div>
              </div>

              {achievement.rarity === "legendary" && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                </div>
              )}

              {/* New Badge Indicator */}
              {achievement.earned.includes("day") && Number.parseInt(achievement.earned) <= 3 && (
                <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  NEW
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <Button
          variant="ghost"
          onClick={onViewAllAchievements}
          className="w-full text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900"
        >
          <Award className="w-4 h-4 mr-2" />
          View all {achievements.length} achievements
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Stats</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">This week's activity</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Inks created</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Echoes received</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Reflections made</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current streak</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">🔥 5 days</span>
          </div>
        </div>
      </motion.div>

      {/* Badge Modal */}
      <BadgeModal badge={selectedBadge} isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  )
}
