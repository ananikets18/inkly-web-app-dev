"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Badge {
  id: number
  name: string
  icon: string
  description: string
  rarity: string
  earned: string
}

interface BadgeModalProps {
  badge: Badge | null
  isOpen: boolean
  onClose: () => void
}

export default function BadgeModal({ badge, isOpen, onClose }: BadgeModalProps) {
  if (!badge) return null

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "epic":
        return "from-purple-400 to-purple-600"
      case "legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getBadgeGlow = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "shadow-gray-400/30"
      case "rare":
        return "shadow-blue-400/40"
      case "epic":
        return "shadow-purple-400/50"
      case "legendary":
        return "shadow-yellow-400/60"
      default:
        return "shadow-gray-400/30"
    }
  }

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">Achievement Unlocked!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Badge Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative p-8 bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} rounded-3xl shadow-2xl ${getBadgeGlow(badge.rarity)}`}
          >
            <div className="text-center">
              <div className="text-6xl mb-2">{badge.icon}</div>
            </div>
            {badge.rarity === "legendary" && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            )}
          </motion.div>

          {/* Badge Info */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{badge.name}</h3>
              <Badge
                variant="secondary"
                className={`${
                  badge.rarity === "legendary"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    : badge.rarity === "epic"
                      ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                      : badge.rarity === "rare"
                        ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                }`}
              >
                {getRarityLabel(badge.rarity)}
              </Badge>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed max-w-sm">{badge.description}</p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Earned {badge.earned}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
