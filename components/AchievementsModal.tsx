import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface BadgeType {
  id: number;
  name: string;
  icon: string;
  description: string;
  rarity: string;
  earned: string;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeType[];
}

const getBadgeRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "from-gray-100 to-gray-300";
    case "rare":
      return "from-blue-100 to-blue-300";
    case "epic":
      return "from-purple-100 to-purple-300";
    case "legendary":
      return "from-yellow-100 to-orange-200";
    default:
      return "from-gray-100 to-gray-300";
  }
};

const getBadgeRarityBorder = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "border-4 border-yellow-400 shadow-yellow-200";
    case "epic":
      return "border-2 border-purple-400 shadow-purple-200";
    case "rare":
      return "border-2 border-blue-300 shadow-blue-100";
    default:
      return "border border-gray-200";
  }
};

const getRarityLabel = (rarity: string) => {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
};

export default function AchievementsModal({ isOpen, onClose, badges }: AchievementsModalProps) {
  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-white/90 backdrop-blur-xl border-white/20 max-w-[1200px] w-full p-0 overflow-visible"
        style={{ maxWidth: 1200 }}
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">All Achievements</DialogTitle>
        <div className="flex items-center justify-end px-4 pt-4 pb-2">
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-200 transition"
            aria-label="Close achievements modal"
            type="button"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pb-8 pt-0"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(80,80,180,0.10)" }}
              className={`relative flex flex-col items-center text-center rounded-xl ${getBadgeRarityBorder(badge.rarity)} bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} shadow transition-all duration-200 p-3 min-h-[120px] min-w-0`}
              style={{ maxWidth: 170, minWidth: 0 }}
            >
              <div className="flex items-center justify-center mb-1 relative">
                <span className="text-2xl md:text-3xl lg:text-4xl drop-shadow">{badge.icon}</span>
                {badge.rarity === "legendary" && (
                  <span className="absolute -top-2 -right-2">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-xs md:text-sm font-bold text-gray-900 drop-shadow-sm truncate max-w-[80px]">{badge.name}</span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    badge.rarity === "legendary"
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                      : badge.rarity === "epic"
                      ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                      : badge.rarity === "rare"
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {getRarityLabel(badge.rarity)}
                </Badge>
              </div>
              <p className="text-gray-700 text-[11px] leading-snug mb-1 min-h-[28px] line-clamp-2">{badge.description}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-auto">
                <Calendar className="w-3 h-3" />
                <span>Earned {badge.earned}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
